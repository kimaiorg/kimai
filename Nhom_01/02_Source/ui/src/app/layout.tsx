"use client";
import { DarkModeThemeProvider } from "@/components/shared/darkmode-theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/lib/react-query/react-query-provider";
import ReduxStoreProvider from "@/lib/redux-toolkit/redux-store-provider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Suspense } from "react";
import "./globals.css";

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body className={`antialiased`}>
                <DarkModeThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <UserProvider>
                        <Suspense>
                            <ReactQueryProvider>
                                <ReduxStoreProvider>
                                    <main className="w-full custom-bg-dashboard">{children}</main>
                                </ReduxStoreProvider>
                            </ReactQueryProvider>
                        </Suspense>
                    </UserProvider>
                    <Toaster />
                </DarkModeThemeProvider>
            </body>
        </html>
    );
}
