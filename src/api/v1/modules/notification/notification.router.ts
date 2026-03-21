import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validate.request';
import { notificationController } from './notification.controller';
import {
  createNotificationSchema,
  deleteNotificationSchema,
  getAllNotificationsSchema,
  getNotificationByIdSchema,
  updateNotificationSchema,
} from './notification.validation';

const notificationRouter = Router();

// ── Admin routes ──────────────────────────────────────────────
notificationRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  validateRequest(createNotificationSchema),
  notificationController.createNotification,
);

notificationRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(updateNotificationSchema),
  notificationController.updateNotification,
);

notificationRouter.get(
  '/admin/all',
  isAuthenticated,
  isAdmin,
  validateRequest(getAllNotificationsSchema),
  notificationController.getAllNotifications,
);

notificationRouter.get(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(getNotificationByIdSchema),
  notificationController.getNotificationById,
);

notificationRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(deleteNotificationSchema),
  notificationController.deleteNotification,
);

// ── Public routes ─────────────────────────────────────────────
notificationRouter.get(
  '/',
  validateRequest(getAllNotificationsSchema),
  notificationController.getActiveNotifications,
);

export default notificationRouter;
