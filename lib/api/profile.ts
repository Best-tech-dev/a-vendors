import { api } from "./axios";
import type { UserProfileResponse, TeamUsersResponse } from "@/types/profile";

export const profileApi = {
  get: () => api.get<UserProfileResponse>("/avendor/user/profile"),
};

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<TeamUsersResponse>("/avendor/user-management/users", { params }),
};
