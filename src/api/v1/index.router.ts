import { Router } from 'express';
import adminAuthRouter from './modules/admin/auth/admin.auth.router';
import careerRouter from './modules/career/career.router';
import notificationRouter from './modules/notification/notification.router';
import callbackRequestRouter from './modules/requestCallback/request.callback.router';
import userAuthRouter from './modules/user/auth/user.auth.router';

const mainRouter = Router();

mainRouter.use('/auth/admin', adminAuthRouter);
mainRouter.use('/career', careerRouter);
mainRouter.use('/callback-requests', callbackRequestRouter);
mainRouter.use('/notification', notificationRouter);
mainRouter.use('/auth/user', userAuthRouter);

export default mainRouter;
