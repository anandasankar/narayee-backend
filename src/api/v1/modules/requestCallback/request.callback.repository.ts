import { CallbackRequest, CallbackStatus, Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { GetAllResponseDTO } from '../../../../types/common.type';
import { paginationMethod } from '../../../../utils/helper.utils';
import {
  CallbackRequestFilterDTO,
  CreateCallbackRequestDTO,
  UpdateCallbackRequestDTO,
} from './request.callback.interface';

class CallbackRequestRepository {
  async createCallbackRequest(data: CreateCallbackRequestDTO): Promise<string> {
    const callbackRequest = await prisma.callbackRequest.create({
      data: {
        name: data.name,
        mobileNumber: data.mobileNumber,
        preferredAt: data.preferredAt,
        enquiryType: data.enquiryType,
        notes: data.notes ?? null,
      },
    });

    return callbackRequest.id;
  }

  async updateCallbackRequest(id: string, data: UpdateCallbackRequestDTO): Promise<void> {
    await prisma.callbackRequest.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
  }

  async getCallbackRequestById(id: string): Promise<CallbackRequest | null> {
    return await prisma.callbackRequest.findUnique({
      where: { id },
    });
  }

  async getPendingOrScheduledByMobile(mobileNumber: string): Promise<CallbackRequest | null> {
    return await prisma.callbackRequest.findFirst({
      where: {
        mobileNumber,
        status: {
          in: [CallbackStatus.PENDING, CallbackStatus.SCHEDULED],
        },
      },
    });
  }

  async getAllCallbackRequests({
    filters = {},
    paginationData,
  }: {
    filters?: CallbackRequestFilterDTO;
    paginationData: { pageNo: number; limit: number };
  }): Promise<GetAllResponseDTO> {
    const pagination = paginationMethod(Number(paginationData.pageNo), Number(paginationData.limit));

    const whereClause: Prisma.CallbackRequestWhereInput = {};

    if (filters) {
      if (filters.name) {
        whereClause.name = {
          contains: filters.name,
          mode: 'insensitive',
        };
      }

      if (filters.mobileNumber) {
        whereClause.mobileNumber = filters.mobileNumber;
      }

      if (filters.enquiryType) {
        whereClause.enquiryType = filters.enquiryType;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.preferredAt) {
        whereClause.preferredAt = filters.preferredAt;
      }
    }

    const [callbackRequests, count] = await prisma.$transaction([
      prisma.callbackRequest.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.callbackRequest.count({
        where: whereClause,
      }),
    ]);

    return {
      count,
      result: callbackRequests,
    };
  }

  async deleteCallbackRequest(id: string): Promise<void> {
    await prisma.callbackRequest.delete({
      where: { id },
    });
  }
}

export const callbackRequestRepository = new CallbackRequestRepository();
