"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { usePathname } from "next/navigation";

// Inner component — uses usePathname (safe, no Suspense needed in Next 15)
function NavProgressInner() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function schedule(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }

  // Listen for any internal link click → start progress immediately
  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      // Skip external, hash-only, mailto, tel links
      if (!href || href.startsWith("http") || href.startsWith("#") ||
          href.startsWith("mailto") || href.startsWith("tel")) return;
      // Skip same page
      const targetPath = href.split("?")[0];
      if (targetPath === pathname) return;

      clearTimers();
      setVisible(true);
      setWidth(0);
      // Rapid ramp to 30%, then slow crawl to 85%
      schedule(() => setWidth(30), 50);
      schedule(() => setWidth(55), 300);
      schedule(() => setWidth(72), 800);
      schedule(() => setWidth(85), 1800);
    }

    document.addEventListener("click", onLinkClick, true);
    return () => document.removeEventListener("click", onLinkClick, true);
  }, [pathname]);

  // When pathname changes — navigation is done, complete the bar
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    clearTimers();
    setWidth(100);
    schedule(() => {
      setVisible(false);
      setWidth(0);
    }, 350);
  }, [pathname]);

  if (!visible && width === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        height: "2px",
        width: `${width}%`,
        background: "linear-gradient(90deg, #735c00 0%, #d4af37 60%, #f5d76e 100%)",
        transition: width === 100
          ? "width 0.25s ease-out, opacity 0.3s ease 0.25s"
          : "width 0.5s cubic-bezier(0.1, 0.4, 0.3, 1)",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        boxShadow: "0 0 6px rgba(212,175,55,0.6)",
      }}
    />
  );
}

export function NavProgress() {
  return (
    <Suspense fallback={null}>
      <NavProgressInner />
    </Suspense>
  );
}
