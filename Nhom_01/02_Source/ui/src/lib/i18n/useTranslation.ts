"use client";

import { useCallback } from "react";
import { useCurrentLocale } from "./index";
import { translations } from "./translations";

export function useTranslation() {
  const locale = useCurrentLocale();

  const t = useCallback(
    (key: string) => {
      const keys = key.split(".");
      let value = translations[locale];

      for (const k of keys) {
        if (value === undefined) return key;
        value = value[k];
      }

      return value === undefined ? key : value;
    },
    [locale]
  );

  return { t };
}
