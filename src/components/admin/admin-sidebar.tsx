"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ImageIcon,
  Star,
  MessageSquare,
  Coins,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/items", icon: Package, label: "Items" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/media", icon: ImageIcon, label: "Media Vault" },
  { href: "/admin/featured", icon: Star, label: "Featured" },
  { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="flex flex-col w-64 h-full bg-card border-r border-border">
      <Link
        href="/"
        className="flex h-16 items-center gap-2 px-5 border-b border-border hover:bg-muted/50 transition-colors"
        title="Return to public site"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Coins className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-serif font-bold text-sm gold-text">NTIK</p>
          <p className="text-[10px] text-muted-foreground">Admin Panel</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={onClose}
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:flex">
        <SidebarContent />
      </div>

      <button
        className="lg:hidden fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border shadow-sm"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <SidebarContent onClose={() => setMobileOpen(false)} />
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        </div>
      )}
    </>
  );
}
