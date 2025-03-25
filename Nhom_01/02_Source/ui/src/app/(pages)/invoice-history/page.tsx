"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function InvoiceHistory() {
  return <div>This is my Invoice History page</div>;
}
export default AuthenticatedRoute(InvoiceHistory, [Role.SUPER_ADMIN, Role.ADMIN]);
