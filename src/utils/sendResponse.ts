import { Response } from 'express';
import { ApiResponse } from '../types/common.type';

export const sendResponse = <T>(res: Response, payload: ApiResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data ?? null,
  });
};
