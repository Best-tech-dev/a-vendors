"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsStats } from "./_components/settings-stats";
import { PersonalDetailsTab } from "./_components/personal-details-tab";
import { TeamManagementTab } from "./_components/team-management-tab";
import { RoleManagementTab } from "./_components/role-management-tab";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-title">Settings</h1>
        <p className="mt-1 text-sm text-brand-description">
          Manage your account and system settings
        </p>
      </div>

      {/* Stats row */}
      <SettingsStats />

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full mt-10">
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="bg-brand-primary text-white rounded-sm py-5.5 px-1.5 flex w-max space-x-2">
            <TabsTrigger
              value="personal"
              className="rounded-sm px-2 py-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1B2559] data-[state=inactive]:text-white/80 cursor-pointer"
            >
              Personal details
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="rounded-sm px-2 py-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1B2559] data-[state=inactive]:text-white/80 cursor-pointer"
            >
              Team management
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="rounded-sm px-2 py-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1B2559] data-[state=inactive]:text-white/80 cursor-pointer"
            >
              Role management
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal" className="mt-6">
          <PersonalDetailsTab />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamManagementTab />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RoleManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
