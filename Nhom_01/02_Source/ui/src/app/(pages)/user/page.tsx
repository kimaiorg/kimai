"use client";

import { callGettingUserListRequest } from "@/api/user.api";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import DefaultAvatar from "@/components/shared/default-avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { Role } from "@/type_schema/role";
import { UserType } from "@/type_schema/user.schema";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function User() {
    const queryParams = useSearchParams();
    const user = useAppSelector((state) => state.userState.user) as UserType;
    const [users, setUsers] = useState<UserType[]>([]);
    const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
    const size = queryParams.get("size") ? Number(queryParams.get("size")) : 10;
    useEffect(() => {
        const test = (a: any) => {
            console.log(a);
        };
        test("test");
        const getAllUsers = async () => {
            const result = await callGettingUserListRequest(page, size);
            if (result && !Object.prototype.hasOwnProperty.call(result, "errorCode")) {
                setUsers(result as UserType[]);
            }
        };
        getAllUsers();
    }, [page, size]);
    return (
        <>
            <div className="m-3 space-y-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">User</h1>
                    <div className="flex items-center space-x-2">
                        <Button className="btn btn-primary">
                            Create User <Plus />
                        </Button>
                    </div>
                </div>
                <Table className="bg-white rounded-lg shadow-md">
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No.</TableHead>
                            <TableHead>Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((userItem, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">
                                    <div className="w-7 h-7 rounded-full overflow-hidden">
                                        <DefaultAvatar
                                            name={userItem.username}
                                            size={30}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className="text-right">s</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </>
    );
}
export default AuthenticatedRoute(User, [Role.SUPER_ADMIN]);

// function ViewGameModal({ children, addNewUser }: { children: React.ReactNode; addNewUser: (user: UserType) => void }) {
//     return (
//         <Dialog>
//             <DialogTrigger asChild>{children}</DialogTrigger>
//             <DialogContent className="border border-gray-300 bg-gray-50 dark:bg-slate-800 overflow-y-auto py-3 rounded-lg w-[95vw]">
//                 <DialogHeader>
//                     <DialogTitle className="text-center text-2xl text-gradient">GAME INFO</DialogTitle>
//                 </DialogHeader>
//                 <div className="mt-0">
//                     <div className="grid grid-cols-1 gap-4">
//                         <div className="px-4 sm:px-8">
//                             <div className="flex flex-col w-full space-y-2">
//                                 <div className="text-md sm:text-xl lg:text-xl font-thin">
//                                     <b className="font-semibold w-[9rem] inline-block">Name:</b>
//                                 </div>
//                                 <div className="text-md sm:text-xl lg:text-xl font-thin">
//                                     <b className="font-semibold w-[9rem] inline-block">Guide:</b>
//                                 </div>

//                                 <div className="text-md sm:text-xl lg:text-xl font-thin">
//                                     <b className="font-semibold w-[9rem] inline-block">Game type:</b>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
