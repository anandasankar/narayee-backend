import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validate.request';
import { announcementController } from './announcement.controller';
import {
  createAnnouncementSchema,
  deleteAnnouncementSchema,
  getAllAnnouncementsSchema,
  getAnnouncementByIdSchema,
  updateAnnouncementSchema,
} from './announcement.validation';

const announcementRouter = Router();

// ── Admin routes ──────────────────────────────────────────────
announcementRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  validateRequest(createAnnouncementSchema),
  announcementController.createAnnouncement,
);

announcementRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(updateAnnouncementSchema),
  announcementController.updateAnnouncement,
);

announcementRouter.get(
  '/admin/all',
  isAuthenticated,
  isAdmin,
  validateRequest(getAllAnnouncementsSchema),
  announcementController.getAllAnnouncements,
);

announcementRouter.get(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(getAnnouncementByIdSchema),
  announcementController.getAnnouncementById,
);

announcementRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(deleteAnnouncementSchema),
  announcementController.deleteAnnouncement,
);

// ── Public routes ─────────────────────────────────────────────
announcementRouter.get(
  '/',
  validateRequest(getAllAnnouncementsSchema),
  announcementController.getActiveAnnouncements,
);

export default announcementRouter;
