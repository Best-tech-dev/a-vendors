export type PaymentStatus = "Approved" | "Pending" | "Completed" | "Rejected";

export interface PaymentProof {
  id: string;
  fileName: string;
  fileSize: string;
  thumbnail?: string;
  addedDate: string;
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  label: string;
  proof?: PaymentProof;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  vendor: string;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
  purchaseOrderId: string;
  createdDate: string;
  invoiceReference: string;
  installments: PaymentInstallment[];
}
