import type { Metadata } from "next";
// 1. Import the Inter font from Next.js built-in Google Fonts module
import { Inter } from "next/font/google"; 
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartDrawer from "../components/layout/CartDrawer";
import { CartProvider } from "../providers/CartProvider";

// 2. Initialize the font (Latin subset covers English and standard symbols)
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Ensures text stays visible while the font loads
});

export const metadata: Metadata = {
  title: "Prestige Traders | Premium Home & Auto Essentials",
  description: "High-quality kitchen accessories and compatible car spare parts. Trusted reliability since 2009. Edakkara, Malappuram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* 3. Apply inter.className to the body tag alongside your Tailwind classes */}
      <body className={`${inter.className} antialiased bg-white text-gray-900 flex flex-col min-h-screen`}>
        <CartProvider>
          <Header />
          <CartDrawer />
          
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}