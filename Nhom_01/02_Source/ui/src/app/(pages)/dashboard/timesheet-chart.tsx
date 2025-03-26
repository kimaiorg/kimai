"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
const chartData = [
  { date: "25-03", hour: 9 },
  { date: "26-03", hour: 8 },
  { date: "27-03", hour: 7 },
  { date: "28-03", hour: 8 },
  { date: "29-03", hour: 0 },
  { date: "30-03", hour: 0 },
  { date: "31-03", hour: 0 }
];

const chartConfig = {
  hour: {
    label: "Working hours",
    color: "hsl(var(--chart-1))"
  }
} satisfies ChartConfig;

export function TimesheetChart() {
  return (
    <Card className="w-[90%] mx-auto">
      <CardHeader>
        <CardTitle>My Timesheet</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
            />
            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickCount={3}
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
              fill="var(--chart-1)"
              radius={8}
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
  );
}
