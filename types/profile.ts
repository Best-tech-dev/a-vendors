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

export interface VendorProfile {
  company_name?: string;
  industry?: string;
  address?: string;
  email?: string;
  phone?: string;
  bank_account_number?: string;
  compliance_document_url?: string;
}
