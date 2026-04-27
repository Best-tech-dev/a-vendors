import { api } from "./axios";
import type { DashboardSummaryResponse } from "@/types/dashboard";

export const dashboardApi = {
  getSummary: (recentQuoteLimit: number = 5) =>
    api.get<DashboardSummaryResponse>("/vendor/dashboard/summary", {
      params: { recentQuoteLimit },
    }),
};
