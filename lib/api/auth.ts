import { api } from "./axios";

export const authApi = {
  signIn: (data: { email: string; password: string }) =>
    api.post("/auth/sign-in", data),

  verifyOtp: (data: { email: string; otp: string }) =>
    api.post("/auth/admin-verify-login-otp", data),

  resendOtp: (data: { email: string }) => api.post("/auth/sign-in", data),
};
