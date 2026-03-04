import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { clearAuthCookies, setAuthCookies } from '../../../../utils/cookie.manager';
import { sendResponse } from '../../../../utils/send.response';
import { adminMessage } from './admin.message';
import { adminService } from './admin.service';

class AdminController {
  async createAdmin(req: Request, res: Response): Promise<void> {
    await adminService.createAdmin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      message: adminMessage.ADMIN_CREATED,
    });
  }

  async getAdminById(req: Request, res: Response): Promise<void> {
    const adminId = req.user!.id;
    const admin = await adminService.getAdminById(adminId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_FETCHED,
      data: admin,
    });
  }

  async updateAdmin(req: Request, res: Response): Promise<void> {
    const adminId = req.user!.id;
    await adminService.updateAdmin(adminId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_UPDATED,
    });
  }

  async getAllAdmins(req: Request, res: Response): Promise<void> {
    const { pageNo, limit } = req.query;

    const admins = await adminService.getAllAdmins({
      pageNo: pageNo as string,
      limit: limit as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_FETCHED,
      data: admins,
    });
  }

  async deleteAdmin(req: Request, res: Response): Promise<void> {
    const adminId = req.user!.id;
    await adminService.deleteAdmin(adminId);

    clearAuthCookies(res);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_DELETED,
    });
  }

  async loginAdmin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const accessToken = await adminService.loginAdmin(email, password);
    setAuthCookies(res, accessToken);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_LOGIN_SUCCESS,
    });
  }

  async logoutAdmin(req: Request, res: Response): Promise<void> {
    clearAuthCookies(res);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_LOGOUT_SUCCESS,
    });
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const adminId = req.user!.id;

    const { currentPassword, newPassword } = req.body;

    await adminService.changePassword(adminId, currentPassword, newPassword);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.PASSWORD_CHANGED_SUCCESSFULLY,
    });
  }
}

export const adminController = new AdminController();
