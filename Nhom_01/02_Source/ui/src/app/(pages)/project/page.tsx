"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticatedRoutes";
import { Role } from "@/type_schema/role";

function Project() {
    return <div>This is my project page</div>;
}
export default AuthenticatedRoute(Project, [Role.SUPER_ADMIN, Role.ADMIN]);
