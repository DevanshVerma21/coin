"use client";

import React, { useState } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { toggleSold } from "@/actions/items";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ToggleSoldButtonProps {
  id: string;
  sold: boolean;
}

export function ToggleSoldButton({ id, sold }: ToggleSoldButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    const result = await toggleSold(id);
    if (result.success) {
      toast.success(sold ? "Marked as available" : "Marked as sold");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        sold
          ? "text-green-600 hover:bg-green-50"
          : "text-muted-foreground hover:bg-muted"
      )}
      title={sold ? "Mark as available" : "Mark as sold"}
      aria-label={sold ? "Mark as available" : "Mark as sold"}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : sold ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
