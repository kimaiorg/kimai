"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function Category() {
    return <div>This is my Category page</div>;
}
export default AuthenticatedRoute(Category, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
