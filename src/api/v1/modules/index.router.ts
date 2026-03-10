import { Router } from 'express';
import adminRouter from './Admin/admin.router';
import userRouter from './User/user.router';

const mainRouter = Router();

mainRouter.use('/admin', adminRouter);
mainRouter.use('/user', userRouter);

export default mainRouter;
