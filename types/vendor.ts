export interface Vendor {
  id: number;
  name: string;
  status: "Active" | "Inactive";
  industry: string;
  rating: number;
  location: string;
}
