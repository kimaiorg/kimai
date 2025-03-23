"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Reporting() {
    return <div>This is my Reporting page</div>;
}
export default AuthenticatedRoute(Reporting, []);
