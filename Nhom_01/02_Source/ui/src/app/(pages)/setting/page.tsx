"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Setting() {
    return <div>This is my Setting page</div>;
}
export default AuthenticatedRoute(Setting, []);
