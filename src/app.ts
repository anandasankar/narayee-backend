import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import mainRouter from './api/v1/index.router';
import { commonMessages } from './constants/common.messages';
import { globalErrorHandler } from './errors/globalErrorHandler';
import { loadAndMergeSwaggerSpecs, swaggerOptions } from './swagger/loader';
import { HttpStatusCode } from './types/HttpStatusCode';
import {
  corsOptions,
  helmetMiddleware,
  morganMiddleware,
  rateLimiter,
  requestValidator,
} from './utils/common.middleware';
import { sendResponse } from './utils/send.response';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(corsOptions());
app.use(helmetMiddleware);
app.use(rateLimiter);
app.use(hpp());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(compression());
app.use(morganMiddleware);

const responseBodyMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  const originalSend = res.send;

  res.send = function (body: unknown): Response {
    res.locals.body = body;
    return originalSend.call(this, body);
  };
  next();
};

app.use(responseBodyMiddleware);
app.use(requestValidator);

const swaggerSpec = loadAndMergeSwaggerSpecs();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

app.get('/', (_req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).json({
    success: true,
    message: 'API Running...',
  });
});

app.use('/api/v1', mainRouter);

app.use((_req: Request, res: Response) => {
  return sendResponse(res, {
    success: false,
    statusCode: HttpStatusCode.NOT_FOUND,
    message: commonMessages.ROUTE_NOT_FOUND,
  });
});

app.use(globalErrorHandler);

export default app;
