import { Career, Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { GetAllResponseDTO } from '../../../../types/common.type';
import { paginationMethod } from '../../../../utils/helper.utils';
import { CareerFilterDTO, CreateCareerDTO, UpdateCareerDTO } from './career.interface';

class CareerRepository {
  async createCareer(data: CreateCareerDTO): Promise<string> {
    const career = await prisma.career.create({
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        duration: data.duration,
        level: data.level,
        image: data.image ?? null,
      },
    });

    return career.id;
  }

  async updateCareer(id: string, data: UpdateCareerDTO): Promise<void> {
    await prisma.career.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        duration: data.duration,
        level: data.level,
        image: data.image,
      },
    });
  }

  async getCareerById(id: string): Promise<Career | null> {
    return await prisma.career.findUnique({
      where: {
        id,
      },
    });
  }

  async getCareerByTitle(title: string): Promise<Career | null> {
    return await prisma.career.findFirst({
      where: {
        title,
      },
    });
  }

  async getAllCareer({
    filters = {},
    paginationData,
  }: {
    filters?: CareerFilterDTO;
    paginationData: { pageNo: number; limit: number };
  }): Promise<GetAllResponseDTO> {
    const pagination = paginationMethod(Number(paginationData.pageNo), Number(paginationData.limit));

    // const whereClause: Record<string, unknown> = {};
    const whereClause: Prisma.CareerWhereInput = {};

    if (filters) {
      if (filters.level) {
        whereClause.level = {
          has: filters.level,
        };
      }
      if (filters.duration) {
        whereClause.duration = filters.duration;
      }

      if (filters.title) {
        whereClause.title = {
          contains: filters.title,
          mode: 'insensitive',
        };
      }
    }

    const [careers, count] = await prisma.$transaction([
      prisma.career.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.career.count({
        where: whereClause,
      }),
    ]);

    return {
      count,
      result: careers,
    };
  }

  async deleteCareer(id: string): Promise<void> {
    await prisma.career.delete({
      where: {
        id,
      },
    });
  }
}

export const careerRepository = new CareerRepository();
