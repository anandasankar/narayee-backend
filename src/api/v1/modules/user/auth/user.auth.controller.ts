import { Response } from 'express';
import { HttpStatusCode } from '../../../../../types/HttpStatusCode';
import { AuthRequest } from '../../../../../types/common.type';
import { clearAuthCookies, setAuthCookies } from '../../../../../utils/cookie.manager';
import { sendResponse } from '../../../../../utils/send.response';
import { userMessage } from './user.auth.messages';
import { userService } from './user.auth.service';

class UserController {
  async createUser(req: AuthRequest, res: Response): Promise<void> {
    await userService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      message: userMessage.USER_CREATED,
    });
  }

  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const user = await userService.getUserById(userId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.USER_FETCHED,
      data: user,
    });
  }

  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    await userService.updateUser(userId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.USER_UPDATED,
    });
  }

  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    const { pageNo, limit, search } = req.query;

    const users = await userService.getAllUsers({
      pageNo: pageNo as string,
      limit: limit as string,
      search: search as string | undefined,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.USER_FETCHED,
      data: users,
    });
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { password } = req.body;

    await userService.deleteUser(userId, password);

    clearAuthCookies(res);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.USER_DELETED,
    });
  }

  async loginUser(req: AuthRequest, res: Response): Promise<void> {
    const { identifier, password } = req.body;

    const { accessToken, refreshToken } = await userService.loginUser(identifier, password);

    setAuthCookies(res, accessToken, refreshToken);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.USER_LOGIN_SUCCESS,
    });
  }

  async logoutUser(req: AuthRequest, res: Response): Promise<void> {
    const token = req.cookies?.refreshToken;
    if (token) await userService.logoutUser(token);

    clearAuthCookies(res);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.USER_LOGOUT_SUCCESS,
    });
  }

  async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    const token = req.cookies.refreshToken as string;

    const { accessToken, refreshToken } = await userService.refreshUserToken(token);
    setAuthCookies(res, accessToken, refreshToken);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.TOKEN_REFRESHED,
    });
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    await userService.changePassword(userId, currentPassword, newPassword);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: userMessage.PASSWORD_CHANGED_SUCCESSFULLY,
    });
  }
}

export const userController = new UserController();
