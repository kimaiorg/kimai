"use client";

import Notification from "@/components/shared/Header/notification";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Bell, LogOut, UserRoundSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LanguageSwitcher } from "./language-switcher";

export function NavUser() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const handleLogout = () => {
    toast("Logout", {
      description: "You are logging out",
      className: "!bg-sky-500 !text-white",
      duration: 3000
    });
    window.location.href = "/api/auth/logout";
  };

  if (isLoading) {
    return <p className="text-end">Loading ...</p>;
  }
  if (!isLoading && !user) {
    return (
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Button
          className="px-6 py-3 text-white bg-main rounded-md transition"
          onClick={() => (window.location.href = "/api/auth/login")}
        >
          Login
        </Button>
      </div>
    );
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Notification>
            <div className="flex justify-center items-center cursor-pointer">
              <Bell
                size={22}
                strokeWidth={2}
              />
            </div>
          </Notification>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 flex-row-reverse cursor-pointer">
                <div className="rounded-full">
                  <img
                    src={user!.picture!}
                    alt={user!.name!}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                  />
                </div>
                <div className="grid flex-1 text-end text-sm leading-tight">
                  <span className="truncate font-semibold">{user!.name}</span>
                  {/* <span className="truncate text-xs">{user!.email}</span> */}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg border border-gray-200"
              align="end"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="h-7 w-7 rounded-full">
                    <img
                      src={user!.picture!}
                      alt={user!.name!}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user!.name || "Admin"}</span>
                    <span className="truncate text-xs">{user!.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <UserRoundSearch />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/notifications")}
                >
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
