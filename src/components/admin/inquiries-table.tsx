"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateInquiryStatus, deleteInquiry } from "@/actions/inquiries";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { IInquiry, PaginationMeta } from "@/types";

interface InquiriesTableProps {
  inquiries: IInquiry[];
  meta: PaginationMeta;
  currentStatus?: string;
}

const statusVariant: Record<string, "destructive" | "gold" | "secondary"> = {
  pending: "destructive",
  contacted: "gold",
  closed: "secondary",
};

export function InquiriesTable({ inquiries, meta, currentStatus }: InquiriesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function setStatusFilter(status: string) {
    const url = status === "all" ? pathname : `${pathname}?status=${status}`;
    router.push(url);
  }

  async function handleStatusChange(id: string, status: "pending" | "contacted" | "closed") {
    setUpdatingId(id);
    startTransition(async () => {
      const result = await updateInquiryStatus(id, status);
      if (result.success) {
        toast.success("Status updated");
        router.refresh();
      } else {
        toast.error("Failed to update");
      }
      setUpdatingId(null);
    });
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteInquiry(id);
    if (result.success) {
      toast.success("Inquiry deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      {/* Status filter tabs — "closed" omitted because closing auto-deletes */}
      <div className="flex gap-2 border-b border-border pb-2">
        {["all", "pending", "contacted"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              (currentStatus ?? "all") === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No inquiries found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {inquiries.map((inq) => (
              <div key={inq._id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">{inq.itemTitle}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    Item #{inq.itemNumber}
                  </p>
                  {inq.userName && (
                    <p className="text-xs text-muted-foreground">
                      {inq.userName}
                      {inq.userEmail && ` · ${inq.userEmail}`}
                    </p>
                  )}
                  {inq.message && (
                    <p className="text-xs text-foreground/70 line-clamp-2">{inq.message}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground">{formatDate(inq.createdAt)}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={statusVariant[inq.status] ?? "secondary"} className="text-[10px] capitalize">
                    {inq.status}
                  </Badge>

                  {updatingId === inq._id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Select
                      value={inq.status}
                      onValueChange={(v: string) =>
                        handleStatusChange(inq._id, v as "pending" | "contacted" | "closed")
                      }
                    >
                      <SelectTrigger className="h-7 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Close & Delete</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <button
                    onClick={() => handleDelete(inq._id)}
                    disabled={deletingId === inq._id}
                    className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    aria-label="Delete inquiry"
                  >
                    {deletingId === inq._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
          <span>Page {meta.page} of {meta.totalPages}</span>
          <div className="flex gap-2">
            {meta.hasPrev && (
              <Link
                href={`${pathname}?${currentStatus ? `status=${currentStatus}&` : ""}page=${meta.page - 1}`}
                className="px-3 py-1 rounded border border-border hover:bg-muted transition-colors text-xs"
              >
                Previous
              </Link>
            )}
            {meta.hasNext && (
              <Link
                href={`${pathname}?${currentStatus ? `status=${currentStatus}&` : ""}page=${meta.page + 1}`}
                className="px-3 py-1 rounded border border-border hover:bg-muted transition-colors text-xs"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
