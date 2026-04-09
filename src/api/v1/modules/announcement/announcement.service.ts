import { Announcement } from '@prisma/client';
import { AppError } from '../../../../errors/AppError';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { GetAllResponseDTO, UnparsedFilterObject } from '../../../../types/common.type';
import { CreateAnnouncementDTO, UpdateAnnouncementDTO } from './announcement.interface';
import { announcementMessage } from './announcement.message';
import { announcementRepository } from './announcement.repository';

class AnnouncementService {
  async createAnnouncement(data: CreateAnnouncementDTO): Promise<void> {
    await announcementRepository.createAnnouncement(data);
  }

  async getAnnouncementById(id: string): Promise<Announcement> {
    const announcement = await announcementRepository.getAnnouncementById(id);

    if (!announcement) {
      throw new AppError(HttpStatusCode.NOT_FOUND, announcementMessage.ANNOUNCEMENT_NOT_FOUND, false);
    }

    return announcement;
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementDTO): Promise<void> {
    await this.getAnnouncementById(id);
    await announcementRepository.updateAnnouncement(id, data);
  }

  // Admin — paginated list of all announcements
  async getAllAnnouncements(filterObject: UnparsedFilterObject): Promise<GetAllResponseDTO> {
    return await announcementRepository.getAllAnnouncements({
      paginationData: {
        pageNo: filterObject.pageNo ? parseInt(filterObject.pageNo) : 1,
        limit: filterObject.limit ? parseInt(filterObject.limit) : 10,
      },
      filters: filterObject.filter ? JSON.parse(filterObject.filter) : undefined,
    });
  }

  // Public — only active, published, non-expired announcements
  async getActiveAnnouncements(filterObject: UnparsedFilterObject): Promise<GetAllResponseDTO> {
    return await announcementRepository.getActiveAnnouncements({
      paginationData: {
        pageNo: filterObject.pageNo ? parseInt(filterObject.pageNo) : 1,
        limit: filterObject.limit ? parseInt(filterObject.limit) : 10,
      },
      filters: filterObject.filter ? JSON.parse(filterObject.filter) : undefined,
    });
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.getAnnouncementById(id);
    await announcementRepository.deleteAnnouncement(id);
  }
}

export const announcementService = new AnnouncementService();
