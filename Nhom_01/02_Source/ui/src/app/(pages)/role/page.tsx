"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticatedRoutes";
import { Role } from "@/type_schema/role";

function RolePage() {
    // const [roles, setRoles] = useState<RoleType[]>([]);
    // useEffect(() => {
    //     const getRoleAndPermission = async () => {
    //         const result = await callGettingRoleAndPermissionRequest();
    //         if (result && !result.hasOwnProperty("errorCode")) {
    //             setRoles(result as RoleType[]);
    //         }
    //     };
    //     getRoleAndPermission();
    // }, []);
    return <div>This is my Role page</div>;
}
export default AuthenticatedRoute(RolePage, [Role.SUPER_ADMIN]);
