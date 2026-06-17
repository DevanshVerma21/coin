import type { Metadata } from "next";
import { getInquiries } from "@/actions/inquiries";
import { InquiriesTable } from "@/components/admin/inquiries-table";

export const metadata: Metadata = { title: "Inquiries — Admin" };

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status;
  const page = params.page ? Number(params.page) : 1;

  const { data: inquiries, meta } = await getInquiries(page, 20, status);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Inquiries</h1>
        <p className="text-sm text-muted-foreground">{meta.total} total inquiries</p>
      </div>
      <InquiriesTable inquiries={inquiries} meta={meta} currentStatus={status} />
    </div>
  );
}
