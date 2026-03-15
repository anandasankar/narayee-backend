import { Router } from 'express';
import adminRouter from './admin/admin.router';
import userRouter from './user/user.router';

const mainRouter = Router();

mainRouter.use(adminRouter);
mainRouter.use(userRouter);

export default mainRouter;
