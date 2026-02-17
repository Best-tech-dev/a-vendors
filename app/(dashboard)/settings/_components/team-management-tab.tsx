"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
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

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-brand-title">
                  NAME
                </TableHead>
                <TableHead className="font-semibold text-brand-title">
                  EMAIL
                </TableHead>
                <TableHead className="font-semibold text-brand-title">
                  ROLE
                </TableHead>
                <TableHead className="font-semibold text-brand-title">
                  STATUS
                </TableHead>
                <TableHead className="font-semibold text-brand-title text-right">
                  ACTION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-brand-description">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-brand-description">
                    {member.role}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-700"
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
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
      </div>

      <AddTeamMemberDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
