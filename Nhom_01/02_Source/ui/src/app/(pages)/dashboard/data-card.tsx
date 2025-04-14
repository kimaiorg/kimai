"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpLeft } from "lucide-react";

export default function DataCard({
  title,
  data,
  trending,
  icon
}: {
  title: string;
  data: any;
  trending: any;
  icon: { icon: React.ElementType };
}) {
  return (
    <Card
      title="Yearly Breakup"
      className="w-full h-full p-3 dark:bg-slate-800"
    >
      <div className="flex justify-between items-center">
        <dl className="space-y-3">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</dt>
          <dd className="text-2xl font-light md:text-4xl dark:text-white">{data}</dd>
          <dd className="flex items-center space-x-1 text-sm font-medium text-lime-500 dark:text-lime-300">
            <span>{trending}</span>
            <ArrowUpLeft />
          </dd>
        </dl>
        <dl>
          <icon.icon
            size={72}
            stroke="#6e44ff"
          />
        </dl>
      </div>
    </Card>
  );
}
