import { Prisma, User } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { paginationMethod } from '../../../../../utils/helper.utils';
import { CreateUserDTO, GetUserDTO, UpdateUserDTO } from './user.auth.interface';

class UserRepository {
  async createUser(data: CreateUserDTO): Promise<void> {
    await prisma.user.create({
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

  async findConflictingUser(
    mobileNumber?: string,
    email?: string,
    excludeId?: string,
  ): Promise<User | null> {
    const orConditions: Prisma.UserWhereInput[] = [];

    if (mobileNumber) {
      orConditions.push({ mobileNumber });
    }

    if (email) {
      orConditions.push({
        email: {
          equals: email,
          mode: 'insensitive',
        },
      });
    }

    if (orConditions.length === 0) return null;

    const whereClause: Prisma.UserWhereInput = {
      OR: orConditions,
      deleted: false,
    };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    return await prisma.user.findFirst({ where: whereClause });
  }

  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        id,
        deleted: false,
      },
    });
  }

  async getUserDetailsById(id: string): Promise<GetUserDTO | null> {
    const user = await prisma.user.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        educations: {
          select: {
            college: true,
            degree: true,
            customDegree: true,
            graduationYear: true,
          },
        },
        enrollments: {
          include: {
            career: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      profileCompletion: user.profileCompletion,

      educations: user.educations.map((edu) => ({
        college: edu.college,
        degree: edu.degree === 'OTHER' ? edu.customDegree : edu.degree,
        graduationYear: edu.graduationYear,
      })),

      enrollments: user.enrollments.map((enroll) => ({
        courseId: enroll.career.id,
        courseName: enroll.career.title,
        enrolledAt: enroll.enrolledAt.toISOString(),
        status: enroll.status,
      })),
    };
  }

  async getUserByMobile(mobileNumber: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        mobileNumber,
        deleted: false,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        deleted: false,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<void> {
    await prisma.user.update({
      where: { id },
      data,
    });
  }

  async getAllUsers({
    paginationData,
    search,
  }: {
    paginationData: { pageNo: number; limit: number };
    search?: string;
  }): Promise<{ count: number; result: GetUserDTO[] }> {
    const pagination = paginationMethod(paginationData.pageNo, paginationData.limit);

    const whereClause: Prisma.UserWhereInput = {
      deleted: false,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { mobileNumber: { contains: search } },
        ],
      }),
    };

    const [users, count] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        include: {
          educations: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    const result: GetUserDTO[] = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      profileCompletion: user.profileCompletion,

      educations: user.educations.map((edu) => ({
        college: edu.college ?? null,
        degree: edu.degree === 'OTHER' ? (edu.customDegree ?? null) : (edu.degree ?? null),
        graduationYear: edu.graduationYear ?? null,
      })),
    }));

    return { count, result };
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        deleted: true,
        active: false,
        deletedAt: new Date(),
      },
    });
  }
}

export const userRepository = new UserRepository();
