import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { sendResponse } from '../../../../utils/send.response';
import { announcementMessage } from './announcement.message';
import { announcementService } from './announcement.service';

class AnnouncementController {
  async createAnnouncement(req: Request, res: Response): Promise<void> {
    await announcementService.createAnnouncement(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      message: announcementMessage.ANNOUNCEMENT_CREATED_SUCCESSFULLY,
    });
  }

  async getAnnouncementById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const announcement = await announcementService.getAnnouncementById(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: announcementMessage.ANNOUNCEMENT_FETCHED_SUCCESSFULLY,
      data: announcement,
    });
  }

  async updateAnnouncement(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await announcementService.updateAnnouncement(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: announcementMessage.ANNOUNCEMENT_UPDATED_SUCCESSFULLY,
    });
  }

  // Admin — all announcements
  async getAllAnnouncements(req: Request, res: Response): Promise<void> {
    const { pageNo, limit, filter } = req.query;

    const announcements = await announcementService.getAllAnnouncements({
      pageNo: pageNo as string,
      limit: limit as string,
      filter: filter as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: announcementMessage.ANNOUNCEMENTS_FETCHED_SUCCESSFULLY,
      data: announcements,
    });
  }

  // Public — active announcements only
  async getActiveAnnouncements(req: Request, res: Response): Promise<void> {
    const { pageNo, limit, filter } = req.query;

    const announcements = await announcementService.getActiveAnnouncements({
      pageNo: pageNo as string,
      limit: limit as string,
      filter: filter as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: announcementMessage.ANNOUNCEMENTS_FETCHED_SUCCESSFULLY,
      data: announcements,
    });
  }

  async deleteAnnouncement(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await announcementService.deleteAnnouncement(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: announcementMessage.ANNOUNCEMENT_DELETED_SUCCESSFULLY,
    });
  }
}

export const announcementController = new AnnouncementController();
