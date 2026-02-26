import { HttpStatusCode } from './HttpStatusCode';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: HttpStatusCode;
  message: string;
  data?: T;
}
