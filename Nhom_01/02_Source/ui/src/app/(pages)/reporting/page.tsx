"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { useTranslation } from "@/lib/i18n";

function Reporting() {
  const {t} = useTranslation();
  return <div>{t("page.reporting.title")}</div>;
}
export default AuthenticatedRoute(Reporting, []);
