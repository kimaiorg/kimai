"use client";

import DataCard from "@/app/(pages)/dashboard/data-card";
import { TimesheetChart } from "@/app/(pages)/dashboard/timesheet-chart";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Clock, Clock1, PartyPopper, UserPlus2 } from "lucide-react";

function Dashboard() {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      <div className="mx-10 pt-5">
        <TimesheetChart />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
        <DataCard
          title="Today"
          data={2}
          trending={2}
          icon={{ icon: PartyPopper }}
        />
        <DataCard
          title="This week"
          data={36}
          trending={12}
          icon={{ icon: Clock }}
        />
        <DataCard
          title="This year"
          data={1503}
          trending={234}
          icon={{ icon: Clock1 }}
        />
      </div>
    </div>
  );
}
export default AuthenticatedRoute(Dashboard, []);
