import { api } from "./axios";
import type { ModuleCatalogResponse } from "@/types/settings";

export const permissionsApi = {
  getModuleCatalog: () =>
    api.get<ModuleCatalogResponse>("/avendor/permissions/module-catalog"),
};
