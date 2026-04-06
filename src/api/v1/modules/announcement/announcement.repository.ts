import { Announcement, Prisma } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { GetAllResponseDTO } from '../../../../types/common.type';
import { paginationMethod } from '../../../../utils/helper.utils';
import {
  AnnouncementFilterDTO,
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from './announcement.interface';

class AnnouncementRepository {
  async createAnnouncement(data: CreateAnnouncementDTO): Promise<string> {
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        publishedAt: data.publishedAt ?? undefined,
        expiresAt: data.expiresAt ?? null,
      },
    });

    return announcement.id;
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementDTO): Promise<void> {
    await prisma.announcement.update({
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

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    return await prisma.announcement.findUnique({
      where: { id, deleted: false },
    });
  }

  // Admin — sees all non-deleted announcements regardless of active/expiry
  async getAllAnnouncements({
    filters = {},
    paginationData,
  }: {
    filters?: AnnouncementFilterDTO;
    paginationData: { pageNo: number; limit: number };
  }): Promise<GetAllResponseDTO> {
    const pagination = paginationMethod(Number(paginationData.pageNo), Number(paginationData.limit));

    const whereClause: Prisma.AnnouncementWhereInput = {
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

    const [announcements, count] = await prisma.$transaction([
      prisma.announcement.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.announcement.count({ where: whereClause }),
    ]);

    return { count, result: announcements };
  }

  // Public — only active, non-deleted, non-expired announcements
  async getActiveAnnouncements({
    filters = {},
    paginationData,
  }: {
    filters?: AnnouncementFilterDTO;
    paginationData: { pageNo: number; limit: number };
  }): Promise<GetAllResponseDTO> {
    const pagination = paginationMethod(Number(paginationData.pageNo), Number(paginationData.limit));

    const now = new Date();

    const whereClause: Prisma.AnnouncementWhereInput = {
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

    const [announcements, count] = await prisma.$transaction([
      prisma.announcement.findMany({
        where: whereClause,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.announcement.count({ where: whereClause }),
    ]);

    return { count, result: announcements };
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await prisma.announcement.update({
      where: { id },
      data: { deleted: true },
    });
  }
}

export const announcementRepository = new AnnouncementRepository();
