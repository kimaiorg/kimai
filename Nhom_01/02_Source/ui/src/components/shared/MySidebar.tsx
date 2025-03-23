"use client";
import { timesheetNavMain } from "@/components/shared/nav-links";
import { NavMain } from "@/components/shared/nav-main";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";

export function MySidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            {...props}
            className="border-gray-50 p-0"
        >
            <SidebarHeader className="bg-gray-50 dark:bg-slate-800 border-b-gray-50">
                <h3 className="text-3xl text-center font-bold dynamic-text-2 py-3">Kimai Clone</h3>
            </SidebarHeader>
            <Separator
                orientation="horizontal"
                className="mt-0"
            />
            <SidebarContent className="bg-white dark:bg-black">
                <NavMain items={timesheetNavMain} />
                {/* <NavProjects projects={projects} /> */}
            </SidebarContent>
            {/* <Separator orientation="horizontal" className="mt-0" /> */}
            <SidebarFooter className=" dark:bg-slate-800 h-14 bg-white">{/* <NavUser /> */}</SidebarFooter>
        </Sidebar>
    );
}
