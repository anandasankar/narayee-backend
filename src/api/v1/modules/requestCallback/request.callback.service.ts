import { CallbackRequest } from '@prisma/client';
import { AppError } from '../../../../errors/AppError';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { GetAllResponseDTO, UnparsedFilterObject } from '../../../../types/common.type';
import { CreateCallbackRequestDTO, UpdateCallbackRequestDTO } from './request.callback.interface';
import { callbackRequestMessage } from './request.callback.message';
import { callbackRequestRepository } from './request.callback.repository';

class CallbackRequestService {
  async createCallbackRequest(data: CreateCallbackRequestDTO): Promise<void> {
    const existingRequest = await callbackRequestRepository.getPendingOrScheduledByMobile(
      data.mobileNumber,
    );

    if (existingRequest) {
      throw new AppError(
        HttpStatusCode.CONFLICT,
        callbackRequestMessage.CALLBACK_REQUEST_ALREADY_EXISTS,
        false,
      );
    }

    await callbackRequestRepository.createCallbackRequest(data);
  }

  async getCallbackRequestById(id: string): Promise<CallbackRequest> {
    const callbackRequest = await callbackRequestRepository.getCallbackRequestById(id);

    if (!callbackRequest) {
      throw new AppError(
        HttpStatusCode.NOT_FOUND,
        callbackRequestMessage.CALLBACK_REQUEST_NOT_FOUND,
        false,
      );
    }

    return callbackRequest;
  }

  async updateCallbackRequestStatus(id: string, data: UpdateCallbackRequestDTO): Promise<void> {
    // Verify record exists — throws NOT_FOUND if not
    await this.getCallbackRequestById(id);

    await callbackRequestRepository.updateCallbackRequest(id, data);
  }

  async getAllCallbackRequests(filterObject: UnparsedFilterObject): Promise<GetAllResponseDTO> {
    return await callbackRequestRepository.getAllCallbackRequests({
      paginationData: {
        pageNo: filterObject.pageNo ? parseInt(filterObject.pageNo) : 1,
        limit: filterObject.limit ? parseInt(filterObject.limit) : 10,
      },
      filters: filterObject.filter ? JSON.parse(filterObject.filter) : undefined,
    });
  }

  async deleteCallbackRequest(id: string): Promise<void> {
    await this.getCallbackRequestById(id);
    await callbackRequestRepository.deleteCallbackRequest(id);
  }
}

export const callbackRequestService = new CallbackRequestService();
