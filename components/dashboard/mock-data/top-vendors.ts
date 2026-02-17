import { Vendor } from "@/types/vendor";

export const stats = [
  { label: "Total Vendors", value: 5 },
  { label: "Total Materials", value: 3 },
  { label: "Active RFQs", value: 2 },
  { label: "Pending Orders", value: 3 },
  { label: "Pending Invoices", value: 5 },
  { label: "Pending Payments", value: 3 },
  { label: "Total Team Members", value: 2 },
];

export const quickActions = [
  { label: "Add Team Member", href: "#" },
  { label: "Create RFQ", href: "#" },
  { label: "New Purchase Order", href: "#" },
  { label: "Add Vendor", href: "#" },
];

const sampleCompanies = [
  "Global Logistics Partners",
  "Apex Supply Co",
  "Delta Components",
  "Prime Materials Ltd",
  "Orbit Sourcing",
  "Vertex Industrial",
];

const industries = [
  "Electronics & Components",
  "Industrial Supplies",
  "Construction Materials",
  "Packaging",
  "Automotive Parts",
];

const locations = [
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Ikeja, Nigeria",
  "Port Harcourt, Nigeria",
  "Kano, Nigeria",
];

// Generates a realistic-feeling list of vendors. Uses non-cryptographic randomness
// so the data looks dynamic but keeps the Vendor shape expected by the UI.
export function getTopVendors(count = 8): Vendor[] {
  return Array.from({ length: count }).map((_, i) => {
    const company = sampleCompanies[i % sampleCompanies.length];
    const industry = industries[i % industries.length];
    const location = locations[i % locations.length];
    const rating = Number((4 + Math.random() * 1).toFixed(1));

    return {
      id: i + 1,
      name: company + (i >= sampleCompanies.length ? ` ${i + 1}` : ""),
      status: Math.random() > 0.1 ? "Active" : "Inactive",
      industry,
      rating,
      location,
    } as Vendor;
  });
}
