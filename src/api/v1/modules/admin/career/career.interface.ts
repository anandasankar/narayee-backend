import { CourseLevel } from '@prisma/client';

export interface CreateCareerDTO {
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  level: CourseLevel[];
  image?: string;
}

export type UpdateCareerDTO = Partial<CreateCareerDTO>;

export interface CareerFilterDTO {
  title?: string;
  duration?: string;
  level?: CourseLevel;
}
