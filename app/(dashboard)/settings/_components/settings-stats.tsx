import { Card, CardContent } from "@/components/ui/card";
import { settingsStats } from "../_data/mock-data";

export function SettingsStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {settingsStats.map((stat) => (
        <Card key={stat.label} className="bg-white py-0">
          <CardContent className="px-5 py-4">
            <p className="text-3xl font-bold text-brand-title">{stat.value}</p>
            <p className="mt-1 text-sm text-brand-description">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
