import { type LucideIcon } from "lucide-react";

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
  iconColor,
}: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-brand-title">{value}</span>
        {Icon && <Icon className={iconColor ?? "text-brand-muted"} size={20} />}
      </div>
      <p className="mt-1 text-sm text-brand-description">{label}</p>
    </div>
  );
}
