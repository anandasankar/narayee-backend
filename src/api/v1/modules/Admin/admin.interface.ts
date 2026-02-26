export interface CreateAdminDTO {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  password: string;
}
export interface UpdateAdminDTO {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
}
export interface GetAdminDTO {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  mobileNumber?: string | null;
}
