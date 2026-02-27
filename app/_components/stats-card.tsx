interface StatsCardProps {
  value: string | number;
  label: string;
}

export function StatsCard({ value, label }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-[#0F172A]">{value}</span>
      </div>
      <p className="mt-1 text-sm text-brand-description">{label}</p>
    </div>
  );
}
