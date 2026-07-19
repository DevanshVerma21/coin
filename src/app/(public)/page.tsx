import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ArchiveSelection } from "@/components/home/archive-selection";
import { HistoricalHighlights } from "@/components/home/historical-highlights";
import { CuratorInquiry } from "@/components/home/curator-inquiry";
import { getFeaturedItems, getItems } from "@/actions/items";
import { getCatalogCounts } from "@/actions/stats";

export const metadata: Metadata = {
  title: "NTIK Heritage — Preserving Tactile History",
  description:
    "The premier destination for rare numismatics. Discover the legacy of dynasties through the coins and banknotes that built them.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const [featuredItems, counts, coinResult, noteResult] = await Promise.all([
    getFeaturedItems(3),
    getCatalogCounts(),
    getItems({ type: "coin", sort: "newest", limit: 1, page: 1 }),
    getItems({ type: "note", sort: "newest", limit: 1, page: 1 }),
  ]);

  const coinSample = coinResult.data[0] ?? null;
  const noteSample = noteResult.data[0] ?? null;

  return (
    <>
      <Hero />
      <ArchiveSelection
        coinSample={coinSample as never}
        noteSample={noteSample as never}
        coinCount={counts.coins}
        noteCount={counts.notes}
      />
      <HistoricalHighlights items={featuredItems as never} />
      <CuratorInquiry />
    </>
  );
}
