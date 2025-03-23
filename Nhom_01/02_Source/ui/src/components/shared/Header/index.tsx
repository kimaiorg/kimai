"use client";

import { DarkModeToggle } from "@/components/shared/darkmode-toggle";
import { NavUser } from "@/components/shared/Header/nav-user";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
    return (
        <div className="px-3 py-2 sm:px-8 flex justify-between items-center border-b bg-white dark:bg-slate-800 dark:border-b-gray-50">
            <SidebarTrigger />
            <div className="flex justify-end gap-2 lg:gap-4 items-center">
                <DarkModeToggle />
                <NavUser />
            </div>
        </div>
    );
}
