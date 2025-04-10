"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllProjects } from "@/api/project.api";
import { getAllTasks } from "@/api/task.api";
import { endTimesheetRecord, getAllMyTimesheets } from "@/api/timesheet.api";
import { TimesheetCreateDialog } from "@/app/(pages)/timesheet/timesheet-create-dialog";
import TimesheetViewDialog from "@/app/(pages)/timesheet/timesheet-view-dialog";
import Loading from "@/app/loading";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { secondsToTime } from "@/lib/utils";
import { Pagination } from "@/type_schema/common";
import { TimesheetType } from "@/type_schema/timesheet";
import { UserType } from "@/type_schema/user.schema";
import { useUser } from "@auth0/nextjs-auth0/client";
import { format } from "date-fns";
import { Eye, FileDown, Filter, MoreHorizontal, Play, Search, Square, Trash2, Upload } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Timesheet() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { user: currentUser } = useUser();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];
  const [loadingPage, setLoadingPage] = useState(false);
  const [trackingTime, setTrackingTime] = useState("");

  const [timesheetList, setTimesheetList] = useState<Pagination<TimesheetType>>({
    data: [],
    metadata: {
      page: 1,
      limit: 5,
      totalPages: 1,
      total: 0
    }
  });
  console.log(currentUser);

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
    updateQueryParams("keyword", keyword);
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
    const result = await getAllMyTimesheets(page, limit, keyword, sortBy, sortOrder);
    const { data, metadata } = result;
    const timesheets: TimesheetType[] = data.map((timesheet) => {
      const { user_id, project_id, activity_id, task_id, ...rest } = timesheet;
      return {
        ...rest,
        status: timesheet.status as "running" | "stopped",
        user: userList.find((user) => user.user_id === user_id)!,
        project: projects.data.find((project) => project.id === project_id)!,
        activity: activities.data.find((activity) => activity.id === activity_id)!,
        task: tasks.data.find((task) => task.id === task_id)!
      };
    });
    setTimesheetList({
      data: timesheets,
      metadata
    });
    setLoadingPage(false);
  };

  const goToPage = (page: number) => {
    handleFetchTimesheets(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  // Handle ending a running timesheet
  const handleEndTimesheet = async () => {
    const result = await endTimesheetRecord();
    if (result == 201 || result == 200) {
      toast("End tracking", {
        duration: 2000,
        className: "!bg-lime-500 !text-white",
        description: "Timesheet ended successfully"
      });
      await handleFetchTimesheets(1, limit);
    } else {
      toast("Error", {
        duration: 2000,
        className: "!bg-red-500 !text-white",
        description: "Error ending timesheet"
      });
    }
  };

  // Check if the current user has a running timesheet
  const hasRunningTimesheet = timesheetList.data.find(
    (timesheet) =>
      timesheet?.user?.user_id === currentUser!.sub && !timesheet?.end_time && timesheet?.status === "running"
  );

  function handleStartingTracking(): void {
    handleFetchTimesheets(1);
  }

  useEffect(() => {
    handleFetchTimesheets(page, limit, keyword, sortBy, sortOrder);
    // const hasRunningTimesheet = timesheetList.data.find(
    //    (timesheet) => timesheet?.user?.user_id === currentUser!.sub && !timesheet?.end_time &&
    //       timesheet?.status === "running"
    // )!;
    // if (hasRunningTimesheet) {
    //   const timeStr = secondsToTime(new Date().getTime() - new Date(hasRunningTimesheet.duration).getTime());
    //   setTrackingTime(timeStr);
    // }
  }, [page, limit, keyword, sortBy, sortOrder]);

  if (loadingPage) return <Loading />;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Timesheets</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px]"
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
          {hasRunningTimesheet ? (
            <Button
              onClick={handleEndTimesheet}
              className="flex items-center bg-red-500 hover:bg-red-600 cursor-pointer text-white"
            >
              <Square className="mr-2 h-4 w-4" /> {secondsToTime(hasRunningTimesheet.duration)}
            </Button>
          ) : (
            <TimesheetCreateDialog fetchTimesheets={handleStartingTracking}>
              <Button className="flex items-center bg-green-500 hover:bg-green-600 cursor-pointer text-white">
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
            </TimesheetCreateDialog>
          )}
          {/* <ManualTimesheetCreateDialog fetchTimesheets={() => handleFetchTimesheets(1)}>
            <Button className="flex items-center gap-2 cursor-pointer">
              Create <Plus />
            </Button>
          </ManualTimesheetCreateDialog> */}
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

      <div className="space-y-4">
        <div className="rounded-md border border-gray-200 bg-white dark:bg-slate-700">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Task</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Start</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">End</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {timesheetList.data.length === 0 && (
                <tr className="h-48 text-center">
                  <td
                    colSpan={7}
                    className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
              {timesheetList.data.map((timesheet, index) => (
                <tr
                  key={index}
                  className={`border-t dark:border-slate-700 `}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{timesheet.task?.title}</td>

                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {format(timesheet.start_time, "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {timesheet.end_time ? format(timesheet.end_time, "dd/MM/yyyy HH:mm") : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {secondsToTime(timesheet.duration)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{timesheet.status}</td>

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
                        <TimesheetViewDialog timesheet={timesheet}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </TimesheetViewDialog>
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
        <PaginationWithLinks
          page={timesheetList.metadata.page}
          pageSize={timesheetList.metadata.limit}
          totalCount={timesheetList.metadata.total}
          callback={goToPage}
        />
      </div>
    </>
  );
}

export default AuthenticatedRoute(Timesheet, []);
