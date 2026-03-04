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
