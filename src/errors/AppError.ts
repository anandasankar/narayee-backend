import { HttpStatusCode } from '../types/HttpStatusCode';

export class AppError extends Error {
  public readonly success: boolean;
  public readonly statusCode: HttpStatusCode;
  public readonly message: string;

  constructor(statusCode: HttpStatusCode, message: string, success: boolean) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.statusCode = statusCode;
    this.success = success;

    Error.captureStackTrace(this);
  }
}

class ErrorHandler {
  public async handleError(err: AppError): Promise<AppError> {
    return err;
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return true;
    }
    return false;
  }
}
export const errorHandler = new ErrorHandler();
