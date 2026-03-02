import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { adminMessage } from './admin.message';
import { sendResponse } from '../../../../utils/send.response';

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
    const id = req.params.id as string;
    const admin = await adminService.getAdminById(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_FETCHED,
      data: admin,
    });
  }

  async updateAdmin(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await adminService.updateAdmin(id, req.body);

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
    const id = req.params.id as string;
    await adminService.deleteAdmin(id);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: adminMessage.ADMIN_DELETED,
    });
  }
}

export const adminController = new AdminController();
