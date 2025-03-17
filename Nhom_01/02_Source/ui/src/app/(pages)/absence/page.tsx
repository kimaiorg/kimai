"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticatedRoutes";

function Absence() {
    return <div>This is my Absence page</div>;
}
export default AuthenticatedRoute(Absence, []);
