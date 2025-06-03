"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { getDashboardReport } from "@/api/report.api";
import DataCard from "@/app/(pages)/dashboard/data-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { useTranslation } from "@/lib/i18n";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Clock, Clock4, Clock8, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

const chartConfig = {
  hour: {
    label: "Working hours",
    color: "hsl(var(--chart-1))"
  }
} satisfies ChartConfig;

export function TimesheetBarChart() {
  const [chartData, setChartData] = useState<{ date: string; hour: number }[]>([]);
  const [dataCard, setDataCard] = useState<any | null>(null);
  const { user: currentUser } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    const getReportWeek = async () => {
      const response = await getDashboardReport(currentUser!.sub!);
      console.log(response);
      // setChartData(response.chartData);
      setChartData([
        { date: "24-03", hour: 8 },
        { date: "25-03", hour: 9 },
        { date: "26-03", hour: 8 },
        { date: "27-03", hour: 7 },
        { date: "28-03", hour: 5 },
        { date: "29-03", hour: 6 },
        { date: "30-03", hour: 0 }
      ]);
      setDataCard(response.summary);
    };
    try {
      getReportWeek();
    } catch (error: any) {
      setChartData([
        { date: "24-03", hour: 8 },
        { date: "25-03", hour: 9 },
        { date: "26-03", hour: 8 },
        { date: "27-03", hour: 7 },
        { date: "28-03", hour: 1.5 },
        { date: "29-03", hour: 0 },
        { date: "30-03", hour: 0 }
      ]);
    }
  }, []);

  return (
    <>
      <Card className="mx-auto bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>{t("page.dashboard.timesheet")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              defaultShowTooltip
            >
              <CartesianGrid
                vertical={true}
                horizontal={true}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={true}
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickCount={20}
                label={t("page.dashboard.chart.hours")}
              />
              <CartesianGrid
                vertical={true}
                horizontal={true}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <ChartLegend
                content={<ChartLegendContent />}
                className="p-0 translate-y-3 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
              />
              <Bar
                dataKey="hour"
                fill="var(--chart-2 )"
                radius={8}
                barSize={36}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> 
      </CardFooter> */}
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
        {dataCard && (
          <>
            <DataCard
              title={t("page.dashboard.today")}
              // data={dataCard.today.hours}
              data={5}
              trending={dataCard.today.trending}
              icon={{ icon: PartyPopper }}
            />
            <DataCard
              title={t("page.dashboard.thisWeek")}
              // data={dataCard.week.hours}
              data={63}
              trending={dataCard.week.trending}
              icon={{ icon: Clock }}
            />
            <DataCard
              title={t("page.dashboard.thisMonth")}
              // data={dataCard.month.hours}
              data={267}
              trending={dataCard.month.trending}
              icon={{ icon: Clock4 }}
            />
            <DataCard
              title={t("page.dashboard.thisYear")}
              // data={dataCard.year.hours}
              data={3170}
              trending={dataCard.year.trending}
              icon={{ icon: Clock8 }}
            />
          </>
        )}
      </div>
    </>
  );
}
