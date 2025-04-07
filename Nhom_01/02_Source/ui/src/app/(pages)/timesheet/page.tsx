"use client";

import { endTimesheetRecord, getAllMyTimesheets } from "@/api/timesheet.api";
import { ManualTimesheetCreateDialog } from "@/app/(pages)/timesheet/manual-timesheet-create-dialog";
import { TimesheetCreateDialog } from "@/app/(pages)/timesheet/timesheet-create-dialog";
import TimesheetViewDialog from "@/app/(pages)/timesheet/timesheet-view-dialog";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { TimesheetTestType } from "@/type_schema/timesheet";
import { useUser } from "@auth0/nextjs-auth0/client";
import { format } from "date-fns";
import { Eye, FileDown, Filter, MoreHorizontal, Play, Plus, Search, Square, Trash2, Upload } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data for timesheets
const mockTimesheets: TimesheetTestType[] = [
  {
    id: "1",
    description: "Working on UI components",
    start_time: "2025-04-04T08:30:00",
    end_time: "2025-04-04T12:45:00",
    duration: 15300, // 4 hours, 15 minutes
    user_id: "user123",
    user_name: "John Doe",
    project_id: "Kimai Clone",
    activity_id: "Development",
    task_id: "UI-123",
    status: "stopped",
    created_at: "2025-04-04T08:30:00",
    deleted_at: "2025-04-04T08:30:00",
    updated_at: "2025-04-04T12:45:00"
  },
  {
    id: "2",
    description: "Demo ABC components",
    start_time: "2025-04-04T08:30:00",
    end_time: "2025-04-04T12:45:00",
    duration: 15300, // 4 hours, 15 minutes
    user_id: "user123",
    user_name: "John Doe",
    project_id: "Kimai Clone",
    activity_id: "Development",
    task_id: "UI-123",
    status: "stopped",
    created_at: "2025-04-04T08:30:00",
    deleted_at: "2025-04-04T08:30:00",
    updated_at: "2025-04-04T12:45:00"
  }
];

function Timesheet() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { user: currentUser } = useUser();
  // const dispatch = useAppDispatch();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const [timesheetList, setTimesheetList] = useState<Pagination<TimesheetTestType>>({
    data: [],
    metadata: {
      page: 1,
      limit: 5,
      totalPages: 1,
      total: 0
    }
  });

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
    const result = await getAllMyTimesheets(page, limit, keyword, sortBy, sortOrder);
    setTimesheetList(result);
  };

  const goToPage = (page: number) => {
    handleFetchTimesheets(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  // Handle ending a running timesheet
  const handleEndTimesheet = async () => {
    await endTimesheetRecord();
    await handleFetchTimesheets(1);
  };

  // Check if the current user has a running timesheet
  const hasRunningTimesheet = timesheetList.data.some(
    (timesheet) => timesheet.user_id === currentUser!.user_id && !timesheet.end_time
  );

  function handleStartingTracking(): void {
    handleFetchTimesheets(1);
  }

  useEffect(() => {
    handleFetchTimesheets(page, limit, keyword, sortBy, sortOrder);
  }, [page, limit, keyword, sortBy, sortOrder]);

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
              className="flex items-center bg-red-500 hover:bg-red-600"
            >
              <Square className="mr-2 h-4 w-4" /> Stop
            </Button>
          ) : (
            <TimesheetCreateDialog fetchTimesheets={handleStartingTracking}>
              <Button className="flex items-center bg-green-500 hover:bg-green-600">
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
            </TimesheetCreateDialog>
          )}
          <ManualTimesheetCreateDialog fetchTimesheets={() => handleFetchTimesheets(1)}>
            <Button className="flex items-center gap-2 cursor-pointer">
              Create <Plus />
            </Button>
          </ManualTimesheetCreateDialog>
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

      <div className="rounded-md border bg-white dark:bg-slate-900">
        <div className="rounded-md border border-gray-200 bg-white dark:bg-slate-700 my-5">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Task</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Activity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Project</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Start</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">End</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Duration</th>
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
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{timesheet.task_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="ml-2">{timesheet.activity_id}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{timesheet.project_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {format(timesheet.start_time, "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {timesheet.end_time ? format(timesheet.end_time, "dd/MM/yyyy HH:mm") : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{timesheet.duration}</td>
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

export default AuthenticatedRoute(Timesheet, [Role.SUPER_ADMIN, Role.ADMIN]);
