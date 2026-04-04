import { Router } from 'express';
import { authRateLimiter } from '../../../../../utils/common.middleware';
import { isAdmin, isAuthenticated, isUser } from '../../../middleware/auth.middleware';
import validateRequest from '../../../middleware/validate.request';
import { userController } from './user.auth.controller';
import {
  changePasswordSchema,
  createUserSchema,
  deleteUserSchema,
  getAllUsersSchema,
  loginUserSchema,
  refreshTokenSchema,
  updateUserSchema,
} from './user.auth.validation';

const userAuthRouter = Router();

// Public
userAuthRouter.post('/register', validateRequest(createUserSchema), userController.createUser);

userAuthRouter.post(
  '/login',
  authRateLimiter,
  validateRequest(loginUserSchema),
  userController.loginUser,
);

userAuthRouter.post('/refresh-token', validateRequest(refreshTokenSchema), userController.refreshToken);

// Protected — user must be authenticated
userAuthRouter.get('/me', isAuthenticated, isUser, userController.getUserById);

userAuthRouter.put(
  '/me',
  isAuthenticated,
  isUser,
  validateRequest(updateUserSchema),
  userController.updateUser,
);

userAuthRouter.delete(
  '/me',
  isAuthenticated,
  isUser,
  validateRequest(deleteUserSchema),
  userController.deleteUser,
);

userAuthRouter.post('/logout', isAuthenticated, isUser, userController.logoutUser);

userAuthRouter.post(
  '/change-password',
  isAuthenticated,
  isUser,
  validateRequest(changePasswordSchema),
  userController.changePassword,
);

// Admin-only: list all users
userAuthRouter.get(
  '/get-all',
  isAuthenticated,
  isAdmin,
  validateRequest(getAllUsersSchema),
  userController.getAllUsers,
);

// TODO: Forgot Password API (send SMS/email OTP)

export default userAuthRouter;
