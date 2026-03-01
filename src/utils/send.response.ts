import { Response } from 'express';
import { ApiResponse } from '../types/common.type';

export const sendResponse = (res: Response, responseData: ApiResponse): Response<ApiResponse> => {
  return res.status(responseData.statusCode).send(responseData);
};
