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
        <div className="flex items-center justify-center">
          <img
            src="https://demo.kimai.org/touch-icon-192x192.png"
            alt="Kimai"
            className="w-10 h-10"
          />
        </div>
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
