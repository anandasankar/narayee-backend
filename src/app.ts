import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import hpp from 'hpp';
import { sendResponse } from './utils/sendResponse';
import { globalErrorHandler } from './errors/globalErrorHandler';
import { helmetMiddleware, morganMiddleware, rateLimiter } from './middleware/common.middleware';
import { requestLogger } from './logger/requestLogger';
import { HttpStatusCode } from './types/HttpStatusCode';

const app = express();

app.use(helmetMiddleware);
app.use(requestLogger);
app.use(rateLimiter);

app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(morganMiddleware);
app.use(hpp());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('API running');
});

app.use((req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, {
    success: false,
    statusCode: HttpStatusCode.NOT_FOUND,
    message: 'Route not found',
  });
});

app.use(globalErrorHandler);

export default app;
