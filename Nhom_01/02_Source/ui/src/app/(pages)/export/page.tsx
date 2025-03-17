"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticatedRoutes";

function ExportTimesheet() {
    return <div>This is my export timesheet page</div>;
}
export default AuthenticatedRoute(ExportTimesheet, []);
