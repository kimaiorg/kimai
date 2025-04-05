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
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Role, RolePermissionType, RoleType } from "@/type_schema/role";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentLocale } from "@/lib/i18n";

const allowRole = (role: RoleType, roles: Role[] = []) => {
  if (!role) return false;
  if (roles.length == 0) return true;
  return (
    roles.filter((r) => {
      return role.name.toLowerCase() === r.toString().toLowerCase();
    }).length > 0
  );
};

export function NavMain({
  items
}: {
  items: {
    title: string;
    translationKey?: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    allowRoles?: Role[];
    items?: {
      title: string;
      translationKey?: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      allowRoles?: Role[];
    }[];
  }[];
}) {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const userRolePermissions = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
  const currentPath = usePathname();
  const activeClassname = "!bg-violet-600 !text-white !hover:text-white";

  // Function to get the localized URL
  const getLocalizedUrl = (url: string) => {
    // If the URL already has a locale prefix, replace it with the current locale
    if (url.match(/^\/(en|vi)\//)) {
      return `/${locale}${url.substring(3)}`;
    }
    // Otherwise, add the current locale prefix
    return `/${locale}${url}`;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(
          (item) =>
            allowRole(userRolePermissions.role, item.allowRoles) &&
            (item.items ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.items.filter((i) => currentPath.endsWith(i.url)).length > 0}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.translationKey ? t(item.translationKey) : item.title}
                      isActive={item.items.filter((i) => currentPath.endsWith(i.url)).length > 0}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.translationKey ? t(item.translationKey) : item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map(
                        (subItem) =>
                          allowRole(userRolePermissions.role!, subItem.allowRoles) && (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={currentPath.endsWith(subItem.url) ? activeClassname : ""}
                              >
                                <Link href={getLocalizedUrl(subItem.url)}>
                                  <span>{subItem.icon && <subItem.icon className="h-4 w-4" />}</span>
                                  <span>{subItem.translationKey ? t(subItem.translationKey) : subItem.title}</span>
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
                <SidebarMenuButton
                  asChild
                  className={currentPath.endsWith(item.url) ? activeClassname : ""}
                >
                  <Link href={getLocalizedUrl(item.url)}>
                    {item.icon && <item.icon />}
                    <span>{item.translationKey ? t(item.translationKey) : item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
