"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { teamMembers } from "../_data/mock-data";
import { AddTeamMemberDialog } from "./dialogs/add-team-member-dialog";

const PAGE_SIZE = 5;

export function TeamManagementTab() {
  const [addOpen, setAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teamMembers.length / PAGE_SIZE);
  const paginatedMembers = teamMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <>
      <Card className="overflow-hidden p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-title">
              Team management
            </h2>
            <p className="text-sm text-brand-description">
              Manage team access and permissions
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)}>+ Add team member</Button>
        </div>

        <Separator className="mb-5 data-[orientation=horizontal]:h-[0.5px]" />

        {/* Table */}
        <Table className="[&_tr>*:first-child]:pl-6 [&_tr>*:last-child]:pr-6">
          <TableHeader className="bg-[#FAFBFC] [&_tr]:border-b-0">
            <TableRow className="border-b-0">
              <TableHead className="font-semibold text-brand-description">
                NAME
              </TableHead>
              <TableHead className="font-semibold text-brand-description">
                EMAIL
              </TableHead>
              <TableHead className="font-semibold text-brand-description">
                ROLE
              </TableHead>
              <TableHead className="font-semibold text-brand-description">
                STATUS
              </TableHead>
              <TableHead className="font-semibold text-brand-description text-right">
                ACTION
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="text-brand-description">
                  {member.name}
                </TableCell>
                <TableCell className="text-brand-description">
                  {member.email}
                </TableCell>
                <TableCell className="text-brand-description">
                  {member.role}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-[#F0F8F5] text-[#008753] border-0"
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Separator />

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-sm text-brand-description">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <AddTeamMemberDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
