import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
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
  cookies?: unknown;
}

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}
export interface RefreshTokenPayload extends JwtPayload {
  id: string;
  email: string;
  tokenId: string;
}

export interface GeneratedRefreshToken {
  refreshToken: string;
  tokenId: string;
}
