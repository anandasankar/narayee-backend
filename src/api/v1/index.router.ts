import { Router } from 'express';
import adminRouter from './modules/Admin/admin.router';
import userRouter from './modules/User/user.router';

const mainRouter = Router();

mainRouter.use('/admin', adminRouter);
mainRouter.use('/user', userRouter);

export default mainRouter;
