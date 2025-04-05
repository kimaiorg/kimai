"use client";

import { getAllActivities } from "@/api/activity.api";
import { ActivityCreateDialog } from "@/app/(pages)/activity/activity-create-dialog";
import Loading from "@/app/loading";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
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
import { ActivityType } from "@/type_schema/activity";
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { FileDown, Filter, MoreHorizontal, Plus, Search, Upload } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Activity() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc");
  const [activityList, setActivityList] = useState<Pagination<ActivityType>>({
    metadata: {
      page: 1,
      limit: 5,
      totalPages: 1,
      total: 0
    },
    data: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchActivities = async (
    page: number,
    size: number,
    keyword: string,
    sortBy: string,
    sortOrder: string
  ) => {
    try {
      const data = await getAllActivities(page, size, keyword, sortBy, sortOrder);
      console.log(data);
      setActivityList(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Fetch Tasks on component mount
  useEffect(() => {
    setIsLoading(true);
    handleFetchActivities(page, limit, keyword, sortBy, sortOrder);
    setIsLoading(false);
  }, []);

  const updateQueryParams = (param: string, value: string) => {
    const params = new URLSearchParams(queryParams);
    params.set(param, value);
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);
    setSortBy(sortBy);
    setSortOrder("");
    updateQueryParams("keyword", keyword);
  };

  const goToPage = (page: number) => {
    handleFetchActivities(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] bg-white dark:bg-slate-700 border border-gray-200"
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <ActivityCreateDialog fetchActivities={() => handleFetchActivities(1, limit, keyword, sortBy, sortOrder)}>
            <Button className="flex items-center justify-center gap-2 cursor-pointer">
              Create <Plus />
            </Button>
          </ActivityCreateDialog>
          <Button
            variant="outline"
            size="icon"
          >
            <FileDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 my-5">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Budget</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Project</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Team</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {activityList.data.length === 0 && (
              <tr className="h-48 text-center">
                <td
                  colSpan={6}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  No activities found.
                </td>
              </tr>
            )}
            {activityList.data.map((activity, index) => (
              <tr
                key={index}
                className={`border-t dark:border-slate-700 `}
              >
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: activity.color || "#FF5733" }}
                    ></div>
                    <span className="ml-2">{activity.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.budget}</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.project_id}</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.team_id}</td>
                <td className="px-4 py-2 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Show</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationWithLinks
        page={activityList.metadata.page}
        pageSize={activityList.metadata.limit}
        totalCount={activityList.metadata.total}
        callback={goToPage}
      />
    </div>
  );
}
export default AuthenticatedRoute(Activity, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
