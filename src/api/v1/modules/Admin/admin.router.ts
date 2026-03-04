import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../../../middleware/auth.middleware';
import validateRequest from '../../../../middleware/validate.request';
import { adminController } from './admin.controller';
import {
  adminByIdSchema,
  createAdminSchema,
  getAllAdminSchema,
  loginAdminSchema,
  updateAdminSchema,
} from './admin.validation';

const adminRouter = Router();

adminRouter.post('/create', validateRequest(createAdminSchema), adminController.createAdmin);

adminRouter.put(
  '/update/:id',
  isAuthenticated,
  isAdmin,
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

adminRouter.delete(
  '/delete/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(adminByIdSchema),
  adminController.deleteAdmin,
);

adminRouter.post('/login', validateRequest(loginAdminSchema), adminController.loginAdmin);
adminRouter.post('/logout', isAuthenticated, adminController.logoutAdmin);

export default adminRouter;
