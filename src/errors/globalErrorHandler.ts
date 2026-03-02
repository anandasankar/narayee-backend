import { commonMessages } from '../constants/common.messages';
import logger from '../logger';
import { HttpStatusCode } from '../types/HttpStatusCode';
import { sendResponse } from '../utils/send.response';
import { AppError, errorHandler } from './AppError';
import { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = async (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  if (!errorHandler.isTrustedError(err)) {
    logger.error(err);
    sendResponse(res, {
      message: commonMessages.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatusCode.INTERNAL_SERVER,
      success: false,
    });
    return;
  }
  const errDetails = await errorHandler.handleError(err);
  const { message, statusCode, success } = errDetails || {};
  sendResponse(res, {
    message,
    statusCode,
    success,
  });
};
