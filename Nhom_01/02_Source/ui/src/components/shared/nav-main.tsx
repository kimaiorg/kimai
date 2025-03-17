"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { UserType } from "@/type_schema/user.schema";
import { Role, RoleType } from "@/type_schema/role";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";

const allowRole = (userRoles: RoleType[], roles: Role[] = []) => {
    if (userRoles.length == 0) return false;
    if (roles.length == 0) return true;
    return (
        roles.filter((r) => {
            return userRoles.filter((role) => role.name.toLowerCase() === r.toString().toLowerCase()).length > 0;
        }).length > 0
    );
};

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        allowRoles?: Role[];
        items?: {
            title: string;
            url: string;
            icon?: LucideIcon;
            isActive?: boolean;
            allowRoles?: Role[];
        }[];
    }[];
}) {
    // const user = useAppSelector((state) => state.userState.user) as UserType;
    const { user, error, isLoading } = useUser();
    const userRoles = useAppSelector((state) => state.userState.roles) as RoleType[];
    const currentPath = usePathname();
    const activeClassname = "!bg-violet-600 !text-white !hover:text-white";
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(
                    (item) =>
                        allowRole(userRoles, item.allowRoles) &&
                        (item.items ? (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.items.filter((i) => i.url == currentPath).length > 0}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={item.items.filter((i) => i.url == currentPath).length > 0}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map(
                                                (subItem) =>
                                                    allowRole(userRoles!, subItem.allowRoles) && (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                className={
                                                                    subItem.url == currentPath ? activeClassname : ""
                                                                }
                                                            >
                                                                <Link href={subItem.url}>
                                                                    <span>
                                                                        {subItem.icon && (
                                                                            <subItem.icon className="h-4 w-4" />
                                                                        )}
                                                                    </span>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                            )}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild className={item.url == currentPath ? activeClassname : ""}>
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
