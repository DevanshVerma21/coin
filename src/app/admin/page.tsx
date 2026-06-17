import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  Coins,
  Banknote,
  Star,
  CheckCircle,
  FolderOpen,
  ImageIcon,
  MessageSquare,
  Bell,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/actions/dashboard";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your marketplace</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Items" value={stats.totalItems} icon={Package} />
        <StatCard title="Coins" value={stats.totalCoins} icon={Coins} />
        <StatCard title="Banknotes" value={stats.totalNotes} icon={Banknote} />
        <StatCard title="Featured" value={stats.featuredItems} icon={Star} />
        <StatCard title="Sold" value={stats.soldItems} icon={CheckCircle} />
        <StatCard title="Categories" value={stats.totalCategories} icon={FolderOpen} />
        <StatCard title="Media Assets" value={stats.totalMedia} icon={ImageIcon} />
        <StatCard
          title="Pending Inquiries"
          value={stats.pendingInquiries}
          icon={Bell}
          className={stats.pendingInquiries > 0 ? "border-orange-200 bg-orange-50/50" : ""}
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent items */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Recent Items</h2>
            <Link
              href="/admin/items"
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats.recentItems.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No items yet</p>
            ) : (
              stats.recentItems.map((item) => (
                <Link
                  key={item._id}
                  href={`/admin/items/${item._id}`}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      #{item.itemNumber} · {item.year}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(item.price)}
                    </p>
                    {item.sold && (
                      <Badge variant="sold" className="text-[10px]">
                        Sold
                      </Badge>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats.recentInquiries.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No inquiries yet</p>
            ) : (
              stats.recentInquiries.map((inq) => (
                <div key={inq._id} className="flex items-center gap-3 p-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{inq.itemTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(inq.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      inq.status === "pending"
                        ? "destructive"
                        : inq.status === "contacted"
                        ? "gold"
                        : "secondary"
                    }
                    className="text-[10px] capitalize"
                  >
                    {inq.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold text-sm mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/items/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Package className="h-3.5 w-3.5" />
            Add Item
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Upload Media
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
