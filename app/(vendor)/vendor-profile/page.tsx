"use client";

import { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Image from "next/image";
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
      <div className="flex items-start justify-between px-6 py-5">
        <div>
          <p className="font-semibold text-brand-title">{title}</p>
          <p className="text-sm text-brand-description">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="border-t border-gray-100" />
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

function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-100 py-3.5 last:border-0"
        >
          <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
          <span className="block h-4 w-36 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section cards
// ---------------------------------------------------------------------------

function CompanyDetailsCard({ profile }: { profile: VendorProfile | null }) {
  return (
    <SectionCard
      title="Company details"
      subtitle="Update your workspace info"
      action={
        <GhostButton
          onClick={() => {
            /* TODO: open edit dialog */
          }}
        >
          Edit
        </GhostButton>
      }
    >
      {profile === null ? (
        <SkeletonRows count={5} />
      ) : (
        <>
          <InfoRow label="Company Name" value={profile.company_name} />
          <InfoRow label="Industry" value={profile.industry} />
          <InfoRow label="Address" value={profile.address} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Phone" value={profile.phone} />
        </>
      )}
    </SectionCard>
  );
}

function BankDetailsCard({ profile }: { profile: VendorProfile | null }) {
  const hasBankDetails =
    !!profile?.bank_name ||
    !!profile?.account_number ||
    !!profile?.account_name;

  return (
    <SectionCard
      title="Bank details"
      subtitle="Update your workspace info"
      action={
        // Edit button appears as soon as profile has loaded regardless of
        // whether bank details exist, so the user can always open the form.
        profile !== null ? (
          <GhostButton
            onClick={() => {
              /* TODO: open edit/add dialog */
            }}
          >
            Edit
          </GhostButton>
        ) : undefined
      }
    >
      {profile === null ? (
        <SkeletonRows count={3} />
      ) : hasBankDetails ? (
        <>
          <InfoRow label="Bank Name" value={profile.bank_name} />
          <InfoRow label="Account Number" value={profile.account_number} />
          <InfoRow label="Account Name" value={profile.account_name} />
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="font-semibold text-brand-title">
            No Payout Method Yet.
          </p>
          <p className="max-w-xs text-sm text-brand-description">
            To ensure your invoices are processed and paid without delay, please
            provide your bank account details or preferred payment method.
          </p>
          <DarkButton
            onClick={() => {
              /* TODO: open add bank dialog */
            }}
          >
            Add Bank Details
          </DarkButton>
        </div>
      )}
    </SectionCard>
  );
}

function ComplianceDocumentCard({
  profile,
}: {
  profile: VendorProfile | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReupload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: call upload API with the selected file
    console.log("Re-uploading:", file.name);
  };

  const hasDocument = !!profile?.compliance_document_url;

  return (
    <SectionCard
      title="Compliance document"
      subtitle="Update your workspace info"
    >
      {profile === null ? (
        // Skeleton shaped like the document row
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-gray-200" />
            <div className="space-y-1.5">
              <span className="block h-4 w-32 animate-pulse rounded bg-gray-200" />
              <span className="block h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <span className="block h-8 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      ) : hasDocument ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Document thumbnail */}
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image
                src={profile.compliance_document_url!}
                alt="Compliance document"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-title">
                {profile.compliance_document_name ?? "CAC Certificate"}
              </p>
              {profile.compliance_document_expiry && (
                <p className="text-xs text-brand-description">
                  Expires: {profile.compliance_document_expiry}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleReupload}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-brand-title transition-colors hover:bg-gray-50"
          >
            <Upload className="size-3.5" />
            Re-upload
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="font-semibold text-brand-title">
            No Document Uploaded Yet
          </p>
          <p className="max-w-xs text-sm text-brand-description">
            To become a verified supplier and start bidding on RFQs, please
            upload your required document.
          </p>
          <DarkButton
            onClick={() => {
              /* TODO: open upload dialog */
            }}
          >
            Upload document
          </DarkButton>
        </div>
      )}
    </SectionCard>
  );
}

function PasswordCard() {
  return (
    <SectionCard
      title="Password"
      subtitle="Manage your login credentials"
      action={
        <GhostButton
          onClick={() => {
            /* TODO: open change password dialog */
          }}
        >
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
      });
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-title">
          Profile &amp; Settings
        </h1>
        <p className="text-sm text-brand-description">
          Manage your company information and documents
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <CompanyDetailsCard profile={profile} />
          <ComplianceDocumentCard profile={profile} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <BankDetailsCard profile={profile} />
          <PasswordCard />
        </div>
      </div>
    </div>
  );
}
