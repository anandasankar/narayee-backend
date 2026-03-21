import { Router } from 'express';
import adminAccountRouter from './modules/admin/account/account.router';
import careerRouter from './modules/career/career.router';
import notificationRouter from './modules/notification/notification.router';
import callbackRequestRouter from './modules/requestCallback/request.callback.router';

const mainRouter = Router();

mainRouter.use('/account', adminAccountRouter);
mainRouter.use('/career', careerRouter);
mainRouter.use('/callback-requests', callbackRequestRouter);
mainRouter.use('/notification', notificationRouter);

export default mainRouter;
