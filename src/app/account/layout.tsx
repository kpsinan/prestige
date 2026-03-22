"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, Share2 } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // We do not want to show the account navigation tabs on the Login or Register pages
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

  if (isAuthPage) {
    return <>{children}</>;
  }

  // The Navigation Tabs for the Dashboard
  const tabs = [
    { name: "Dashboard & Orders", href: "/account", icon: LayoutDashboard },
    { name: "Saved Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Shared Links & Earnings", href: "/account/shared-links", icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      
      {/* Account Sub-Navigation Menu */}
      <div className="bg-white border-b border-gray-200 sticky top-[64px] md:top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-6 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Render the actual page (Dashboard, Addresses, or Shared Links) */}
      <div>
        {children}
      </div>
      
    </div>
  );
}