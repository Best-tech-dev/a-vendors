import { api } from "./axios";
import type { UserProfileResponse } from "@/types/profile";

export const profileApi = {
  get: () => api.get<UserProfileResponse>("/avendor/user/profile"),
};
