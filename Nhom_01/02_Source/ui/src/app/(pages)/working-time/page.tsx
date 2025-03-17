"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticatedRoutes";

function WorkingTime() {
    return <div>This is my working time page</div>;
}
export default AuthenticatedRoute(WorkingTime, []);
