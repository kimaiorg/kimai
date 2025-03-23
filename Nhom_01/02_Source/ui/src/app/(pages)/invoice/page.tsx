"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function CreateInvoice() {
    return <div>This is my CreateInvoice page</div>;
}
export default AuthenticatedRoute(CreateInvoice, [Role.SUPER_ADMIN, Role.ADMIN]);
