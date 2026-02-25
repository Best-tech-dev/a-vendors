import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  value,
  label,
  icon: Icon,
  iconColor = "text-gray-500",
}: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-brand-primary">{value}</span>
        {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
      </div>
      <p className="mt-1 text-sm text-brand-description">{label}</p>
    </div>
  );
}
