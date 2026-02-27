export type ComplianceStatus = "Compliant" | "Non-Compliant" | "Warning";
export type VendorStatus = "Active" | "Inactive";
export type DocStatus = "Valid" | "Expired";

export interface VendorDocument {
  id: string;
  name: string;
  type: string;
  status: DocStatus;
  thumbnail?: string;
}

export interface VendorBankDetails {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface TopVendor {
  id: number;
  name: string;
  status: VendorStatus;
  industry: string;
  rating: number;
  location: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: VendorStatus;
  compliance: ComplianceStatus;
  joinedDate: string;
  rating: number;
  totalOrders: number;
  totalSpend: number;
  bankDetails: VendorBankDetails;
  documents: VendorDocument[];
  notes: string[];
}
