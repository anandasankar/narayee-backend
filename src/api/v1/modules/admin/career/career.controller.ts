import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../../../types/HttpStatusCode';
import { sendResponse } from '../../../../../utils/send.response';
import { careerMessage } from './career.message';
import { careerService } from './career.service';

class CareerController {
  async createCareer(req: Request, res: Response): Promise<void> {
    await careerService.createCareer(req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.CREATED,
      message: careerMessage.CAREER_CREATED_SUCCESSFULLY,
    });
  }

  async getCareerById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const career = await careerService.getCareerById(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: careerMessage.CAREER_FETCHED_SUCCESSFULLY,
      data: career,
    });
  }

  async updateCareer(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await careerService.updateCareer(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: careerMessage.CAREER_UPDATED_SUCCESSFULLY,
    });
  }

  async getAllCareer(req: Request, res: Response): Promise<void> {
    const { pageNo, limit, filter } = req.query;

    const careers = await careerService.getAllCareer({
      pageNo: pageNo as string,
      limit: limit as string,
      filter: filter as string,
    });

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: careerMessage.CAREERS_FETCHED_SUCCESSFULLY,
      data: careers,
    });
  }

  async deleteCareer(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await careerService.deleteCareer(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatusCode.OK,
      message: careerMessage.CAREER_DELETED_SUCCESSFULLY,
    });
  }
}

export const careerController = new CareerController();
