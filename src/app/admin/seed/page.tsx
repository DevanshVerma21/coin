import type { Metadata } from "next";
import { SeedButton } from "@/components/admin/seed-button";

export const metadata: Metadata = { title: "Seed Sample Data — Admin" };

export default function SeedPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl font-bold">Sample Data</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quickly populate the catalog with sample coins and banknotes using
          authenticated Cloudinary sample images. Safe to run multiple times —
          skips duplicates by slug.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold text-sm">Available Samples</h2>
        <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
          <li>1835 British India Gold Mohur (Coin · RRR)</li>
          <li>Queen Victoria Gold Sovereign 1877 (Coin · RR)</li>
          <li>Shah Jahan Gold Mohur (Coin · RR)</li>
          <li>Victoria 10 Rupees 1870 (Coin · RRR)</li>
          <li>British India 10 Rupees Note (Note · R)</li>
          <li>Reserve Bank of India 1 Rupee 1940 (Note · RR)</li>
        </ul>
        <SeedButton />
      </div>
    </div>
  );
}
