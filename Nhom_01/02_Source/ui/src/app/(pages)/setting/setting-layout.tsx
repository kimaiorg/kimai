"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  children: ReactNode;
}

interface SettingsNavItem {
  title: string;
  href: string;
  count: number;
}

const settingsNavItems: SettingsNavItem[] = [
  { title: "Activity", href: "/settings/activity", count: 3 },
  { title: "Authentication", href: "/settings/authentication", count: 5 },
  { title: "Calendar", href: "/settings/calendar", count: 10 },
  { title: "Customer", href: "/settings/customer", count: 6 },
  { title: "Employment contract", href: "/settings/employment-contract", count: 4 },
  { title: "Expenses", href: "/settings/expenses", count: 2 },
  { title: "Invoices", href: "/settings/invoices", count: 3 },
  { title: "Kiosk mode", href: "/settings/kiosk-mode", count: 15 },
  { title: "Lockdown period", href: "/settings/lockdown-period", count: 4 },
  { title: "My company", href: "/settings/my-company", count: 3 },
  { title: "Project", href: "/settings/project", count: 4 },
  { title: "Theme", href: "/settings/theme", count: 2 },
  { title: "Time Tracking", href: "/settings/time-tracking", count: 10 },
  { title: "Time rounding", href: "/settings/time-rounding", count: 5 },
  { title: "User", href: "/settings/user", count: 5 },
  { title: "Weekly hours", href: "/settings/weekly-hours", count: 3 }
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
      <div className="w-full border-r md:w-64 bg-white dark:bg-slate-700">
        <nav className="flex flex-col">
          {settingsNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between border-b px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-slate-800",
                pathname === item.href && "bg-gray-50 font-medium"
              )}
            >
              <span>{item.title}</span>
              <span className="text-gray-500">{item.count}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
