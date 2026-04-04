import { commonMessages } from '../../../../../constants/common.messages';
import { AppError } from '../../../../../errors/AppError';
import { UnparsedFilterObject } from '../../../../../types/common.type';
import { HttpStatusCode } from '../../../../../types/HttpStatusCode';
import { hashPassword, verifyPassword } from '../../../../../utils/password.manager';
import {
  deleteAllUserRefreshTokens,
  deleteRefreshToken,
  storeRefreshToken,
  validateStoredRefreshToken,
} from '../../../../../utils/refresh.manager';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../../../../utils/token.manager';
import { CreateUserDTO, GetUserDTO, UpdateUserDTO } from './user.auth.interface';
import { userMessage } from './user.auth.messages';
import { userRepository } from './user.auth.repository';

class UserService {
  async createUser(data: CreateUserDTO): Promise<void> {
    const existingUser = await userRepository.findConflictingUser(data.mobileNumber, data.email);

    const hashedPassword = await hashPassword(data.password);

    if (existingUser) {
      throw new AppError(HttpStatusCode.CONFLICT, userMessage.USER_ALREADY_EXISTS, false);
    }

    await userRepository.createUser({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: hashedPassword,
    });
  }

  async getUserById(id: string): Promise<GetUserDTO | null> {
    const user = await userRepository.getUserDetailsById(id);

    if (!user) {
      throw new AppError(HttpStatusCode.NOT_FOUND, userMessage.USER_NOT_FOUND, false);
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<void> {
    await this.getUserById(id);

    if (data.email) {
      const conflictUser = await userRepository.findConflictingUser(data.email, id);

      if (conflictUser) {
        throw new AppError(HttpStatusCode.CONFLICT, userMessage.USER_EMAIL_ALREADY_EXISTS, false);
      }
    }

    await userRepository.updateUser(id, data);
  }

  async getAllUsers(
    filterObject: UnparsedFilterObject & { search?: string },
  ): Promise<{ count: number; result: GetUserDTO[] }> {
    const pageNo = filterObject.pageNo ? parseInt(filterObject.pageNo, 10) : 1;
    const limit = filterObject.limit ? parseInt(filterObject.limit, 10) : 10;

    return await userRepository.getAllUsers({
      paginationData: { pageNo, limit },
      search: filterObject.search,
    });
  }

  async deleteUser(id: string, password: string): Promise<void> {
    const user = await userRepository.getUserById(id);

    if (!user || user.deleted) {
      throw new AppError(HttpStatusCode.NOT_FOUND, userMessage.USER_NOT_FOUND, false);
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, userMessage.INVALID_CURRENT_PASSWORD, false);
    }

    await deleteAllUserRefreshTokens(id);
    await userRepository.deleteUser(id);
  }

  async loginUser(
    identifier: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user;

    const isEmail = identifier.includes('@');

    if (isEmail) {
      user = await userRepository.getUserByEmail(identifier);
    } else {
      const formattedMobile = `+91${identifier}`;
      user = await userRepository.getUserByMobile(formattedMobile);
    }

    if (!user) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, userMessage.INVALID_CREDENTIALS, false);
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, userMessage.INVALID_CREDENTIALS, false);
    }

    if (!user.active) {
      throw new AppError(HttpStatusCode.FORBIDDEN, commonMessages.UNAUTHORIZED, false);
    }

    await deleteAllUserRefreshTokens(user.id);

    const accessToken = generateAccessToken(user.id, user.mobileNumber);
    const { refreshToken, tokenId } = generateRefreshToken(user.id, user.mobileNumber);

    await storeRefreshToken(user.id, tokenId, refreshToken);

    return { accessToken, refreshToken };
  }

  async logoutUser(oldRefreshToken: string): Promise<void> {
    const { id: userId, tokenId } = verifyRefreshToken(oldRefreshToken);
    await deleteRefreshToken(userId, tokenId);
  }

  async refreshUserToken(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id: userId, email, tokenId } = verifyRefreshToken(oldRefreshToken);

    const isValid = await validateStoredRefreshToken(userId, tokenId, oldRefreshToken);
    if (!isValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
    }

    const user = await userRepository.getUserById(userId);
    if (!user || !user.active || user.deleted) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
    }

    await deleteRefreshToken(userId, tokenId);

    const accessToken = generateAccessToken(userId, email);
    const { refreshToken, tokenId: newTokenId } = generateRefreshToken(userId, email);
    await storeRefreshToken(userId, newTokenId, refreshToken);

    return { accessToken, refreshToken };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.getUserById(userId);

    if (!user || user.deleted) {
      throw new AppError(HttpStatusCode.NOT_FOUND, userMessage.USER_NOT_FOUND, false);
    }

    const isPasswordValid = await verifyPassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, userMessage.INVALID_CURRENT_PASSWORD, false);
    }

    const hashedPassword = await hashPassword(newPassword);
    await userRepository.updateUser(userId, { password: hashedPassword });
  }
}

export const userService = new UserService();
