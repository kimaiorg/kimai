"use client";

import { getAllActivities } from "@/api/activity.api";
import { ActivityCreateDialog } from "@/app/(pages)/activity/activity-create-dialog";
import { ActivityUpdateDialog } from "@/app/(pages)/activity/activity-update-dialog";
import ActivityViewDialog from "@/app/(pages)/activity/activity-view-dialog";
import FilterActivityModal from "@/app/(pages)/activity/filter-modal";
import Loading from "@/app/loading";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { ActivityType } from "@/type_schema/activity";
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { Eye, FileDown, Filter, MoreHorizontal, Plus, Search, SquarePen, Trash2, Upload } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Activity() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const projectId = queryParams.get("projectId") || "";
  const teamId = queryParams.get("teamId") || "";
  const budgetFrom = queryParams.get("budgetFrom") || "";
  const budgetTo = queryParams.get("budgetTo") || "";
  const [activityList, setActivityList] = useState<Pagination<ActivityType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchActivities = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string,
    projectId?: string,
    teamId?: string,
    budgetFrom?: string,
    budgetTo?: string
  ) => {
    try {
      const data = await getAllActivities(
        page,
        limit,
        keyword,
        sortBy,
        sortOrder,
        projectId,
        teamId,
        budgetFrom,
        budgetTo
      );
      console.log(data);
      setActivityList(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Fetch Tasks on component mount
  useEffect(() => {
    setIsLoading(true);
    handleFetchActivities(page, limit, keyword, sortBy, sortOrder, projectId, teamId, budgetFrom, budgetTo);
    setIsLoading(false);
  }, [page, limit, keyword, sortBy, sortOrder, projectId, teamId, budgetFrom, budgetTo]);

  const updateUrl = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const updateQueryParams = (param: string, value: string) => {
    const params = new URLSearchParams(queryParams);
    params.set(param, value);
    updateUrl(params);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);
    updateQueryParams("keyword", keyword);
  };

  const handleFilterChange = (props: any) => {
    const params = new URLSearchParams();
    const { _keyword, _sortBy, _sortOrder, _projectId, _teamId, _budgetFrom, _budgetTo } = props;
    params.set("page", "1"); // Reset to first page when applying filters
    if (_sortBy) params.set("sortBy", _sortBy);
    if (_sortOrder) params.set("sortOrder", _sortOrder);
    if (_projectId) params.set("projectId", _projectId);
    if (_teamId) params.set("teamId", _teamId);
    if (_budgetFrom) params.set("budgetFrom", _budgetFrom);
    if (_budgetTo) params.set("budgetTo", _budgetTo);
    if (_keyword) params.set("keyword", _keyword);
    updateUrl(params);
  };

  const goToPage = (page: number) => {
    handleFetchActivities(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity</h1>
        <div className="flex items-center space-x-2">
          <div className="relative block md:hidden">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] bg-white dark:bg-slate-700 border border-gray-200"
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
          <FilterActivityModal
            handleFilterChangeAction={handleFilterChange}
            keyword={keyword}
            sortBy={sortBy}
            sortOrder={sortOrder}
            projectId={projectId}
            teamId={teamId}
            budgetFrom={budgetFrom}
            budgetTo={budgetTo}
          >
            <Button
              variant="outline"
              size="icon"
              className="flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </FilterActivityModal>
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
          {!activityList && <TableSkeleton />}
          <tbody>
            {activityList && activityList.data.length === 0 && (
              <tr className="h-48 text-center">
                <td
                  colSpan={6}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  No activities found.
                </td>
              </tr>
            )}
            {activityList &&
              activityList.data.map((activity, index) => (
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
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.project.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.team.name}</td>
                  <td className="px-4 py-2 text-center">
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
                        <ActivityViewDialog activity={activity}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </ActivityViewDialog>
                        <ActivityUpdateDialog
                          targetActivity={activity}
                          fetchActivities={handleFetchActivities}
                        >
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <SquarePen size={14} /> Edit
                          </div>
                        </ActivityUpdateDialog>
                        <div className="text-red-500 flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                          <Trash2
                            size={14}
                            stroke="red"
                          />{" "}
                          Delete
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {activityList && (
        <PaginationWithLinks
          page={activityList.metadata.page}
          pageSize={activityList.metadata.limit}
          totalCount={activityList.metadata.total}
          callback={goToPage}
        />
      )}
    </>
  );
}
export default AuthenticatedRoute(Activity, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
