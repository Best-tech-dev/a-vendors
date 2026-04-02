export type PermissionLevel = "full" | "view" | "none";

export interface Permission {
  module: string;
  description: string;
  level: PermissionLevel;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
}

export interface SettingsStat {
  label: string;
  value: number;
}

export interface PermissionModule {
  key: string;
  label: string;
  description: string;
}

export interface ModuleCatalogResponse {
  success: boolean;
  message: string;
  data: {
    modules: PermissionModule[];
    access_levels: string[];
  };
  statusCode: number;
}
