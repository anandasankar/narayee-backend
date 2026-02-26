import prisma from '../../../../config/db';
import { CreateAdminDTO, GetAdminDTO, UpdateAdminDTO } from './admin.interface';

class AdminRepository {
  async createAdmin(data: CreateAdminDTO): Promise<void> {
    await prisma.admin.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        password: data.password,
      },
    });
  }

  async updateAdmin(id: string, data: UpdateAdminDTO): Promise<void> {
    await prisma.admin.update({
      where: { id },
      data,
    });
  }

  async getAdminById(id: string): Promise<GetAdminDTO | null> {
    const admin = await prisma.admin.findFirst({
      where: {
        id,
        deleted: false,
      },
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        mobileNumber: true,
      },
    });

    if (!admin) return null;

    return admin;
  }
}

export const adminRepository = new AdminRepository();
