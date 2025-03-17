"use client";

import ErrorPage from "@/app/error";
import Loading from "@/app/loading";
import Header from "@/components/shared/Header";
import { MySidebar } from "@/components/shared/MySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useCachedUserInfo } from "@/lib/react-query/userCache";
import { useAppDispatch } from "@/lib/redux-toolkit/hooks";
import { updateUser } from "@/lib/redux-toolkit/slices/userSlice";
import { CSSProperties, use, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const sidebarStyle = {
    "--sidebar-width": "17rem",
    "--sidebar-width-mobile": "17rem",
} as CSSProperties;

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { user, error, isLoading } = useUser();
    if (isLoading) return <Loading></Loading>;
    if (error) return <ErrorPage></ErrorPage>;
    return (
        <>
            <SidebarProvider style={sidebarStyle}>
                <MySidebar side="left" variant="floating" collapsible="offcanvas" />
                <div className="my-section bg-gradient-to-r from-sky-50 to-fuchsia-50 dark:from-gray-950 dark:to-gray-950">
                    <Header></Header>
                    {children}
                </div>
            </SidebarProvider>
        </>
    );
}
