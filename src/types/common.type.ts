import { HttpStatusCode } from './HttpStatusCode';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: HttpStatusCode;
  message: string;
  data?: T;
}

export interface GetAllResponseDTO {
  count: number;
  result: object[];
}

export interface UnparsedFilterObject {
  pageNo?: string;
  limit?: string;
  filter?: string;
}

export interface RequestSchema {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}
