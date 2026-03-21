import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { sendResponse } from '../../../../utils/send.response';
import { notificationMessage } from './notification.message';
import { notificationService } from './notification.service';

class NotificationController {
  async createNotification(req: Request, res: Response): Promise<void> {
    await notificationService.createNotification(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      message: notificationMessage.NOTIFICATION_CREATED_SUCCESSFULLY,
    });
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const notification = await notificationService.getNotificationById(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: notificationMessage.NOTIFICATION_FETCHED_SUCCESSFULLY,
      data: notification,
    });
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await notificationService.updateNotification(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: notificationMessage.NOTIFICATION_UPDATED_SUCCESSFULLY,
    });
  }

  // Admin — all notifications
  async getAllNotifications(req: Request, res: Response): Promise<void> {
    const { pageNo, limit, filter } = req.query;

    const notifications = await notificationService.getAllNotifications({
      pageNo: pageNo as string,
      limit: limit as string,
      filter: filter as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: notificationMessage.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
      data: notifications,
    });
  }

  // Public — active notifications only
  async getActiveNotifications(req: Request, res: Response): Promise<void> {
    const { pageNo, limit, filter } = req.query;

    const notifications = await notificationService.getActiveNotifications({
      pageNo: pageNo as string,
      limit: limit as string,
      filter: filter as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: notificationMessage.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
      data: notifications,
    });
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await notificationService.deleteNotification(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: notificationMessage.NOTIFICATION_DELETED_SUCCESSFULLY,
    });
  }
}

export const notificationController = new NotificationController();
