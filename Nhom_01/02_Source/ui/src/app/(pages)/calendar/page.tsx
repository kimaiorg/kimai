"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Calendar() {
  return <div>This is my timesheet view in Calendar</div>;
}
export default AuthenticatedRoute(Calendar, []);
