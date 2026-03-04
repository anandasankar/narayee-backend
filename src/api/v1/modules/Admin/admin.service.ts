import { AppError } from '../../../../errors/AppError';
import { UnparsedFilterObject } from '../../../../types/common.type';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { hashPassword, verifyPassword } from '../../../../utils/password.manager';
import { generateAccessToken } from '../../../../utils/token.manager';
import { CreateAdminDTO, GetAdminDTO, UpdateAdminDTO } from './admin.interface';
import { adminMessage } from './admin.message';
import { adminRepository } from './admin.repository';

class AdminService {
  async createAdmin(data: CreateAdminDTO): Promise<void> {
    const existingAdmin = await adminRepository.getAdmin();
    if (existingAdmin) {
      throw new AppError(HttpStatusCode.CONFLICT, adminMessage.ADMIN_ALREADY_EXISTS, false);
    }

    const hashedPassword = await hashPassword(data.password);
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
      throw new AppError(HttpStatusCode.CONFLICT, adminMessage.ADMIN_NOT_FOUND, false);
    }
    return admin;
  }

  async updateAdmin(id: string, data: UpdateAdminDTO): Promise<void> {
    await this.getAdminById(id);
    if (data.email || data.mobileNumber) {
      const conflictAdmin = await adminRepository.findDuplicateAdmin(data.email, data.mobileNumber, id);

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

  async deleteAdmin(id: string): Promise<void> {
    await this.getAdminById(id);
    await adminRepository.deleteAdmin(id);
  }

  async loginAdmin(email: string, password: string): Promise<string> {
    const admin = await adminRepository.getAdminByEmail(email);

    if (!admin) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, adminMessage.INVALID_CREDENTIALS, false);
    }

    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      throw new AppError(HttpStatusCode.UNAUTHORIZED, adminMessage.INVALID_CREDENTIALS, false);
    }

    const accessToken = generateAccessToken(admin.id, admin.email);

    return accessToken;
  }
}

export const adminService = new AdminService();
