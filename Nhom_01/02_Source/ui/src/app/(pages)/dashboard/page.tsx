"use client";

import { TimesheetBarChart } from "@/app/(pages)/dashboard/timesheet-bar-chart";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { useTranslation } from "@/lib/i18n";

function Dashboard() {
  const { t } = useTranslation();
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">{t("page.dashboard.title")}</h1>
      <div className="pt-5">
        <TimesheetBarChart />
      </div>
    </div>
  );
}
export default AuthenticatedRoute(Dashboard, []);
