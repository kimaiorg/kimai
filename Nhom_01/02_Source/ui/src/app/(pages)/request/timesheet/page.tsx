"use client";

import { getRequestById } from "@/app/(pages)/request/request-items";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { RequestViewType } from "@/type_schema/request";

function TimesheetUpdateRequestPage() {
  const request: RequestViewType = getRequestById("timesheet")!;
  return <div>This is my timesheet update request page</div>;
}
export default AuthenticatedRoute(TimesheetUpdateRequestPage, []);
