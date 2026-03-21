import { CallbackStatus, EnquiryType } from '@prisma/client';

export interface CreateCallbackRequestDTO {
  name: string;
  mobileNumber: string;
  preferredAt: Date;
  enquiryType: EnquiryType;
  notes?: string;
}

// Admin can only update the status
export interface UpdateCallbackRequestDTO {
  status: CallbackStatus;
}

export interface CallbackRequestFilterDTO {
  name?: string;
  mobileNumber?: string;
  enquiryType?: EnquiryType;
  status?: CallbackStatus;
  preferredAt?: Date;
}
