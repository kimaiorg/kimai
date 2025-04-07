"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Clock3, Home, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function RequestPage() {
  const [absenceType, setAbsenceType] = useState<"holiday" | "timeoff" | "sickness" | "other">("holiday");

  const handleRequestClick = (type: "holiday" | "timeoff" | "sickness" | "other") => {
    setAbsenceType(type);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Request Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Off Card */}
        <Card className="overflow-hidden border border-gray-200">
          <div className="relative">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">Timesheet</CardTitle>
              <CardDescription className="text-blue-700">
                Your working time account has a balance of 30:05 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/request/timesheet">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">Request</Button>
              </Link>
            </CardContent>
            <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center opacity-10">
              <div className="bg-blue-200 rounded-full p-12">
                <Clock3
                  className="h-24 w-24 text-blue-600"
                  strokeWidth={1}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Sickness Card */}
        <Card className="overflow-hidden border border-gray-200">
          <div className="relative">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-800">Expense</CardTitle>
              <CardDescription className="text-amber-700">
                Estimate the task, activity and project expense.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/request/expense">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">Expense</Button>
              </Link>
            </CardContent>
            <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center opacity-10">
              <div className="bg-amber-200 rounded-full p-12">
                <Stethoscope
                  className="h-24 w-24 text-amber-600"
                  strokeWidth={1}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Other Card */}
        <Card className="overflow-hidden border border-gray-200">
          <div className="relative">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800">Other</CardTitle>
              <CardDescription className="text-purple-700">
                Family events, moving house, weather chaos etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                  onClick={() => handleRequestClick("other")}
                >
                  Report
                </Button>
              </div>
            </CardContent>
            <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center opacity-10">
              <div className="bg-purple-200 rounded-full p-12">
                <Home
                  className="h-24 w-24 text-purple-600"
                  strokeWidth={1}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AuthenticatedRoute(RequestPage, []);
