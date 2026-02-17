"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { roles } from "../_data/mock-data";
import type { Permission } from "@/types/settings";
import { AddRoleDialog } from "./dialogs/add-role-dialog";

function PermissionBadge({ permission }: { permission: Permission }) {
  if (permission.level === "full") {
    return (
      <div className="flex items-center gap-1.5">
        <Check className="size-4 text-green-600" />
        <span className="text-sm text-green-700">
          {permission.module}: Full access
        </span>
      </div>
    );
  }
  if (permission.level === "view") {
    return (
      <div className="flex items-center gap-1.5">
        <Check className="size-4 text-green-600" />
        <span className="text-sm text-green-700">
          {permission.module}: View-only
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <X className="size-4 text-gray-400" />
      <span className="text-sm text-gray-500">
        {permission.module}: No access
      </span>
    </div>
  );
}

export function RoleManagementTab() {
  const [addOpen, setAddOpen] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(
    new Set(roles.map((r) => r.id)),
  );

  const toggleRole = (roleId: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
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

        {/* Role cards */}
        <div className="space-y-4">
          {roles.map((role) => {
            const isExpanded = expandedRoles.has(role.id);

            // Split permissions into two columns
            const leftPermissions = role.permissions.filter(
              (_, i) => i < Math.ceil(role.permissions.length / 2),
            );
            const rightPermissions = role.permissions.filter(
              (_, i) => i >= Math.ceil(role.permissions.length / 2),
            );

            return (
              <Card key={role.id} className="bg-white">
                <CardContent className="px-6 py-4">
                  {/* Role header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-brand-title">
                      {role.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => toggleRole(role.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Permissions grid */}
                  {isExpanded && (
                    <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-2 sm:grid-cols-2">
                      <div className="space-y-2">
                        {leftPermissions.map((perm) => (
                          <PermissionBadge
                            key={perm.module}
                            permission={perm}
                          />
                        ))}
                      </div>
                      <div className="space-y-2">
                        {rightPermissions.map((perm) => (
                          <PermissionBadge
                            key={perm.module}
                            permission={perm}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <AddRoleDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
