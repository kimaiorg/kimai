"use client";

import { getAllUsers } from "@/api/user.api";
import AddUserModal from "@/app/(pages)/user/add-user-modal";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import DefaultAvatar from "@/components/shared/default-avatar";
import { Button } from "@/components/ui/button";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Role } from "@/type_schema/role";
import { UserListType } from "@/type_schema/user.schema";
import { Plus, SquarePen } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function User() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const [userList, setUserList] = useState<UserListType>({
    start: 1,
    limit: 10,
    length: 0,
    total: 0,
    users: []
  });

  const fetchUser = async (page: number, size: number = 2) => {
    const result = await getAllUsers(page, size);
    setUserList(result);
  };

  const goToPage = (page: number) => {
    fetchUser(page);
    const params = new URLSearchParams(queryParams);
    params.set("page", page.toString());
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleReloadUser = () => {
    fetchUser(1);
    const params = new URLSearchParams(queryParams);
    params.set("page", "1");
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  useEffect(() => {
    const getUsers = async () => {
      await fetchUser(page);
    };
    getUsers();
  }, []);

  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">User</h1>
          <div className="flex items-center space-x-2">
            <AddUserModal fetchUsers={handleReloadUser}>
              <Button className="btn btn-primary cursor-pointer">
                Create User <Plus />
              </Button>
            </AddUserModal>
          </div>
        </div>
        <Table className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <TableCaption>
            <PaginationWithLinks
              page={page}
              pageSize={userList.limit}
              totalCount={userList.total}
              callback={goToPage}
            />
          </TableCaption>
          <TableHeader className="bg-gray-100 dark:bg-slate-900">
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.users.map((userItem, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="w-7 h-7 rounded-full overflow-hidden">
                    <DefaultAvatar
                      name={userItem.name}
                      size={30}
                    />
                  </div>
                </TableCell>
                <TableCell>{userItem.name}</TableCell>
                <TableCell>{userItem.email}</TableCell>
                <TableCell>{userItem.created_at}</TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    alert("This feature is coming soon");
                  }}
                >
                  <SquarePen />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
export default AuthenticatedRoute(User, [Role.SUPER_ADMIN]);
