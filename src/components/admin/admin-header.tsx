"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";

interface AdminHeaderProps {
  user: Session["user"];
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card lg:pl-6">
      <div className="lg:hidden w-9" />

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "Admin"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {user.name?.[0]?.toUpperCase() ?? "A"}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-muted-foreground"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
