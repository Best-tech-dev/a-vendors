"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";
import { profileApi } from "@/lib/api/profile";
import type { VendorProfile } from "@/types/profile";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SectionCardProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

interface InfoRowProps {
  label: string;
  value?: string | null;
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Card header */}
      <div className="flex items-start justify-between px-6 py-5">
        <div>
          <p className="font-semibold text-brand-title">{title}</p>
          <p className="text-sm text-brand-description">{subtitle}</p>
        </div>
        {action}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Card body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3.5 last:border-0">
      <span className="text-sm text-brand-description">{label}</span>
      <span className="text-sm font-medium text-brand-title">
        {value || "–"}
      </span>
    </div>
  );
}

function GhostButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-brand-title transition-colors hover:bg-gray-200"
    >
      {children}
    </button>
  );
}

function DarkButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      <Upload className="size-4" />
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Four section cards
// ---------------------------------------------------------------------------

function CompanyDetailsCard({ profile }: { profile: VendorProfile | null }) {
  const handleEdit = () => {
    // TODO: open edit sheet/dialog
  };

  return (
    <SectionCard
      title="Company details"
      subtitle="Update your workspace info"
      action={<GhostButton onClick={handleEdit}>Edit</GhostButton>}
    >
      {profile ? (
        <>
          <InfoRow label="Company Name" value={profile.company_name} />
          <InfoRow label="Industry" value={profile.industry} />
          <InfoRow label="Address" value={profile.address} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Phone" value={profile.phone} />
        </>
      ) : (
        // Loading skeleton
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-100 py-3.5 last:border-0"
            >
              <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
              <span className="block h-4 w-36 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function BankDetailsCard({ hasBankDetails }: { hasBankDetails: boolean }) {
  const handleEdit = () => {
    // TODO: open edit sheet/dialog
  };

  const handleAdd = () => {
    // TODO: open add bank details dialog
  };

  return (
    <SectionCard
      title="Bank details"
      subtitle="Update your workspace info"
      action={
        hasBankDetails ? (
          <GhostButton onClick={handleEdit}>Edit</GhostButton>
        ) : undefined
      }
    >
      {hasBankDetails ? (
        // TODO: render actual bank details rows once API shape is known
        <p className="text-sm text-brand-description">Bank details loaded.</p>
      ) : (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="font-semibold text-brand-title">
            No Payout Method Yet.
          </p>
          <p className="max-w-xs text-sm text-brand-description">
            To ensure your invoices are processed and paid without delay, please
            provide your bank account details or preferred payment method.
          </p>
          <DarkButton onClick={handleAdd}>Add Bank Details</DarkButton>
        </div>
      )}
    </SectionCard>
  );
}

function ComplianceDocumentCard({ hasDocument }: { hasDocument: boolean }) {
  const handleUpload = () => {
    // TODO: open file picker / upload dialog
  };

  return (
    <SectionCard
      title="Compliance document"
      subtitle="Update your workspace info"
    >
      {hasDocument ? (
        // TODO: render document list once API shape is known
        <p className="text-sm text-brand-description">Documents uploaded.</p>
      ) : (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="font-semibold text-brand-title">
            No Document Uploaded Yet
          </p>
          <p className="max-w-xs text-sm text-brand-description">
            To become a verified supplier and start bidding on RFQs, please
            upload your required document.
          </p>
          <DarkButton onClick={handleUpload}>Upload document</DarkButton>
        </div>
      )}
    </SectionCard>
  );
}

function PasswordCard() {
  const handleChangePassword = () => {
    // TODO: open change password dialog/sheet
  };

  return (
    <SectionCard
      title="Password"
      subtitle="Manage your login credentials"
      action={
        <GhostButton onClick={handleChangePassword}>
          Change password
        </GhostButton>
      }
    >
      <InfoRow label="Password" value="••••••••" />
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VendorProfilePage() {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    profileApi
      .get()
      .then(({ data: res }) => setProfile(res.data))
      .catch((error: AxiosError<{ message: string }>) => {
        toast.error(
          error.response?.data?.message ??
            "Could not load profile. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Derive flags from the profile once it loads.
  // Adjust the field checks to match whatever your API actually returns.
  const hasBankDetails = !!profile?.bank_account_number;
  const hasComplianceDocument = !!profile?.compliance_document_url;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-title">
          Profile &amp; Settings
        </h1>
        <p className="text-sm text-brand-description">
          Manage your company information and documents
        </p>
      </div>

      {/* 2-column grid — stacks to 1 column on mobile */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <CompanyDetailsCard profile={loading ? null : profile} />
          <ComplianceDocumentCard hasDocument={hasComplianceDocument} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <BankDetailsCard hasBankDetails={hasBankDetails} />
          <PasswordCard />
        </div>
      </div>
    </div>
  );
}
