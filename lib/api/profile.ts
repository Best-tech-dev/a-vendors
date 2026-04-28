import { api } from "./axios";
import type {
  UserProfileResponse,
  TeamUsersResponse,
  VendorProfileResponse,
} from "@/types/profile";

export const profileApi = {
  get: () => api.get<VendorProfileResponse>("/vendor/profile"),

  updateCompanyDetails: (data: {
    name: string;
    industry: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    address: string;
  }) => api.patch<VendorProfileResponse>("/vendor/profile/company", data),

  updateBankDetails: (data: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) => api.put<VendorProfileResponse>("/vendor/profile/bank", data),
};

export const usersApi = {
  getAdmins: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<TeamUsersResponse>(
      "/avendor/user-management/users/avendor-admins",
      { params },
    ),
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<TeamUsersResponse>("/avendor/user-management/users", { params }),
};
