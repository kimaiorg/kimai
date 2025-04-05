"use client";

import { getAllTeams } from "@/api/team.api";
import { getAllUsers } from "@/api/user.api";
import { CreateTeamModal } from "@/app/(pages)/team/create-team-modal";
import { MemberHoverCard } from "@/app/(pages)/team/member-hover-card";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import DefaultAvatar from "@/components/shared/default-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch } from "@/lib/redux-toolkit/hooks";
import { getUserById, updateUserList } from "@/lib/redux-toolkit/slices/list-user-slice";
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { TeamType, UserTeamType } from "@/type_schema/team";
import { UserType } from "@/type_schema/user.schema";
import { Filter, LayoutGrid, MoreHorizontal, Plus, Search } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Team() {
  const queryParams = useSearchParams();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc");
  const [teamList, setTeamList] = useState<Pagination<UserTeamType>>({
    metadata: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    data: []
  });
  const [userList, setUserList] = useState<UserType[]>([]);

  const updateQueryParams = (param: string, value: string) => {
    const params = new URLSearchParams(queryParams);
    params.set(param, value);
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleFetchAllUser = async () => {
    try {
      const data = await getAllUsers();
      setUserList(data.users);
      dispatch(updateUserList(data.users));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFetchTeams = async (page: number, limit: number, keyword: string, sortBy: string, sortOrder: string) => {
    try {
      const data = await getAllTeams(page, limit, keyword, sortBy, sortOrder);
      console.log(data);
      const body = data.data.map((team) => {});
      // const teams: TeamType[] = [];
      // for (let i = 0; i < data.data.length; i++) {
      //   const team = data.data[i];
      //   const members: UserTeamType[] = team.users.map((member) => {
      //     const user = getUserById(member);
      //     // const isTeamLead = user?.user_id === team.lead;
      //     return { ...user!, isTeamLead: true, color: "#ededed" };
      //   });
      //   teams.push({ data: members, metadata: data.metadata });
      // }
      // const currentTeamList: Pagination<TeamType> = {
      //   metadata: data.metadata,
      //   data: teams
      // };
      // setTeamList(currentTeamList);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  // Fetch teams on component mount
  useEffect(() => {
    handleFetchAllUser();
    handleFetchTeams(page, limit, keyword, sortBy, sortOrder);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);
    setSortBy(sortBy);
    setSortOrder("");
    updateQueryParams("keyword", keyword);
  };

  const goToPage = (page: number) => {
    handleFetchTeams(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  const handleReloadProjects = () => {
    handleFetchTeams(1, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", "1");
  };

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 cursor-pointer border border-gray-200"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 flex items-center gap-1 border border-gray-200 cursor-pointer"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>All Teams</DropdownMenuItem>
                  <DropdownMenuItem>My Teams</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Active Teams</DropdownMenuItem>
                  <DropdownMenuItem>Archived Teams</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search"
                className="h-10 w-[200px] sm:w-[300px] pl-3 pr-10 bg-white dark:bg-slate-700 dark:text-white border border-gray-200"
              />
              <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <CreateTeamModal refetchTeams={handleReloadProjects}>
            <Button className="flex items-center justify-center gap-2 text-white bg-lime-500 rounded-md hover:bg-lime-600 transition cursor-pointer">
              Create <Plus />
            </Button>
          </CreateTeamModal>
        </div>

        <Table className="bg-white dark:bg-slate-700 border border-gray-200 rounded-md">
          <TableCaption>
            <PaginationWithLinks
              page={teamList.metadata.page}
              pageSize={teamList.metadata.limit}
              totalCount={teamList.metadata.total}
              callback={goToPage}
            />
          </TableCaption>
          <TableHeader className="bg-gray-100 dark:bg-slate-800 border border-gray-200">
            <TableRow className="rounded-lg">
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Member</TableHead>
              <TableHead className="w-[4rem]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamList.data.map((team, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: team.color || "#FF5733" }}
                    ></div>
                    <span className="font-medium">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2 mr-4">
                      {/* {team.users.map((member, idx) => (
                        <MemberHoverCard
                          member={member}
                          key={idx}
                        >
                          <div
                            className={`flex items-center justify-center h-9 w-9 cursor-pointer hover:ring-indigo-600 hover:ring-2 rounded-full`}
                          >
                            {member.picture ? (
                              <Image
                                src={member.picture}
                                alt={member.name}
                                width={36}
                                height={36}
                                className="rounded-full"
                                priority
                              />
                            ) : (
                              <DefaultAvatar
                                name={member.name}
                                size={35}
                                className="border-gray-200"
                                index={idx}
                              />
                            )}
                          </div>
                        </MemberHoverCard>
                      ))} */}
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    alert("This feature is coming soon");
                  }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Team</DropdownMenuItem>
                      <DropdownMenuItem>Manage Members</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete Team</DropdownMenuItem>
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

export default AuthenticatedRoute(Team, [Role.SUPER_ADMIN, Role.ADMIN]);
