"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Package, 
  MapPin, 
  Gift, 
  LayoutDashboard 
} from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. Hide navigation on Login or Register pages
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

  if (isAuthPage) {
    return <>{children}</>;
  }

  // 2. Define the navigation items
  const tabs = [
    { name: "Orders", href: "/account", icon: Package },
    { name: "Address", href: "/account/addresses", icon: MapPin },
    { name: "Earnings", href: "/account/shared-links", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      
      {/* --- PREMIUM TOP NAVIGATION (Fixed 3-Column Grid) --- */}
      <div className="sticky top-0 z-40 bg-[#FAFAFA]/90 backdrop-blur-md py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-1.5 bg-gray-100/60 p-1.5 rounded-[1.8rem] border border-gray-200/50 max-w-2xl mx-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {tab.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MAIN PAGE CONTENT --- */}
      <main>
        {children}
      </main>
      
    </div>
  );
}