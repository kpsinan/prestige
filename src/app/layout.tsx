import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {CartProvider} from "../providers/CartProvider";
import ShutterEffect from '../components/ui/ShutterEffect'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prestige - Premium Store",
  description: "Discover our premium collection of products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <ShutterEffect />
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}