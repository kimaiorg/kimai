"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticatedRoutes";

function Setting() {
    return <div>This is my Setting page</div>;
}
export default AuthenticatedRoute(Setting, []);
