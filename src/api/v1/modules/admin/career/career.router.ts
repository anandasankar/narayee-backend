import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../../../../middleware/auth.middleware';
import validateRequest from '../../../../../middleware/validate.request';
import { careerController } from './career.controller';
import {
  createCareerSchema,
  deleteCareerSchema,
  getAllCareerSchema,
  getCareerByIdSchema,
  updateCareerSchema,
} from './career.validation';

const careerRouter = Router();

careerRouter.post(
  '/',
  isAuthenticated,
  isAdmin,
  validateRequest(createCareerSchema),
  careerController.createCareer,
);

careerRouter.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(updateCareerSchema),
  careerController.updateCareer,
);

careerRouter.get('/', validateRequest(getAllCareerSchema), careerController.getAllCareer);

careerRouter.get('/:id', validateRequest(getCareerByIdSchema), careerController.getCareerById);

careerRouter.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  validateRequest(deleteCareerSchema),
  careerController.deleteCareer,
);

export default careerRouter;
