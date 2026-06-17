import type { Metadata } from "next";
import { getMediaAssets } from "@/actions/media";
import { MediaVault } from "@/components/admin/media-vault";

export const metadata: Metadata = { title: "Media Vault — Admin" };

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AdminMediaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const search = params.search;

  const { data: assets, meta } = await getMediaAssets(page, 24, search);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Media Vault</h1>
        <p className="text-sm text-muted-foreground">{meta.total} assets total</p>
      </div>
      <MediaVault initialAssets={assets} meta={meta} />
    </div>
  );
}
