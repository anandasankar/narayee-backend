import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { sendResponse } from '../../../../utils/send.response';
import { callbackRequestMessage } from './request.callback.message';
import { callbackRequestService } from './request.callback.service';

class CallbackRequestController {
  async createCallbackRequest(req: Request, res: Response): Promise<void> {
    await callbackRequestService.createCallbackRequest(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      message: callbackRequestMessage.CALLBACK_REQUEST_CREATED_SUCCESSFULLY,
    });
  }

  async getCallbackRequestById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const callbackRequest = await callbackRequestService.getCallbackRequestById(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: callbackRequestMessage.CALLBACK_REQUEST_FETCHED_SUCCESSFULLY,
      data: callbackRequest,
    });
  }

  async updateCallbackRequestStatus(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await callbackRequestService.updateCallbackRequestStatus(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: callbackRequestMessage.CALLBACK_REQUEST_UPDATED_SUCCESSFULLY,
    });
  }

  async getAllCallbackRequests(req: Request, res: Response): Promise<void> {
    const { pageNo, limit, filter } = req.query;

    const callbackRequests = await callbackRequestService.getAllCallbackRequests({
      pageNo: pageNo as string,
      limit: limit as string,
      filter: filter as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: callbackRequestMessage.CALLBACK_REQUESTS_FETCHED_SUCCESSFULLY,
      data: callbackRequests,
    });
  }

  async deleteCallbackRequest(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await callbackRequestService.deleteCallbackRequest(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: callbackRequestMessage.CALLBACK_REQUEST_DELETED_SUCCESSFULLY,
    });
  }
}

export const callbackRequestController = new CallbackRequestController();
