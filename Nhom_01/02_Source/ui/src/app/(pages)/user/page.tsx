"use client";

import { getAllUsers } from "@/api/user.api";
import AddUserModal from "@/app/(pages)/user/user-add-dialog";
import UserUpdateDialog from "@/app/(pages)/user/user-update-dialog";
import UserViewDialog from "@/app/(pages)/user/user-view-dialog";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import DefaultAvatar from "@/components/shared/default-avatar";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Role } from "@/type_schema/role";
import { UserListType } from "@/type_schema/user.schema";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Plus, SquarePen, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function User() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const [loadingData, setLoadingData] = useState(true);
  const [userList, setUserList] = useState<UserListType | null>(null);

  const fetchUser = async (page?: number, limit?: number, keyword?: string, sortBy?: string, sortOrder?: string) => {
    const result = await getAllUsers(page, limit, keyword, sortBy, sortOrder);
    goToPage(page || 1);
    setUserList(result);
  };

  const updateQueryParams = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setKeyword(`name:${value}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(queryParams);
    params.set("page", page.toString());
    updateQueryParams(params);
  };

  const handleReloadUser = () => {
    const params = new URLSearchParams(queryParams);
    params.set("page", "1");
    updateQueryParams(params);
  };

  useEffect(() => {
    const getUsers = async () => {
      await fetchUser(page, limit, keyword, sortBy, sortOrder);
      setLoadingData(false);
    };
    getUsers();
  }, [page, limit, keyword, sortBy, sortOrder]);

  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">User</h1>
          <div className="flex items-center space-x-2">
            <AddUserModal fetchUsers={() => fetchUser(1, limit)}>
              <Button className="btn btn-primary cursor-pointer">
                Create User <Plus />
              </Button>
            </AddUserModal>
          </div>
        </div>
        <Table className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200">
          {userList && (
            <TableCaption>
              <PaginationWithLinks
                page={page}
                pageSize={userList.limit}
                totalCount={userList.total}
                callback={goToPage}
              />
            </TableCaption>
          )}
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
          {loadingData && <TableSkeleton columns={6} />}
          <TableBody>
            {userList &&
              userList.users.map((userItem, index) => (
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
                  <TableCell>{format(userItem.created_at, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                  <TableCell className="cursor-pointer">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border border-gray-200"
                      >
                        <UserViewDialog user={userItem}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </UserViewDialog>
                        <UserUpdateDialog
                          targetUser={userItem}
                          fetchUsers={() => fetchUser(1, limit)}
                        >
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <SquarePen size={14} /> Edit
                          </div>
                        </UserUpdateDialog>
                        <div className="text-red-500 flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                          <Trash2
                            size={14}
                            stroke="red"
                          />{" "}
                          Delete
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
