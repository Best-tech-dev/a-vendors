import { api } from "./axios";
import type { UserProfileResponse, TeamUsersResponse } from "@/types/profile";

export const profileApi = {
  get: () => api.get<UserProfileResponse>("/avendor/user/profile"),
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
