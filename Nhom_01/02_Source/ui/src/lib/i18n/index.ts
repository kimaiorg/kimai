"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export type Locale = "en" | "vi";

export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "vi"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt"
};

export function useChangeLocale() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = useCallback(
    (locale: Locale) => {
      // Get the current path without the locale prefix
      const currentPathWithoutLocale = pathname.replace(/^\/(en|vi)/, "");

      // Navigate to the new path with the selected locale
      const newPath = `/${locale}${currentPathWithoutLocale}`;
      router.push(newPath);
    },
    [pathname, router]
  );

  return { changeLocale };
}

export function getLocaleFromPath(path: string): Locale {
  const match = path.match(/^\/(en|vi)/);
  return (match?.[1] as Locale) || defaultLocale;
}

export function useCurrentLocale(): Locale {
  const pathname = usePathname();
  return getLocaleFromPath(pathname);
}

export { useTranslation } from "./useTranslation";
