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
    wrapper: "border-green-200 bg-green-50",
    title: "text-green-800",
  },
  neutral: {
    wrapper: "border-gray-200 bg-white",
    title: "text-gray-900",
  },
  danger: {
    wrapper: "border-red-200 bg-red-50",
    title: "text-red-800",
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
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}
