// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
// Using relative paths to fix the "Module not found" errors
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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
      <body className="antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}