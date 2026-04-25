import type { AnalysisVariant } from "@/types/rfq";

interface AnalysisCardProps {
  variant: AnalysisVariant;
  label: string;
  vendorName: string;
  description: string;
}

const variantStyles: Record<
  AnalysisVariant,
  { wrapper: string; title: string }
> = {
  success: {
    wrapper: "border-badge-green/20 bg-badge-green-accent",
    title: "text-badge-green",
  },
  neutral: {
    wrapper: "border-gray-200 bg-white",
    title: "text-brand-title",
  },
  danger: {
    wrapper: "border-badge-red/20 bg-badge-red-accent",
    title: "text-badge-red",
  },
};

export function AnalysisCard({
  variant,
  label,
  vendorName,
  description,
}: AnalysisCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`rounded-xl border p-5 ${styles.wrapper}`}>
      <h4 className={`text-sm font-bold ${styles.title}`}>
        {label}: {vendorName}
      </h4>
      <p className="mt-1 text-sm text-brand-description">{description}</p>
    </div>
  );
}
