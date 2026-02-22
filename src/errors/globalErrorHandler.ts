import logger from '../logger/logger';
import { sendResponse } from '../utils/sendResponse';
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
      message: 'Something Went Wrong',
      statusCode: 500,
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
