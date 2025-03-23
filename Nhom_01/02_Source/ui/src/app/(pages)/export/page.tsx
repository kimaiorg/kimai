"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function ExportTimesheet() {
    return <div>This is my export timesheet page</div>;
}
export default AuthenticatedRoute(ExportTimesheet, []);
