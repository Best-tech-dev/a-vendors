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
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="bg-[#1B2559] text-white rounded-lg p-1 h-auto w-fit">
          <TabsTrigger
            value="personal"
            className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1B2559] data-[state=inactive]:text-white/80 cursor-pointer"
          >
            Personal details
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1B2559] data-[state=inactive]:text-white/80 cursor-pointer"
          >
            Team management
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1B2559] data-[state=inactive]:text-white/80 cursor-pointer"
          >
            Role management
          </TabsTrigger>
        </TabsList>

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
