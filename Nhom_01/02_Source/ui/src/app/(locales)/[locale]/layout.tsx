"use client";

import { getUserRolePermissions } from "@/api/auth.api";
import ErrorPage from "@/app/error";
import Loading from "@/app/loading";
import Header from "@/components/shared/Header";
import { MySidebar } from "@/components/shared/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppDispatch } from "@/lib/redux-toolkit/hooks";
import { updatePrivilege } from "@/lib/redux-toolkit/slices/user-slice";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState, CSSProperties } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales, Locale } from "@/lib/i18n";
import { use } from "react";

const sidebarStyle = {
  "--sidebar-width": "17rem",
  "--sidebar-width-mobile": "17rem"
} as CSSProperties;

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // Unwrap params if it's a Promise
  const { locale } = use(params as Promise<{ locale: string }>);

  const { user, error, isLoading } = useUser();
  const dispatch = useAppDispatch();
  const [isFetchingRole, setIsFetchingRole] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Validate locale
  useEffect(() => {
    if (!locales.includes(locale as Locale)) {
      router.push(`/en${pathname.replace(/^\/[^\/]+/, "")}`);
    }
  }, [locale, pathname, router]);

  // Handle authentication and permissions
  useEffect(() => {
    if (user && !isLoading) {
      const fetchUserRolePermissions = async () => {
        try {
          const rolePermissions = await getUserRolePermissions(user.sub!);
          if (!rolePermissions) {
            window.location.href = "/api/auth/login";
            return;
          }
          dispatch(updatePrivilege(rolePermissions));
          setIsFetchingRole(false);
        } catch (error) {
          console.error(error);
          setIsFetchingRole(false);
          window.location.href = "/api/auth/login";
        }
      };

      fetchUserRolePermissions();
    } else if (!isLoading && !user) {
      setIsFetchingRole(false);
    }
  }, [user, isLoading, dispatch]);

  if (isLoading || isFetchingRole) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorPage
        statusCode={401}
        message="Unauthorized"
      />
    );
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <SidebarProvider style={sidebarStyle}>
      <MySidebar
        side="left"
        variant="floating"
        collapsible="offcanvas"
      />
      <div className="my-section bg-gradient-to-r from-sky-50 to-fuchsia-50 dark:from-gray-950 dark:to-gray-950">
        <Header></Header>
        {children}
      </div>
    </SidebarProvider>
  );
}
