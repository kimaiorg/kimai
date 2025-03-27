"use client";

import DataCard from "@/app/(pages)/dashboard/data-card";
import { TimesheetBarChart } from "@/app/(pages)/dashboard/timesheet-bar-chart";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { useTranslation } from "@/lib/i18n";
import { Clock, Clock4, Clock8, PartyPopper } from "lucide-react";

function Dashboard() {
  const { t } = useTranslation();
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">{t("page.dashboard.title")}</h1>
      <div className="pt-5">
        <TimesheetBarChart />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
        <DataCard
          title={t("page.dashboard.today")}
          data={2}
          trending={2}
          icon={{ icon: PartyPopper }}
        />
        <DataCard
          title={t("page.dashboard.thisWeek")}
          data={36}
          trending={12}
          icon={{ icon: Clock }}
        />
        <DataCard
          title={t("page.dashboard.thisMonth")}
          data={208}
          trending={12}
          icon={{ icon: Clock4 }}
        />
        <DataCard
          title={t("page.dashboard.thisYear")}
          data={1503}
          trending={234}
          icon={{ icon: Clock8 }}
        />
      </div>
    </div>
  );
}
export default AuthenticatedRoute(Dashboard, []);
