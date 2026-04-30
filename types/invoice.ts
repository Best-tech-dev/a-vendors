export type InvoiceStatus = "Approved" | "Pending" | "Exception";

export interface VendorBankDetails {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  poReference: string;
  status: InvoiceStatus;
  amount: number;
  dueDate: string;
  createdDate: string;
  notes: string;
  vendorBankDetails: VendorBankDetails;
}
