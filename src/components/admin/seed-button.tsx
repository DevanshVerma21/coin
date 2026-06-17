"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle2, Sprout } from "lucide-react";
import { seedSampleItems } from "@/actions/seed";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const router = useRouter();

  async function handleSeed() {
    setLoading(true);
    try {
      const res = await seedSampleItems();
      setResult(res);
      toast.success(`Done! ${res.created} created, ${res.skipped} skipped.`);
      router.refresh();
    } catch (e) {
      toast.error("Seed failed: " + (e instanceof Error ? e.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-800">
            Seeded successfully — {result.created} items created, {result.skipped} already existed.
          </p>
          <p className="text-xs text-green-700 mt-0.5">Refresh the page or visit /admin/items</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="flex items-center gap-2 h-11 px-6 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
      style={{ background: "linear-gradient(135deg,#735c00,#d4af37)" }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sprout className="h-4 w-4" />
      )}
      {loading ? "Seeding…" : "Seed 6 Sample Items"}
    </button>
  );
}
