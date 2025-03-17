"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/redux-toolkit/store";

/**
 * @description Create a provider for the Redux store
 * @note Since only few states are stored globally and most of them need to be cached, I decided not to use Redux Toolkit. Instead, I use React Query
 * @reference https://redux-toolkit.js.org/usage/nextjs
 */

export default function ReduxStoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>(null);
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }
    return <Provider store={storeRef.current}>{children}</Provider>;
}

// Caching
export const dynamic = "force-dynamic";
