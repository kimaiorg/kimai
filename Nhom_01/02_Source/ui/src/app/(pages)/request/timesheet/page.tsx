"use client";

import { getRequestById } from "@/app/(pages)/request/request-items";
import { RequestUpdateType, RequestViewType } from "@/type_schema/request";

import { getAllActivities } from "@/api/activity.api";
import { getAllProjects } from "@/api/project.api";
import { getAllTasks } from "@/api/task.api";
import { getAllMyTimesheetUpdateRequests } from "@/api/timesheet.api";
import FilterTimesheetV2Modal from "@/app/(pages)/request/timesheet/timesheet-filter-modal";
import TimesheetRequestDialog from "@/app/(pages)/request/timesheet/timesheet-request-dialog";
import { AuthenticatedRoute, hasRole } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { Pagination } from "@/type_schema/common";
import { ApprovalStatus } from "@/type_schema/request";
import { Role, RolePermissionType } from "@/type_schema/role";
import { TimesheetType, TimesheetUpdateRequestType } from "@/type_schema/timesheet";
import { UserType } from "@/type_schema/user.schema";
import { useUser } from "@auth0/nextjs-auth0/client";
import { format, formatDistanceToNow } from "date-fns";
import debounce from "debounce";
import { Filter, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function TimesheetUpdateRequestPage() {
  const requestType: RequestViewType = getRequestById("timesheet")!;
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const targetId = sessionStorage.getItem("timesheetId");
  // const targetId = queryParams.get("timesheetId") || null;
  const { user: currentUser } = useUser();
  const userRolePermissions = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
  const allowRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD];

  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const searchKeyword = queryParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const teamId = queryParams.get("teamId") || "";
  const userId = queryParams.get("userId") || "";
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];
  const [timesheetUpdateList, setTimesheetUpdateList] = useState<Pagination<
    RequestUpdateType<TimesheetType, TimesheetUpdateRequestType>
  > | null>(null);

  const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isDialogClicked = useRef<boolean>(false);

  const updateQueryParams = (param: string, value: string) => {
    const params = new URLSearchParams(queryParams);
    params.set(param, value);
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  // Handle search input change
  const handleUpdateKeyword = (keyword: string) => {
    updateQueryParams("keyword", keyword);
  };
  const debounceSearchKeyword = useCallback(debounce(handleUpdateKeyword, 1000), []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);
    debounceSearchKeyword(keyword);
  };

  const handleFetchTimesheets = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    // Start all fetch requests concurrently
    const [projects, activities, tasks] = await Promise.all([getAllProjects(), getAllActivities(), getAllTasks()]);
    const result = await getAllMyTimesheetUpdateRequests(page, limit, keyword, sortBy, sortOrder, teamId, userId);
    const { data, metadata } = result;
    const filteredData = hasRole(userRolePermissions.role, allowRoles)
      ? data
      : data.filter((timesheetData) => timesheetData.user_id === currentUser?.sub);
    const timesheets: RequestUpdateType<TimesheetType, TimesheetUpdateRequestType>[] = filteredData.map(
      (timesheetUpdate) => {
        const { previous_data, ...rest } = timesheetUpdate;
        const { user_id, project_id, activity_id, task_id, ...restTimesheet } = previous_data;
        return {
          ...rest,
          previous_data: {
            ...restTimesheet,
            status: previous_data.status,
            user: userList.find((user) => user.user_id === user_id)!,
            project: projects.data.find((project) => project.id === project_id)!,
            activity: activities.data.find((activity) => activity.id === activity_id)!,
            task: tasks.data.find((task) => task.id === task_id)!
          }
        };
      }
    );
    // .filter((timesheet) => timesheet.user.user_id === currentUser?.sub);
    setTimesheetUpdateList({
      data: timesheets,
      metadata
    });
  };

  const goToPage = (page: number) => {
    handleFetchTimesheets(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  useEffect(() => {
    handleFetchTimesheets(page, limit, searchKeyword, sortBy, sortOrder);
  }, [page, limit, searchKeyword, sortBy, sortOrder]);

  const updateUrl = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleFilterChange = (props: any) => {
    const params = new URLSearchParams();
    const { _sortBy, _sortOrder, _projectId, _activityId, _taskId, _userId, _status, _fromDate, _toDate } = props;
    params.set("page", "1"); // Reset to first page when applying filters
    if (_sortBy) params.set("sortBy", _sortBy);
    if (_sortOrder) params.set("sortOrder", _sortOrder);
    if (_projectId) params.set("projectId", _projectId);
    if (_activityId) params.set("activityId", _activityId);
    if (_taskId) params.set("taskId", _taskId);
    if (_userId) params.set("userId", _userId);
    if (_status) params.set("status", _status);
    if (_fromDate) params.set("fromDate", _fromDate);
    if (_toDate) params.set("toDate", _toDate);
    updateUrl(params);
  };

  useEffect(() => {
    if (isDialogClicked.current) return;
    if (!targetId || !timesheetUpdateList) return;
    if (timesheetUpdateList.data.length === 0) return;
    if (refs.current[targetId]) {
      refs.current[targetId].click();
      isDialogClicked.current = true;
      sessionStorage.removeItem("timesheetId");
    }
  }, [targetId, timesheetUpdateList]);

  const getTimesheetApprovalStatusBadge = (status?: string) => {
    if (!status || status === "") {
      return (
        <Badge
          variant="outline"
          className="bg-gray-500 text-white"
        >
          N/A
        </Badge>
      );
    }
    switch (status) {
      case ApprovalStatus.APPROVED:
        return (
          <Badge
            variant="outline"
            className="bg-green-500 text-green-50"
          >
            Confirmed
          </Badge>
        );
      case ApprovalStatus.PROCESSING:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500 text-white"
          >
            Processing
          </Badge>
        );
      case ApprovalStatus.REJECTED:
        return (
          <Badge
            variant="outline"
            className="bg-rose-500 text-yellow-50"
          >
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-500 text-gray-50"
          >
            N/A
          </Badge>
        );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{requestType.title}</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] border border-gray-200 bg-white dark:bg-slate-700"
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
          <FilterTimesheetV2Modal
            handleFilterChangeAction={handleFilterChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            teamId={teamId}
            userId={userId}
          >
            <Button
              variant="outline"
              size="icon"
              className="flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </FilterTimesheetV2Modal>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border border-gray-200 bg-white dark:bg-slate-700">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Requester</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Task</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Start</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requested At
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            {!timesheetUpdateList && <TableSkeleton columns={5} />}
            <tbody>
              {timesheetUpdateList && timesheetUpdateList.data.length === 0 && (
                <tr className="h-48 text-center">
                  <td
                    colSpan={7}
                    className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No timesheet requests found.
                  </td>
                </tr>
              )}
              {timesheetUpdateList &&
                timesheetUpdateList.data.map((timesheetUpdate, index) => (
                  <TimesheetRequestDialog
                    key={index}
                    targetTimesheetUpdate={timesheetUpdate}
                    fetchTimesheetUpdates={handleFetchTimesheets}
                  >
                    <tr
                      className={`border-t dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800`}
                      ref={(el) => {
                        refs.current[timesheetUpdate!.id!] = el;
                      }}
                    >
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {timesheetUpdate.previous_data.user.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {timesheetUpdate.previous_data.task?.title}
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {format(timesheetUpdate.previous_data.start_time, "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {formatDistanceToNow(timesheetUpdate.created_at, { addSuffix: true })}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                        <Link href={`/request`}>{getTimesheetApprovalStatusBadge(timesheetUpdate.status)}</Link>
                      </td>
                    </tr>
                  </TimesheetRequestDialog>
                ))}
            </tbody>
          </table>
        </div>
        {timesheetUpdateList && (
          <PaginationWithLinks
            page={timesheetUpdateList.metadata.page}
            pageSize={timesheetUpdateList.metadata.limit}
            totalCount={timesheetUpdateList.metadata.total}
            callback={goToPage}
          />
        )}
      </div>
    </>
  );
}

export default AuthenticatedRoute(TimesheetUpdateRequestPage, []);
