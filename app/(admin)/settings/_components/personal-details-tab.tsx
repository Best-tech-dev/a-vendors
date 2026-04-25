"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { profileApi } from "@/lib/api/profile";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { EditProfileDialog } from "./dialogs/edit-profile-dialog";
import { ChangePasswordDialog } from "./dialogs/change-password-dialog";

export function PersonalDetailsTab() {
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: res } = await profileApi.get();
        setProfile(res.data);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message =
          axiosError.response?.data?.message ||
          "Failed to load profile. Please try again.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [setProfile]);

  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : "–";

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
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <span className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-description">Name</span>
                  <span className="text-sm font-medium text-brand-description">
                    {fullName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-description">Email</span>
                  <span className="text-sm font-medium text-brand-description">
                    {profile?.email ?? "–"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-description">
                    Phone number
                  </span>
                  <span className="text-sm font-medium text-brand-description">
                    {profile?.phone_number ?? "–"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-description">Role</span>
                  <span className="text-sm font-medium text-brand-description capitalize">
                    {profile?.role ?? "–"}
                  </span>
                </div>
              </div>
            )}
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
