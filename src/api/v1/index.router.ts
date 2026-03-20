import { Router } from 'express';
import adminRouter from './routes/admin.router';
import userRouter from './routes/user.router';

const mainRouter = Router();

mainRouter.use(adminRouter);
mainRouter.use(userRouter);

export default mainRouter;
