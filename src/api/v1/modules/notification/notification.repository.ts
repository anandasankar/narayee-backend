import { Notification, Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { GetAllResponseDTO } from '../../../../types/common.type';
import { paginationMethod } from '../../../../utils/helper.utils';
import {
  CreateNotificationDTO,
  NotificationFilterDTO,
  UpdateNotificationDTO,
} from './notification.interface';

class NotificationRepository {
  async createNotification(data: CreateNotificationDTO): Promise<string> {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        publishedAt: data.publishedAt ?? undefined,
        expiresAt: data.expiresAt ?? null,
      },
    });

    return notification.id;
  }

  async updateNotification(id: string, data: UpdateNotificationDTO): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        publishedAt: data.publishedAt,
        expiresAt: data.expiresAt,
        active: data.active,
      },
    });
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return await prisma.notification.findUnique({
      where: { id, deleted: false },
    });
  }

  // Admin — sees all non-deleted notifications regardless of active/expiry
  async getAllNotifications({
    filters = {},
    paginationData,
  }: {
    filters?: NotificationFilterDTO;
    paginationData: { pageNo: number; limit: number };
  }): Promise<GetAllResponseDTO> {
    const pagination = paginationMethod(Number(paginationData.pageNo), Number(paginationData.limit));

    const whereClause: Prisma.NotificationWhereInput = {
      deleted: false,
    };

    if (filters.title) {
      whereClause.title = {
        contains: filters.title,
        mode: 'insensitive',
      };
    }

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.active !== undefined) {
      whereClause.active = filters.active;
    }

    const [notifications, count] = await prisma.$transaction([
      prisma.notification.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.notification.count({ where: whereClause }),
    ]);

    return { count, result: notifications };
  }

  // Public — only active, non-deleted, non-expired notifications
  async getActiveNotifications({
    filters = {},
    paginationData,
  }: {
    filters?: NotificationFilterDTO;
    paginationData: { pageNo: number; limit: number };
  }): Promise<GetAllResponseDTO> {
    const pagination = paginationMethod(Number(paginationData.pageNo), Number(paginationData.limit));

    const now = new Date();

    const whereClause: Prisma.NotificationWhereInput = {
      deleted: false,
      active: true,
      publishedAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    };

    if (filters.title) {
      whereClause.title = {
        contains: filters.title,
        mode: 'insensitive',
      };
    }

    if (filters.type) {
      whereClause.type = filters.type;
    }

    const [notifications, count] = await prisma.$transaction([
      prisma.notification.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: whereClause }),
    ]);

    return { count, result: notifications };
  }

  async deleteNotification(id: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: { deleted: true },
    });
  }
}

export const notificationRepository = new NotificationRepository();
