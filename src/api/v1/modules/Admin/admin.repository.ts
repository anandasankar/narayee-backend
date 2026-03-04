import { Admin, Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { paginationMethod } from '../../../../utils/helper.utils';
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

  async findConflictingAdmin(
    email?: string,
    mobileNumber?: string,
    excludeId?: string,
  ): Promise<Admin | null> {
    const orConditions: Prisma.AdminWhereInput[] = [];

    if (email) {
      orConditions.push({
        email: {
          equals: email,
          mode: 'insensitive',
        },
      });
    }

    if (mobileNumber) {
      orConditions.push({
        mobileNumber: mobileNumber,
      });
    }

    if (orConditions.length === 0) {
      return null;
    }

    const whereClause: Prisma.AdminWhereInput = {
      OR: orConditions,
    };

    if (excludeId) {
      whereClause.id = {
        not: excludeId,
      };
    }

    return await prisma.admin.findFirst({
      where: whereClause,
    });
  }

  async getAdmin(): Promise<Admin | null> {
    return await prisma.admin.findFirst({
      where: {
        deleted: false,
      },
    });
  }

  async updateAdmin(id: string, data: UpdateAdminDTO): Promise<void> {
    await prisma.admin.update({
      where: { id },
      data,
    });
  }

  async getAdminById(id: string): Promise<Admin | null> {
    const admin = await prisma.admin.findFirst({
      where: {
        id,
        deleted: false,
      },
    });

    if (!admin) return null;

    return admin;
  }

  async getAllAdmin({
    paginationData,
  }: {
    paginationData: {
      pageNo: number;
      limit: number;
    };
  }): Promise<{ count: number; result: GetAdminDTO[] }> {
    const pagination = paginationMethod(Number(paginationData.pageNo), Number(paginationData.limit));
    const whereClause: Prisma.AdminWhereInput = {
      deleted: false,
    };

    const [admins, count] = await prisma.$transaction([
      prisma.admin.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          mobileNumber: true,
        },
      }),
      prisma.admin.count({
        where: whereClause,
      }),
    ]);

    return {
      count,
      result: admins,
    };
  }

  async deleteAdmin(id: string): Promise<void> {
    await prisma.admin.update({
      where: { id },
      data: {
        deleted: true,
        active: false,
      },
    });
  }

  async getAdminByEmail(email: string): Promise<Admin | null> {
    return prisma.admin.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        deleted: false,
      },
    });
  }
}

export const adminRepository = new AdminRepository();
