import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';
import validateRequest from '../../middleware/validate.request';
import { callbackRequestController } from './request.callback.controller';
import {
  createCallbackRequestSchema,
  deleteCallbackRequestSchema,
  getAllCallbackRequestsSchema,
  getCallbackRequestByIdSchema,
  updateCallbackRequestSchema,
} from './request.callback.validation';

const callbackRequestRouter = Router();

callbackRequestRouter.post(
  '/',
  validateRequest(createCallbackRequestSchema),
  callbackRequestController.createCallbackRequest,
);

callbackRequestRouter.patch(
  '/:id/status',
  isAuthenticated,
  isAdmin,
  validateRequest(updateCallbackRequestSchema),
  callbackRequestController.updateCallbackRequestStatus,
);

callbackRequestRouter.get(
  '/',
  isAuthenticated,
  isAdmin,
  validateRequest(getAllCallbackRequestsSchema),
  callbackRequestController.getAllCallbackRequests,
);

callbackRequestRouter.get(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(getCallbackRequestByIdSchema),
  callbackRequestController.getCallbackRequestById,
);

callbackRequestRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(deleteCallbackRequestSchema),
  callbackRequestController.deleteCallbackRequest,
);

export default callbackRequestRouter;
