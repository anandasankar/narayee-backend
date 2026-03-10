import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../../../middleware/auth.middleware';
import validateRequest from '../../../../middleware/validate.request';
import { adminController } from './admin.controller';
import {
  changePasswordSchema,
  createAdminSchema,
  getAllAdminSchema,
  loginAdminSchema,
  updateAdminSchema,
} from './admin.validation';

const adminRouter = Router();

adminRouter.post('/create', validateRequest(createAdminSchema), adminController.createAdmin);

adminRouter.put(
  '/update',
  isAuthenticated,
  validateRequest(updateAdminSchema),
  adminController.updateAdmin,
);

adminRouter.get(
  '/get-all',
  isAuthenticated,
  isAdmin,
  validateRequest(getAllAdminSchema),
  adminController.getAllAdmins,
);

adminRouter.get('/profile/me', isAuthenticated, isAdmin, adminController.getAdminById);

adminRouter.delete('/delete', isAuthenticated, adminController.deleteAdmin);

adminRouter.post('/login', validateRequest(loginAdminSchema), adminController.loginAdmin);
adminRouter.post('/logout', isAuthenticated, adminController.logoutAdmin);

adminRouter.post(
  '/change-password',
  isAuthenticated,
  validateRequest(changePasswordSchema),
  adminController.changePassword,
);

//TODO: Forgot Password API(send email otp)
//TODO: Google Login API
//TODO: Refresh Token API

export default adminRouter;
