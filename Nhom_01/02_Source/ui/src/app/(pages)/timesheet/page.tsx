"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Timesheet() {
  return <div>This is my timesheet page</div>;
}
export default AuthenticatedRoute(Timesheet, []);
