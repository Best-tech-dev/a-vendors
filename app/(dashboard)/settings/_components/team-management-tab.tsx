"use client";

import { useState, useEffect, useCallback } from "react";
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
import { usersApi } from "@/lib/api/profile";
import type { TeamUser, PaginationMeta } from "@/types/profile";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { AddTeamMemberDialog } from "./dialogs/add-team-member-dialog";

const PAGE_SIZE = 5;

export function AdminManagementTab() {
  const [addOpen, setAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const { data: res } = await usersApi.getAdmins({
        page,
        limit: PAGE_SIZE,
      });
      setUsers(res.data);
      setMeta(res.meta);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Failed to load admins. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const totalPages = meta?.totalPages ?? 1;

  return (
    <>
      <Card className="overflow-hidden p-0 gap-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-2 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-title">
              Admin management
            </h2>
            <p className="text-sm text-brand-description">
              Manage admin access and permissions
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
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <span className="block h-4 w-28 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell>
                      <span className="block h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="block ml-auto h-4 w-6 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                  </TableRow>
                ))
              : users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-brand-description">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell className="text-brand-description">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-brand-description capitalize">
                      {user.role}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "bg-[#F0F8F5] text-[#008753] border-0"
                            : "bg-gray-100 text-gray-600 border-0"
                        }
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
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
              disabled={!meta?.hasPrevPage}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              disabled={!meta?.hasNextPage}
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
