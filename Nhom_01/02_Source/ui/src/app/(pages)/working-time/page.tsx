"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function WorkingTime() {
    return <div>This is my working time page</div>;
}
export default AuthenticatedRoute(WorkingTime, []);
