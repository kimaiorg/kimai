"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function DarkModeThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
