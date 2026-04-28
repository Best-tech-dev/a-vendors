export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  phone_number: string | null;
  company_position: string | null;
  display_picture: string | null;
  role: string;
  status: string;
  is_active: boolean;
  is_email_verified: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
  statusCode: number;
}

export interface TeamUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  phone_number: string | null;
  display_picture: string | null;
  company_position: string | null;
  is_a_vendor: boolean;
  role: string;
  status: string;
  is_active: boolean;
  usertype: string | null;
  allowed_platforms: string[];
  allowed_platforms_for_user: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TeamUsersResponse {
  success: boolean;
  message: string;
  data: TeamUser[];
  length: number;
  meta: PaginationMeta;
  statusCode: number;
}

// Vendor Profile API Types
export interface VendorUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  displayPicture: string | null;
  companyPosition: string | null;
}

export interface VendorCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  address: string;
  city: string;
  country: string;
  status: string;
  complianceStatus: string;
  rating: number;
  totalOrders: number;
  totalSpend: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorBank {
  id?: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  [key: string]: string | undefined;
}

export interface ComplianceDocument {
  id: string;
  documentType: string;
  label: string;
  imageUrl: string;
  status: "valid" | "expired";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorCompliance {
  status: string;
  documents: ComplianceDocument[];
}

export interface VendorSecurity {
  hasPassword: boolean;
}

export interface ProfileCompletion {
  completionPercent: number;
  completedItems: string[];
  missingItems: string[];
}

export interface VendorProfileData {
  user: VendorUser;
  company: VendorCompany;
  bank: VendorBank | null;
  compliance: VendorCompliance;
  security: VendorSecurity;
  profileCompletion: ProfileCompletion;
}

export interface VendorProfileResponse {
  success: boolean;
  message: string;
  data: VendorProfileData;
  statusCode: number;
}
