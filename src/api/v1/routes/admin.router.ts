import { Router } from 'express';
import adminAccountRouter from '../modules/admin/account/account.router';
import careerRouter from '../modules/career/career.router';

const adminRouter = Router();

adminRouter.use('/account', adminAccountRouter);
adminRouter.use('/career', careerRouter);

export default adminRouter;
