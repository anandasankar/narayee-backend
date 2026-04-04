import { EnrollmentStatus } from '@prisma/client';

export interface CreateUserDTO {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  mobileNumber: string;
  password: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  profileCompletion?: number;
  active?: boolean;
  deleted?: boolean;
  deletedAt?: Date | null;
}

export interface GetUserDTO {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email?: string | null;
  mobileNumber: string;
  avatar?: string | null;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  profileCompletion: number;

  educations?: {
    college: string | null;
    degree: string | null;
    graduationYear: number | null;
  }[];

  enrollments?: {
    courseId: string;
    courseName: string;
    enrolledAt: string;
    status: EnrollmentStatus;
  }[];
}
