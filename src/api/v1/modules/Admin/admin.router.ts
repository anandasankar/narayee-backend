import { Router } from 'express';
import { adminController } from './admin.controller';
import {
  adminByIdSchema,
  createAdminSchema,
  getAllAdminSchema,
  updateAdminSchema,
} from './admin.validation';
import validateRequest from '../../../../middleware/validate.request';

const adminRouter = Router();

adminRouter.post('/', validateRequest(createAdminSchema), adminController.createAdmin);
adminRouter.put('/:id', validateRequest(updateAdminSchema), adminController.updateAdmin);
adminRouter.get('/', validateRequest(getAllAdminSchema), adminController.getAllAdmins);
adminRouter.get('/:id', validateRequest(adminByIdSchema), adminController.getAdminById);
adminRouter.delete('/:id', validateRequest(adminByIdSchema), adminController.deleteAdmin);

export default adminRouter;
