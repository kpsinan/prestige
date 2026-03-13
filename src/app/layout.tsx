// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css"; // This is crucial to make Tailwind CSS work!

// This is where you set the title that appears in the browser tab
export const metadata: Metadata = {
  title: "Prestige Traders | Auto Parts",
  description: "High-quality car spare parts. Since 2009. Edakkara, Malappuram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {/* 'children' represents whatever page the user is currently looking at */}
        {children}
      </body>
    </html>
  );
}