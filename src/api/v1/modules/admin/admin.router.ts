import { Router } from 'express';
import adminAccountRouter from './account/account.router';
import careerRouter from './career/career.router';

const adminRouter = Router();

adminRouter.use('/account', adminAccountRouter);
adminRouter.use('/career', careerRouter);

export default adminRouter;
