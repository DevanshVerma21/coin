"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

const navLinks = [
  { href: "/", label: "Museum", exact: true },
  { href: "/coins", label: "Coins" },
  { href: "/notes", label: "Notes" },
];

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [pathname]);

  // Lock body scroll when mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdownOpen]);

  function isActive(link: (typeof navLinks)[0]) {
    if (link.exact) return pathname === link.href;
    return pathname.startsWith(link.href);
  }

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? "U").toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "shadow-[0_1px_0_rgba(166,148,120,0.3)] backdrop-blur-sm" : ""
      )}
      style={{ background: "#f5f0e8", borderBottom: "1px solid rgba(166,148,120,0.25)" }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-16">
        <div className="flex h-[60px] items-center justify-between">

          {/* Logo — Task 5: increased from 22px → 25px (~14%) */}
          <Link
            href="/"
            aria-label="NTIK Home"
            className="font-serif font-bold text-[25px] tracking-[0.06em] leading-none transition-opacity hover:opacity-70"
            style={{ color: "#1a1208" }}
          >
            NTIK
          </Link>

          {/* Desktop nav — centered — Task 5: gap-1 → gap-2 */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors",
                    active ? "text-[#1a1208]" : "text-[#6b5c45] hover:text-[#1a1208]"
                  )}
                  style={{ fontFamily: "var(--font-public-sans)" }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[1.5px]"
                      style={{ background: "#1a1208" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* User area */}
            {user ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded transition-colors hover:bg-black/5"
                  style={{ color: "#6b5c45" }}
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name ?? "User"}
                      className="h-7 w-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span
                      className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: "#735c00" }}
                    >
                      {initials}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 py-1 z-50"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(166,148,120,0.35)",
                      borderRadius: "2px",
                      boxShadow: "0 8px 24px rgba(26,18,8,0.1)",
                    }}
                    role="menu"
                  >
                    {/* User info */}
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: "1px solid rgba(166,148,120,0.2)" }}
                    >
                      <p
                        className="font-semibold text-[13px] truncate"
                        style={{ color: "#1a1208", fontFamily: "var(--font-public-sans)" }}
                      >
                        {user.name ?? "Collector"}
                      </p>
                      <p
                        className="text-[12px] truncate mt-0.5"
                        style={{ color: "#8a7560", fontFamily: "var(--font-public-sans)" }}
                      >
                        {user.email}
                      </p>
                      {user.role === "admin" && (
                        <span
                          className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase"
                          style={{
                            background: "rgba(201,162,39,0.15)",
                            color: "#735c00",
                            border: "1px solid rgba(201,162,39,0.3)",
                          }}
                        >
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          role="menuitem"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold tracking-[0.06em] uppercase transition-colors hover:bg-black/5"
                          style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account"
                        role="menuitem"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold tracking-[0.06em] uppercase transition-colors hover:bg-black/5"
                        style={{ fontFamily: "var(--font-public-sans)", color: "#6b5c45" }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <UserCircle className="h-3.5 w-3.5" />
                        My Account
                      </Link>
                    </div>

                    {/* Sign out */}
                    <div style={{ borderTop: "1px solid rgba(166,148,120,0.2)" }}>
                      <button
                        role="menuitem"
                        onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold tracking-[0.06em] uppercase transition-colors hover:bg-red-50"
                        style={{ fontFamily: "var(--font-public-sans)", color: "#ba1a1a" }}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Task 3: Premium "Sign In" pill — transparent bg, antique gold border, rounded pill */
              <Link
                href="/signin"
                className="hidden md:inline-flex items-center gap-2 h-9 px-5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[rgba(201,162,39,0.08)]"
                style={{
                  fontFamily: "var(--font-public-sans)",
                  color: "#6b5c45",
                  border: "1px solid rgba(201,162,39,0.4)",
                }}
                aria-label="Sign in"
              >
                <User className="h-[15px] w-[15px]" />
                Sign In
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="flex md:hidden h-9 w-9 items-center justify-center rounded transition-colors hover:bg-black/5"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{ color: "#6b5c45" }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "#f5f0e8", borderTop: "1px solid rgba(166,148,120,0.25)" }}>
          <nav className="max-w-[1280px] mx-auto px-5 py-4 space-y-0.5" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase rounded transition-colors",
                    active
                      ? "text-[#1a1208] bg-black/5"
                      : "text-[#6b5c45] hover:text-[#1a1208] hover:bg-black/5"
                  )}
                  style={{ fontFamily: "var(--font-public-sans)" }}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-3 space-y-0.5" style={{ borderTop: "1px solid rgba(166,148,120,0.25)" }}>
              {user ? (
                <>
                  {/* Mobile: user info */}
                  <div className="px-3 py-2">
                    <p
                      className="text-[13px] font-semibold truncate"
                      style={{ color: "#1a1208", fontFamily: "var(--font-public-sans)" }}
                    >
                      {user.name ?? "Collector"}
                    </p>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: "#8a7560", fontFamily: "var(--font-public-sans)" }}
                    >
                      {user.email}
                    </p>
                  </div>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase text-[#6b5c45] hover:text-[#1a1208] transition-colors"
                      style={{ fontFamily: "var(--font-public-sans)" }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-3 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase text-[#6b5c45] hover:text-[#1a1208] transition-colors"
                    style={{ fontFamily: "var(--font-public-sans)" }}
                  >
                    <UserCircle className="h-4 w-4" />
                    My Account
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-3 py-3 text-[13px] font-semibold tracking-[0.1em] uppercase transition-colors"
                    style={{ fontFamily: "var(--font-public-sans)", color: "#ba1a1a" }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                /* Task 3: Mobile Sign In — pill style matching desktop */
                <Link
                  href="/signin"
                  className="flex items-center gap-2 mx-3 mt-1 px-4 py-2.5 rounded-full text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[rgba(201,162,39,0.08)] justify-center"
                  style={{
                    fontFamily: "var(--font-public-sans)",
                    color: "#6b5c45",
                    border: "1px solid rgba(201,162,39,0.4)",
                  }}
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
