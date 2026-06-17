import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "4rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      // ── Stitch "Numismatic Heritage System" design tokens ──────────────────
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Stitch exact palette
        stitch: {
          gold: "#d4af37",
          "gold-primary": "#735c00",
          "gold-container": "#d4af37",
          "gold-inverse": "#e9c349",
          "gold-fixed": "#ffe088",
          parchment: "#fff8f1",
          "parchment-dim": "#e7d9bb",
          "parchment-variant": "#f0e1c3",
          walnut: "#221b08",
          "walnut-light": "#4d4635",
          "walnut-inverse": "#38301b",
          sienna: "#6e5a50",
          "sienna-container": "#f9ddd0",
          amber: "#7b5735",
          "amber-container": "#d8aa81",
          outline: "#7f7663",
          "outline-subtle": "#d0c5af",
          surface: "#fff8f1",
          "surface-low": "#fff2db",
          "surface-container": "#fcecce",
          "surface-high": "#f6e7c9",
          "surface-highest": "#f0e1c3",
          "surface-tint": "#735c00",
        },
      },
      fontFamily: {
        // Stitch: Playfair Display (headlines), EB Garamond (body), Public Sans (labels)
        sans: ["var(--font-public-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-eb-garamond)", "Georgia", "serif"],
        mono: ["monospace"],
      },
      fontSize: {
        // Stitch typography scale
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg-mobile": ["32px", { lineHeight: "1.2" }],
        "headline-md": ["32px", { lineHeight: "1.3" }],
        "headline-sm": ["24px", { lineHeight: "1.4" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "body-md": ["16px", { lineHeight: "1.6" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em" }],
        "meta": ["13px", { lineHeight: "1.4" }],
      },
      borderRadius: {
        // Stitch ROUND_FOUR
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      spacing: {
        // Stitch 8px unit scale
        section: "80px",
        "section-sm": "48px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
