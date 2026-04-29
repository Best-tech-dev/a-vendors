import { api } from "./axios";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  UserProfileResponse,
  TeamUsersResponse,
  VendorProfileResponse,
} from "@/types/profile";

export const profileApi = {
  // Logged-in platform user profile (admin/dashboard header/settings)
  get: () => api.get<UserProfileResponse>("/avendor/user/profile"),

  // Logged-in vendor profile (vendor profile/settings area)
  getVendorProfile: () => api.get<VendorProfileResponse>("/vendor/profile"),

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

  uploadComplianceDocument: (data: {
    file: File;
    documentType: string;
    label: string;
    expiry_date: string;
  }) => {
    const formData = new FormData();
    formData.append("image", data.file);
    formData.append("documentType", data.documentType);
    formData.append("label", data.label);
    formData.append("expiresAt", data.expiry_date);
    return api.post<VendorProfileResponse>(
      "/vendor/profile/compliance/documents",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  changePassword: (data: ChangePasswordRequest) =>
    api.post<ChangePasswordResponse>(
      "/vendor/profile/security/change-password",
      data,
    ),
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
