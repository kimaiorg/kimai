"use client";

import { useCurrentLocale, useChangeLocale, Locale, localeNames } from "@/lib/i18n";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useChangeLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (locale: Locale) => {
    changeLocale(locale);
    setIsOpen(false);
  };

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="h-5 w-5 relative overflow-hidden rounded-sm">
            <Image
              src={`/flags/${currentLocale === "en" ? "uk" : "vn"}.png`}
              alt={localeNames[currentLocale]}
              fill
              className="object-cover"
            />
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-32"
      >
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onClick={() => handleLanguageChange("en")}
        >
          <div className="h-5 w-5 relative overflow-hidden rounded-sm">
            <Image
              src="/flags/uk.png"
              alt="English"
              fill
              className="object-cover"
            />
          </div>
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onClick={() => handleLanguageChange("vi")}
        >
          <div className="h-5 w-5 relative overflow-hidden rounded-sm">
            <Image
              src="/flags/vn.png"
              alt="Tiếng Việt"
              fill
              className="object-cover"
            />
          </div>
          <span>Vietnamese</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
