"use client";

import { getReportViewByType, reportCards } from "@/app/(pages)/reporting/report-items";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import { ReportView, ReportViewType } from "@/type_schema/report";
import { useState } from "react";

function Reporting() {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<ReportViewType>(getReportViewByType(ReportView.WEEKLY_USER));

  const handleSelectingReport = (component: ReportViewType) => {
    setSelectedReport(component);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{t("page.reporting.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((report, index) => (
          <Card
            className="p-4 !flex-row hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer flex items-center border border-gray-200"
            key={index}
            onClick={() => handleSelectingReport(report)}
          >
            <div className="bg-white dark:bg-slate-700 p-2 rounded-md">{report.icon}</div>
            <span className="font-medium">{report.title}</span>
          </Card>
        ))}
      </div>
      {selectedReport && (
        <>
          <div className="py-6">
            <h2 className="text-lg font-bold mb-2">{selectedReport.title}</h2>
            <selectedReport.component />
          </div>
        </>
      )}
    </>
  );
}

export default AuthenticatedRoute(Reporting, []);
