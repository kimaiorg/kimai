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
import { CSSProperties, useState } from "react";

const sidebarStyle = {
  "--sidebar-width": "17rem",
  "--sidebar-width-mobile": "17rem"
} as CSSProperties;

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, error, isLoading } = useUser();
  const dispatch = useAppDispatch();
  const [isFetchingRole, setIsFetchingRole] = useState(true);
  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorPage
        statusCode={401}
        message="Unauthorized"
      />
    );

  if (!user) {
    return <div>Unauthorized</div>;
  } else {
    const fetchUserRolePermissions = async () => {
      const rolePermissions = await getUserRolePermissions(user!.sub!);
      if (!rolePermissions) {
        window.location.href = "/api/auth/login";
      }
      dispatch(updatePrivilege(rolePermissions));
      setIsFetchingRole(false);
    };
    try {
      fetchUserRolePermissions();
    } catch (error) {
      console.log(error);
      setIsFetchingRole(false);
      window.location.href = "/api/auth/login";
    }
    // console.log(user);
    // fetch("/api/token/api-server").then(async (res) => {
    //     if (res.ok) {
    //         const { accessToken } = await res.json();
    //         console.log(accessToken);
    //     }
    // });
  }

  if (isFetchingRole) {
    return <Loading />;
  }

  return (
    <>
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
    </>
  );
}
