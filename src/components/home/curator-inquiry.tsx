"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

const SERVICES = [
  "Authentication",
  "Acquisition Advice",
  "Private Collection",
  "Auction Advisory",
  "General Inquiry",
];

export function CuratorInquiry() {
  const [form, setForm] = useState({ name: "", email: "", service: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
    const message = `Hello, I would like to make a private inquiry.\n\nName: ${form.name}\nEmail: ${form.email}\nService: ${form.service || "General Inquiry"}\n\nPlease contact me at your earliest convenience.`;

    const url = buildWhatsAppUrl(phone, message);
    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 800);
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-eb-garamond)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(166,148,120,0.25)",
    borderRadius: "2px",
    color: "#f5f0e8",
  };

  return (
    <section
      id="inquiry"
      className="w-full py-14 sm:py-16 px-5 sm:px-8"
      style={{ background: "#2d1e16" }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: copy */}
          <div>
            <p
              className="mb-4 tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#c9a227", fontWeight: 500 }}
            >
              Direct Contact
            </p>
            <h2
              className="font-serif font-semibold mb-5 leading-tight"
              style={{ fontSize: "clamp(26px, 3.5vw, 40px)", color: "#f5f0e8" }}
            >
              Private Inquiry
            </h2>
            <p
              className="mb-8 leading-relaxed"
              style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "16px", color: "#a89880" }}
            >
              Reach us directly for confidential consultation on acquisitions, authentication, and
              archival preservation. Fill in your details and we will connect with you on WhatsApp.
            </p>

            <ul className="space-y-3">
              {[
                "Global Authentication Services",
                "Private Auction Access",
                "Archival Preservation Guidance",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#c9a227" }}
                  />
                  <span style={{ fontFamily: "var(--font-public-sans)", fontSize: "13px", color: "#d0c5af" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div>
            {sent ? (
              <div
                className="flex flex-col items-center justify-center py-16 rounded"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <CheckCircle2 className="h-10 w-10 mb-4" style={{ color: "#c9a227" }} />
                <p className="font-serif font-semibold text-[20px] mb-2 text-center" style={{ color: "#f5f0e8" }}>
                  Inquiry Submitted
                </p>
                <p className="text-center text-[14px]" style={{ fontFamily: "var(--font-eb-garamond)", color: "#a89880" }}>
                  Opening WhatsApp for direct consultation…
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded p-6 sm:p-7 space-y-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
              >
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="inq-name"
                    className="block mb-1.5 tracking-[0.1em] uppercase"
                    style={{ fontFamily: "var(--font-public-sans)", fontSize: "10px", color: "#8a7560", fontWeight: 500 }}
                  >
                    Full Name
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full h-10 px-3 text-[14px] outline-none transition-colors"
                    style={inputStyle}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="inq-email"
                    className="block mb-1.5 tracking-[0.1em] uppercase"
                    style={{ fontFamily: "var(--font-public-sans)", fontSize: "10px", color: "#8a7560", fontWeight: 500 }}
                  >
                    Email Address
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full h-10 px-3 text-[14px] outline-none transition-colors"
                    style={inputStyle}
                  />
                </div>

                {/* Service */}
                <div>
                  <label
                    htmlFor="inq-service"
                    className="block mb-1.5 tracking-[0.1em] uppercase"
                    style={{ fontFamily: "var(--font-public-sans)", fontSize: "10px", color: "#8a7560", fontWeight: 500 }}
                  >
                    Type of Inquiry
                  </label>
                  <select
                    id="inq-service"
                    value={form.service}
                    onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                    className="w-full h-10 px-3 text-[14px] outline-none appearance-none cursor-pointer"
                    style={{ ...inputStyle, color: form.service ? "#f5f0e8" : "#8a7560" }}
                  >
                    <option value="" style={{ background: "#2d1e16" }}>Select a service…</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} style={{ background: "#2d1e16" }}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-[12px] font-semibold tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                  style={{ fontFamily: "var(--font-public-sans)", background: "#c9a227", color: "#1a1208", borderRadius: "2px" }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
