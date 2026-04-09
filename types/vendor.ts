export type ComplianceStatus = "compliant" | "non_compliant" | "warning";
export type VendorStatus = "active" | "inactive";
export type DocStatus = "Valid" | "Expired";

export interface VendorDocument {
  id: string;
  name: string;
  type: string;
  status: DocStatus;
  thumbnail?: string;
}

export interface VendorNote {
  id: string;
  vendorId: string;
  content: string;
  authorId: string;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VendorBankDetail {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface TopVendor {
  id: number;
  name: string;
  status: "Active" | "Inactive";
  industry: string;
  rating: number;
  location: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: VendorStatus;
  complianceStatus: ComplianceStatus;
  complianceOverride: boolean;
  rating: number;
  totalOrders: number;
  totalSpend: number;
  createdAt: string;
  updatedAt: string;
  bankDetail: VendorBankDetail | null;
  documents: VendorDocument[];
  notes: VendorNote[];
  _count?: {
    notes: number;
  };
}

export interface CreateVendorRequest {
  name: string;
  category: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: string;
}

export interface CreateVendorResponse {
  success: boolean;
  message: string;
  data: Vendor;
  statusCode: number;
}

export interface VendorDetailResponse {
  success: boolean;
  message: string;
  data: Vendor;
  statusCode: number;
}

export interface VendorCategory {
  id: string;
  name: string;
}

export interface VendorCategoriesResponse {
  success: boolean;
  message: string;
  data: VendorCategory[];
  statusCode: number;
}

export interface AddNoteResponse {
  success: boolean;
  message: string;
  data: VendorNote;
  statusCode: number;
}

export interface VendorsAnalysis {
  totalVendors: number;
  activeVendors: number;
  inactiveVendors: number;
  complianceRiskCount: number;
}

export interface VendorsListResponse {
  success: boolean;
  message: string;
  data: {
    analysis: VendorsAnalysis;
    items: Vendor[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  statusCode: number;
}

export interface VendorsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}
