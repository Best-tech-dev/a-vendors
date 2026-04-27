export interface DashboardKPIs {
  activeQuoteRequests: number;
  acceptedQuotes: number;
  totalInventory: number;
  totalApprovedPayment: {
    amount: number;
    currency: string;
  };
}

export interface ProfileBanner {
  completionPercent: number;
  missingItems: string[];
  completedItems: string[];
  message: string;
  ctaLabel: string;
}

export interface DashboardGreeting {
  firstName: string;
  lastName: string;
  companyName: string;
}

export interface RecentQuoteRequest {
  reference: string;
  title: string;
  itemsCount: number;
  expectedDelivery: string;
  submissionDeadline: string;
}

export interface DashboardSummaryData {
  kpis: DashboardKPIs;
  profileBanner: ProfileBanner;
  recentQuoteRequests: RecentQuoteRequest[];
  greeting: DashboardGreeting;
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummaryData;
  statusCode: number;
}
