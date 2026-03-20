import { Career } from '@prisma/client';
import { AppError } from '../../../../errors/AppError';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { GetAllResponseDTO, UnparsedFilterObject } from '../../../../types/common.type';
import { CreateCareerDTO, UpdateCareerDTO } from './career.interface';
import { careerMessage } from './career.message';
import { careerRepository } from './career.repository';

class CareerService {
  async createCareer(data: CreateCareerDTO): Promise<void> {
    const existingCareer = await careerRepository.getCareerByTitle(data.title);

    if (existingCareer) {
      throw new AppError(HttpStatusCode.CONFLICT, careerMessage.CAREER_ALREADY_EXISTS, false);
    }

    await careerRepository.createCareer(data);
  }

  async getCareerById(id: string): Promise<Career | null> {
    const career = await careerRepository.getCareerById(id);

    if (!career) {
      throw new AppError(HttpStatusCode.NOT_FOUND, careerMessage.CAREER_NOT_FOUND, false);
    }

    return career;
  }

  async updateCareer(id: string, data: UpdateCareerDTO): Promise<void> {
    await this.getCareerById(id);

    if (data.title) {
      const existingCareer = await careerRepository.getCareerByTitle(data.title);

      if (existingCareer && existingCareer.id !== id) {
        throw new AppError(HttpStatusCode.CONFLICT, careerMessage.CAREER_ALREADY_EXISTS, false);
      }
    }

    await careerRepository.updateCareer(id, data);
  }

  async getAllCareer(filterObject: UnparsedFilterObject): Promise<GetAllResponseDTO> {
    return await careerRepository.getAllCareer({
      paginationData: {
        pageNo: filterObject.pageNo ? parseInt(filterObject.pageNo) : 1,
        limit: filterObject.limit ? parseInt(filterObject.limit) : 10,
      },
      filters: filterObject.filter ? JSON.parse(filterObject.filter) : undefined,
    });
  }

  async deleteCareer(id: string): Promise<void> {
    await this.getCareerById(id);
    await careerRepository.deleteCareer(id);
  }
}

export const careerService = new CareerService();
