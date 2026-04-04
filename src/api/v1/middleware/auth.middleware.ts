import { NextFunction, Response } from 'express';
import { commonMessages } from '../../../constants/common.messages';
import { AppError } from '../../../errors/AppError';
import { AuthRequest } from '../../../types/common.type';
import { HttpStatusCode } from '../../../types/HttpStatusCode';
import { verifyAccessToken } from '../../../utils/token.manager';
import { adminRepository } from '../modules/admin/auth/admin.auth.repository';
import { userRepository } from '../modules/user/auth/user.auth.repository';

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.TOKEN_REQUIRE, false);
  }
  const decoded = verifyAccessToken(token);
  req.user = decoded;

  next();
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.id) {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
  }

  const admin = await adminRepository.getAdminById(req.user.id);

  if (!admin) {
    throw new AppError(HttpStatusCode.FORBIDDEN, commonMessages.UNAUTHORIZED, false);
  }

  next();
};

export const isUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.id) {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
  }

  const user = await userRepository.getUserById(req.user.id);

  if (!user || !user.active || user.deleted) {
    throw new AppError(HttpStatusCode.FORBIDDEN, commonMessages.UNAUTHORIZED, false);
  }

  next();
};
