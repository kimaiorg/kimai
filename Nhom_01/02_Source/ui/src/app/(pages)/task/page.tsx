"use client";

import { getAllTasks } from "@/api/task.api";
import { getAllUsers } from "@/api/user.api";
import FilterTaskModal from "@/app/(pages)/task/filter-modal";
import { TaskCreateDialog } from "@/app/(pages)/task/task-create-dialog";
import { TaskUpdateDialog } from "@/app/(pages)/task/task-update-dialog";
import TaskViewDialog from "@/app/(pages)/task/task-view-dialog";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useAppDispatch, useAppSelector } from "@/lib/redux-toolkit/hooks";
import { updateUserList } from "@/lib/redux-toolkit/slices/list-user-slice";
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { TaskType } from "@/type_schema/task";
import { UserType } from "@/type_schema/user.schema";
import { format } from "date-fns";
import { Eye, FileDown, Filter, MoreHorizontal, Plus, Search, SquarePen, Trash2, Upload } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Task() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const users: UserType[] = useAppSelector((state) => state.userListState.users);
  const dispatch = useAppDispatch();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
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
      let userList = users;
      if (users.length == 0) {
        const result = await getAllUsers();
        userList = result.users;
        dispatch(updateUserList(result.users));
      }
      const result = await getAllTasks(page, limit, keyword, sortBy, sortOrder, activityId, userId);
      const { data, metadata } = result;
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
      await handleFetchTasks(page, limit, keyword, sortBy, sortOrder);
      setIsLoading(false);
    };
    fetchNecessaryData();
  }, [page, limit, keyword, sortBy, sortOrder]);

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
          <TaskCreateDialog fetchTasks={() => handleFetchTasks(1, limit, keyword, sortBy, sortOrder)}>
            <Button className="flex items-center justify-center bg-main gap-2 cursor-pointer text-white">
              Create <Plus />
            </Button>
          </TaskCreateDialog>
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          {isLoading && <TableSkeleton columns={6} />}
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
                    <span className="ml-2">{task.title}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.activity.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.user?.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {format(task.deadline, "dd/MM/yyyy HH:mm")}
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
                        <TaskUpdateDialog
                          targetTask={task}
                          fetchTasks={() => handleFetchTasks(1, limit, keyword, sortBy, sortOrder)}
                        >
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <SquarePen size={14} /> Edit
                          </div>
                        </TaskUpdateDialog>
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
export default AuthenticatedRoute(Task, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
