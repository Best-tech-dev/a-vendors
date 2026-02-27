import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopVendor } from "@/types/vendor";

interface VendorCardProps {
  vendor: TopVendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="px-5">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-brand-title">
              {vendor.name}
            </h3>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {vendor.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-brand-title">
              {vendor.rating}
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-brand-description">{vendor.industry}</p>
          <p className="text-sm text-brand-description">{vendor.location}</p>
        </div>
      </CardContent>
    </Card>
  );
}
