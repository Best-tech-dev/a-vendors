"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
} from "@/components/ui/card";
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
          <CardHeader className="border-b [.border-b]:pb-3">
            <div>
              <h3 className="text-base font-medium text-brand-title">
                Basic details
              </h3>
              <p className="text-sm text-brand-description">
                Update your workspace info
              </p>
            </div>
            <CardAction>
              <Button
                size="lg"
                className="bg-[#1E22540A] text-brand-primary hover:text-white"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="px-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Name</span>
                <span className="text-sm font-medium text-brand-description">
                  {currentUser.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Email</span>
                <span className="text-sm font-medium text-brand-description">
                  {currentUser.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">
                  Phone number
                </span>
                <span className="text-sm font-medium text-brand-description">
                  {currentUser.phone || "–"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-description">Role</span>
                <span className="text-sm font-medium text-brand-description">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password card */}
        <Card className="bg-white">
          <CardHeader className="border-b [.border-b]:pb-3">
            <div>
              <h3 className="text-base font-medium text-brand-title">
                Password
              </h3>
              <p className="text-sm text-brand-description">
                Manage your login credentials
              </p>
            </div>
            <CardAction>
              <Button
                size="lg"
                className="bg-[#1E22540A] text-brand-primary hover:text-white"
                onClick={() => setPasswordOpen(true)}
              >
                Change password
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="px-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-description">Password</span>
              <span className="text-sm font-medium text-brand-description tracking-widest">
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
