import { Router } from 'express';
import { authRateLimiter } from '../../../../../utils/common.middleware';
import { isAdmin, isAuthenticated } from '../../../middleware/auth.middleware';
import validateRequest from '../../../middleware/validate.request';
import { adminController } from './admin.auth.controller';
import {
  changePasswordSchema,
  createAdminSchema,
  deleteAdminSchema,
  getAllAdminSchema,
  loginAdminSchema,
  refreshTokenSchema,
  updateAdminSchema,
} from './admin.auth.validation';

const adminAuthRouter = Router();

adminAuthRouter.post('/register', validateRequest(createAdminSchema), adminController.createAdmin);

adminAuthRouter.put(
  '/me',
  isAuthenticated,
  validateRequest(updateAdminSchema),
  adminController.updateAdmin,
);

adminAuthRouter.get(
  '/get-all',
  isAuthenticated,
  isAdmin,
  validateRequest(getAllAdminSchema),
  adminController.getAllAdmins,
);

adminAuthRouter.get('/me', isAuthenticated, isAdmin, adminController.getAdminById);

adminAuthRouter.delete(
  '/me',
  validateRequest(deleteAdminSchema),
  isAuthenticated,
  adminController.deleteAdmin,
);

adminAuthRouter.post(
  '/login',
  authRateLimiter,
  validateRequest(loginAdminSchema),
  adminController.loginAdmin,
);

adminAuthRouter.post('/logout', isAuthenticated, adminController.logoutAdmin);

adminAuthRouter.post(
  '/refresh-token',
  validateRequest(refreshTokenSchema),
  adminController.refreshToken,
);

adminAuthRouter.post(
  '/change-password',
  isAuthenticated,
  validateRequest(changePasswordSchema),
  adminController.changePassword,
);

//TODO: Forgot Password API(send email otp)

export default adminAuthRouter;
