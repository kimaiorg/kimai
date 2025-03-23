"use client";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/lib/react-query/ReactQueryProvider";
import ReduxStoreProvider from "@/lib/redux-toolkit/ReduxStoreProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Suspense } from "react";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body className={`antialiased`}>
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
            </body>
        </html>
    );
}
