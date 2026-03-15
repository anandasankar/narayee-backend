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
import { CreateAdminDTO, GetAdminDTO, UpdateAdminDTO } from './account.interface';
import { adminMessage } from './account.message';
import { adminRepository } from './account.repository';

class AdminService {
  async createAdmin(data: CreateAdminDTO): Promise<void> {
    const activeAdmin = await adminRepository.getAdmin();

    if (activeAdmin) {
      throw new AppError(HttpStatusCode.CONFLICT, adminMessage.ADMIN_ALREADY_EXISTS, false);
    }

    const existingAdmin = await adminRepository.findConflictingAdmin(data.email, data.mobileNumber);

    const hashedPassword = await hashPassword(data.password);

    if (existingAdmin) {
      if (existingAdmin.deleted) {
        await adminRepository.updateAdmin(existingAdmin.id, {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          mobileNumber: data.mobileNumber,
          password: hashedPassword,
          deleted: false,
          active: true,
        });

        return;
      }

      throw new AppError(HttpStatusCode.CONFLICT, adminMessage.ADMIN_ALREADY_EXISTS, false);
    }

    await adminRepository.createAdmin({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: hashedPassword,
    });
  }
  async getAdminById(id: string): Promise<GetAdminDTO | null> {
    const admin = await adminRepository.getAdminById(id);
    if (!admin) {
      throw new AppError(HttpStatusCode.NOT_FOUND, adminMessage.ADMIN_NOT_FOUND, false);
    }
    const adminDTO: GetAdminDTO = {
      id: admin.id,
      firstName: admin.firstName,
      middleName: admin.middleName,
      lastName: admin.lastName,
      email: admin.email,
      mobileNumber: admin.mobileNumber,
    };

    return adminDTO;
  }

  async updateAdmin(id: string, data: UpdateAdminDTO): Promise<void> {
    await this.getAdminById(id);
    if (data.email || data.mobileNumber) {
      const conflictAdmin = await adminRepository.findConflictingAdmin(
        data.email,
        data.mobileNumber,
        id,
      );

      if (conflictAdmin) {
        throw new AppError(
          HttpStatusCode.CONFLICT,
          adminMessage.ADMIN_EMAIL_OR_MOBILE_ALREADY_EXISTS,
          false,
        );
      }
    }
    await adminRepository.updateAdmin(id, data);
  }

  async getAllAdmins(
    filterObject: UnparsedFilterObject,
  ): Promise<{ count: number; result: GetAdminDTO[] }> {
    const pageNo = filterObject.pageNo ? parseInt(filterObject.pageNo, 10) : 1;
    const limit = filterObject.limit ? parseInt(filterObject.limit, 10) : 10;

    const admins = await adminRepository.getAllAdmin({
      paginationData: {
        pageNo,
        limit,
      },
    });

    return admins;
  }

  async deleteAdmin(id: string, password: string): Promise<void> {
    const admin = await adminRepository.getAdminById(id);

    if (!admin || admin.deleted) {
      throw new AppError(HttpStatusCode.NOT_FOUND, adminMessage.ADMIN_NOT_FOUND, false);
    }

    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, adminMessage.INVALID_CURRENT_PASSWORD, false);
    }
    await adminRepository.deleteAdmin(id);
  }

  async loginAdmin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const admin = await adminRepository.getAdminByEmail(email);

    if (!admin) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, adminMessage.INVALID_CREDENTIALS, false);
    }

    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, adminMessage.INVALID_CREDENTIALS, false);
    }

    await deleteAllUserRefreshTokens(admin.id);

    const accessToken = generateAccessToken(admin.id, admin.email);

    const { refreshToken, tokenId } = generateRefreshToken(admin.id, admin.email);
    await storeRefreshToken(admin.id, tokenId, refreshToken);
    return { accessToken, refreshToken };
  }

  async logoutAdmin(oldRefreshToken: string): Promise<void> {
    const { id: userId, tokenId } = verifyRefreshToken(oldRefreshToken);
    await deleteRefreshToken(userId, tokenId);
  }

  async refreshAdminToken(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id: userId, email, tokenId } = verifyRefreshToken(oldRefreshToken);

    const isValid = await validateStoredRefreshToken(userId, tokenId, oldRefreshToken);
    if (!isValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
    }

    const admin = await adminRepository.getAdminById(userId);
    if (!admin || !admin.active || admin.deleted) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
    }

    await deleteRefreshToken(userId, tokenId);

    const accessToken = generateAccessToken(userId, email);
    const { refreshToken, tokenId: newTokenId } = generateRefreshToken(userId, email);

    await storeRefreshToken(userId, newTokenId, refreshToken);

    return { accessToken, refreshToken };
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void> {
    const admin = await adminRepository.getAdminById(adminId);

    if (!admin || admin.deleted) {
      throw new AppError(HttpStatusCode.NOT_FOUND, adminMessage.ADMIN_NOT_FOUND, false);
    }

    const isPasswordValid = await verifyPassword(currentPassword, admin.password);

    if (!isPasswordValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, adminMessage.INVALID_CURRENT_PASSWORD, false);
    }

    const hashedPassword = await hashPassword(newPassword);

    await adminRepository.updateAdmin(adminId, {
      password: hashedPassword,
    });
  }
}

export const adminService = new AdminService();
