"use client";

import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { permissionsApi } from "@/lib/api/permissions";
import type { PermissionModule } from "@/types/settings";
import { AddRoleDialog } from "./dialogs/add-role-dialog";

export function RoleManagementTab() {
  const [addOpen, setAddOpen] = useState(false);
  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data } = await permissionsApi.getModuleCatalog();
        setModules(data.data.modules);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data?.message ||
          "Failed to load permission modules. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-brand-title">
              Permission management
            </h2>
            <p className="text-sm text-brand-description">
              Manage team access and permissions
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)}>+ Add new role</Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white py-0">
                  <CardContent className="px-5 py-4 space-y-2">
                    <span className="block h-6 w-32 animate-pulse rounded bg-gray-200" />
                    <span className="block h-4 w-full animate-pulse rounded bg-gray-200" />
                  </CardContent>
                </Card>
              ))
            : modules.map((mod) => (
                <Card key={mod.key} className="bg-white py-0">
                  <CardContent className="px-5 py-4">
                    <p className="text-base font-bold text-brand-title">
                      {mod.label}
                    </p>
                    <p className="mt-1 text-sm text-brand-description">
                      {mod.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      <AddRoleDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
