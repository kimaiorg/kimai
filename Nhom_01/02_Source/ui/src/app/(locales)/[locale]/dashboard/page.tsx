"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { useTranslation } from "@/lib/i18n";
import { use } from "react";

function Dashboard({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  // Unwrap params if it's a Promise
  use(params as Promise<{ locale: string }>);
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t("sidebar.dashboard")}</h1>
      <p className="text-lg mb-4">{t("common.welcome")}</p>
    </div>
  );
}

export default AuthenticatedRoute(Dashboard, []);
