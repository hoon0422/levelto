import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LevelTO — Accessible Navigation for Toronto",
  description:
    "Wheelchair and limited-mobility route planner combining Open Toronto data, terrain slope analysis, and TTC accessibility verification.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--primary-foreground)]"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
