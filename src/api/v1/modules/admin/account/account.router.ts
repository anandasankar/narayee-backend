import { Router } from 'express';
import { authRateLimiter } from '../../../../../utils/common.middleware';
import { isAdmin, isAuthenticated } from '../../../middleware/auth.middleware';
import validateRequest from '../../../middleware/validate.request';
import { adminController } from './account.controller';
import {
  changePasswordSchema,
  createAdminSchema,
  deleteAdminSchema,
  getAllAdminSchema,
  loginAdminSchema,
  refreshTokenSchema,
  updateAdminSchema,
} from './account.validation';

const adminAccountRouter = Router();

adminAccountRouter.post('/admin', validateRequest(createAdminSchema), adminController.createAdmin);

adminAccountRouter.put(
  '/admin',
  isAuthenticated,
  validateRequest(updateAdminSchema),
  adminController.updateAdmin,
);

adminAccountRouter.get(
  '/admin',
  isAuthenticated,
  isAdmin,
  validateRequest(getAllAdminSchema),
  adminController.getAllAdmins,
);

adminAccountRouter.get('/admin/me', isAuthenticated, isAdmin, adminController.getAdminById);

adminAccountRouter.delete(
  '/admin',
  validateRequest(deleteAdminSchema),
  isAuthenticated,
  adminController.deleteAdmin,
);

adminAccountRouter.post(
  '/admin/login',
  authRateLimiter,
  validateRequest(loginAdminSchema),
  adminController.loginAdmin,
);

adminAccountRouter.post('/admin/logout', isAuthenticated, adminController.logoutAdmin);

adminAccountRouter.post(
  '/admin/refresh-token',
  validateRequest(refreshTokenSchema),
  adminController.refreshToken,
);

adminAccountRouter.post(
  '/admin/change-password',
  isAuthenticated,
  validateRequest(changePasswordSchema),
  adminController.changePassword,
);

//TODO: Forgot Password API(send email otp)

export default adminAccountRouter;
