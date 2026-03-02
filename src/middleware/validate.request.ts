import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ZodError, ZodType } from 'zod';
import { sendResponse } from '../utils/send.response';
import logger from '../logger';
import { AppError, errorHandler } from '../errors/AppError';
import { HttpStatusCode } from '../types/HttpStatusCode';
import { commonMessages } from '../constants/common.messages';
import { RequestSchema } from '../types/common.type';

const validateRequest =
  (schema: ZodType<RequestSchema>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsedData.body !== undefined) {
        req.body = parsedData.body;
      }

      if (parsedData.query !== undefined) {
        req.query = parsedData.query as Request['query'];
      }

      if (parsedData.params !== undefined) {
        req.params = parsedData.params as Request['params'];
      }

      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        sendResponse(res, {
          success: false,
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: error.issues[0]?.message ?? commonMessages.INVALID_REQUEST_DATA,
        });
        return;
      }

      logger.error(error);

      if (error instanceof AppError && errorHandler.isTrustedError(error)) {
        sendResponse(res, {
          success: false,
          statusCode: error.statusCode,
          message: error.message,
        });
        return;
      }

      sendResponse(res, {
        success: false,
        statusCode: HttpStatusCode.INTERNAL_SERVER,
        message: commonMessages.INTERNAL_SERVER_ERROR,
      });
    }
  };

export default validateRequest;
