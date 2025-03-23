"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function Customer() {
    return <div>This is my Customer page</div>;
}
export default AuthenticatedRoute(Customer, [Role.SUPER_ADMIN, Role.ADMIN]);
