"use client";

import { getAllTasks } from "@/api/task.api";
import FilterTaskModal from "@/app/(pages)/task/filter-modal";
import { TaskConfirmDialog } from "@/app/(pages)/task/task-confirm-dialog";
import { TaskCreateDialog } from "@/app/(pages)/task/task-create-dialog";
import { TaskUpdateDialog } from "@/app/(pages)/task/task-update-dialog";
import { TaskUpdateExpenseRequestDialog } from "@/app/(pages)/task/task-update-expense-request-dialog";
import TaskViewDialog from "@/app/(pages)/task/task-view-dialog";
import { AuthenticatedRoute, hasRole } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { Pagination } from "@/type_schema/common";
import { ApprovalStatus } from "@/type_schema/request";
import { Role, RolePermissionType } from "@/type_schema/role";
import { TaskStatus, TaskType } from "@/type_schema/task";
import { UserType } from "@/type_schema/user.schema";
import { useUser } from "@auth0/nextjs-auth0/client";
import { format } from "date-fns";
import debounce from "debounce";
import {
  CircleCheckBig,
  CircleDollarSign,
  Eye,
  FileDown,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SquarePen,
  Trash2,
  Upload
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function Task() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const userList: UserType[] = useAppSelector((state) => state.userListState.users) as UserType[];
  const { user: currentUser } = useUser();
  const userRolePermissions = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
  const allowRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD];

  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const searchKeyword = queryParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const activityId = queryParams.get("activityId") || "";
  const userId = queryParams.get("userId") || "";
  const [taskList, setTaskList] = useState<Pagination<TaskType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchTasks = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      let finalResult = null;
      if (hasRole(userRolePermissions.role, allowRoles)) {
        finalResult = await getAllTasks(page, limit, keyword, sortBy, sortOrder, activityId, userId);
      } else {
        finalResult = await getAllTasks(page, limit, keyword, sortBy, sortOrder, activityId, currentUser!.sub!);
      }
      const { data, metadata } = finalResult;
      console.log(data);
      const taskData = data.map((task) => {
        const { user_id, ...rest } = task;
        return {
          ...rest,
          user: userList.find((user) => user.user_id === user_id)!
        };
      });

      setTaskList({
        metadata: metadata,
        data: taskData
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch Tasks on component mount
  useEffect(() => {
    const fetchNecessaryData = async () => {
      setIsLoading(true);
      await handleFetchTasks(page, limit, searchKeyword, sortBy, sortOrder);
      setIsLoading(false);
    };
    fetchNecessaryData();
  }, [page, limit, searchKeyword, sortBy, sortOrder]);

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

  const goToPage = (page: number) => {
    handleFetchTasks(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  const updateUrl = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleFilterChange = (props: any) => {
    const params = new URLSearchParams();
    const { _keyword, _sortBy, _sortOrder, _activityId, _userId, _budgetFrom, _budgetTo } = props;
    params.set("page", "1"); // Reset to first page when applying filters
    if (_sortBy) params.set("sortBy", _sortBy);
    if (_sortOrder) params.set("sortOrder", _sortOrder);
    if (_activityId) params.set("activityId", _activityId);
    if (_userId) params.set("userId", _userId);
    if (_budgetFrom) params.set("budgetFrom", _budgetFrom);
    if (_budgetTo) params.set("budgetTo", _budgetTo);
    if (_keyword) params.set("keyword", _keyword);
    updateUrl(params);
  };

  const getTaskStatusBadge = (status?: string) => {
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
      case TaskStatus.DONE:
        return (
          <Badge
            variant="outline"
            className="bg-green-500 text-green-50"
          >
            Done
          </Badge>
        );
      case TaskStatus.DOING:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500 text-yellow-50"
          >
            Doing
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
            className="bg-main text-white"
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
        <h1 className="text-2xl font-bold">Tasks</h1>
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
          <FilterTaskModal
            handleFilterChangeAction={handleFilterChange}
            keyword={keyword}
            sortBy={sortBy}
            sortOrder={sortOrder}
            activityId={activityId}
            userId={userId}
          >
            <Button
              variant="outline"
              size="icon"
              className="flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </FilterTaskModal>
          {hasRole(userRolePermissions.role, allowRoles) && (
            <TaskCreateDialog fetchTasks={() => handleFetchTasks(1, limit, keyword, sortBy, sortOrder)}>
              <Button className="flex items-center justify-center bg-main gap-2 cursor-pointer text-white">
                Create <Plus />
              </Button>
            </TaskCreateDialog>
          )}
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

      <div className="rounded-md border border-gray-200 bg-white dark:bg-slate-700 my-5">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">No.</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Activity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Due date</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                Approval Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          {isLoading && <TableSkeleton columns={8} />}
          <tbody>
            {taskList && taskList.data.length === 0 && (
              <tr className="h-48 text-center">
                <td
                  colSpan={6}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  No tasks found.
                </td>
              </tr>
            )}
            {taskList &&
              taskList.data.map((task, index) => (
                <tr
                  key={index}
                  className={`border-t dark:border-slate-700 `}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: task.color || "#6C757D" }}
                      ></div>
                      <span className="ml-2">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.activity.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.user?.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {format(task.deadline, "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                    {getTaskStatusBadge(task.status)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                    {getTimesheetApprovalStatusBadge(task.request_status)}
                  </td>
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
                        <TaskViewDialog task={task}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </TaskViewDialog>
                        {task.status && task.status === TaskStatus.DOING && (
                          <TaskConfirmDialog
                            targetTask={task}
                            fetchTasks={handleFetchTasks}
                          >
                            <div className="flex gap-2 text-lime-600 dark:text-lime-400 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                              <CircleCheckBig size={14} /> Mark as done
                            </div>
                          </TaskConfirmDialog>
                        )}
                        <TaskUpdateExpenseRequestDialog
                          targetTask={task}
                          fetchTasks={handleFetchTasks}
                        >
                          <div className="flex gap-2 text-main items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <CircleDollarSign size={14} /> Make a request
                          </div>
                        </TaskUpdateExpenseRequestDialog>
                        {/* {task?.status && task.status === TaskStatus.DONE && (
                          <div className="flex gap-2 text-yellow-600 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <History size={14} /> Mark as processing
                          </div>
                        )} */}
                        {hasRole(userRolePermissions.role, allowRoles) && (
                          <TaskUpdateDialog
                            targetTask={task}
                            fetchTasks={() => handleFetchTasks(1, limit, keyword, sortBy, sortOrder)}
                          >
                            <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                              <SquarePen size={14} /> Edit
                            </div>
                          </TaskUpdateDialog>
                        )}
                        <div className="text-red-500 flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                          <Trash2
                            size={14}
                            stroke="red"
                          />
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
      {taskList && (
        <PaginationWithLinks
          page={taskList.metadata.page}
          pageSize={taskList.metadata.limit}
          totalCount={taskList.metadata.total}
          callback={goToPage}
        />
      )}
    </>
  );
}
export default AuthenticatedRoute(Task, []);
