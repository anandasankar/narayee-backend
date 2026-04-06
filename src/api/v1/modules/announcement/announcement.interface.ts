import { AnnouncementType } from '@prisma/client';

export interface CreateAnnouncementDTO {
  title: string;
  description: string;
  type: AnnouncementType;
  publishedAt?: Date;
  expiresAt?: Date;
}

export type UpdateAnnouncementDTO = Partial<CreateAnnouncementDTO> & {
  active?: boolean;
};

export interface AnnouncementFilterDTO {
  title?: string;
  type?: AnnouncementType;
  active?: boolean;
}
