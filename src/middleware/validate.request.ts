import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError, ZodType } from 'zod';
import { commonMessages } from '../constants/common.messages';
import { AppError, errorHandler } from '../errors/AppError';
import logger from '../logger';
import { RequestSchema } from '../types/common.type';
import { HttpStatusCode } from '../types/HttpStatusCode';
import { sendResponse } from '../utils/send.response';

const validateRequest =
  (schema: ZodType<RequestSchema>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      if (parsedData.body !== undefined) {
        req.body = parsedData.body;
      }

      if (parsedData.query !== undefined) {
        Object.assign(req.query, parsedData.query);
      }

      if (parsedData.params !== undefined) {
        Object.assign(req.params, parsedData.params);
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
