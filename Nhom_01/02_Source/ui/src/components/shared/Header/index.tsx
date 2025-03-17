"use client";

import { NavUser } from "@/components/shared/Header/nav-user";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
    return (
        <div className="px-3 py-2 sm:px-8 flex justify-between items-center border-b bg-white dark:bg-slate-800 dark:border-b-gray-50">
            <SidebarTrigger />
            <NavUser />
        </div>
    );
}
