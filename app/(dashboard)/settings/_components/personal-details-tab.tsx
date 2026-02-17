"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentUser } from "../_data/mock-data";
import { EditProfileDialog } from "./dialogs/edit-profile-dialog";
import { ChangePasswordDialog } from "./dialogs/change-password-dialog";

export function PersonalDetailsTab() {
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic details card */}
        <Card className="bg-white">
          <CardContent className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-brand-title">
                  Basic details
                </h3>
                <p className="text-sm text-brand-description">
                  Update your workspace info
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Name</span>
                <span className="text-sm font-medium text-brand-title">
                  {currentUser.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Email</span>
                <span className="text-sm font-medium text-brand-title">
                  {currentUser.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">
                  Phone number
                </span>
                <span className="text-sm font-medium text-brand-title">
                  {currentUser.phone || "–"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Role</span>
                <span className="text-sm font-medium text-brand-title">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password card */}
        <Card className="bg-white">
          <CardContent className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-brand-title">
                  Password
                </h3>
                <p className="text-sm text-brand-description">
                  Manage your login credentials
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPasswordOpen(true)}
              >
                Change password
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-description">Password</span>
              <span className="text-sm font-medium text-brand-title tracking-widest">
                ••••••••
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
    </>
  );
}
