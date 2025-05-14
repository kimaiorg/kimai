"use client";

import { ApprovalStatus, RequestUpdateType, RequestViewType } from "@/type_schema/request";

import { getAllExpenseUpdateTasks } from "@/api/task.api";
import { getRequestById } from "@/app/(pages)/request/request-items";
import ExpenseUpdateRequestDialog from "@/app/(pages)/request/task/task-expense-request-dialog";
import FilterTaskModal from "@/app/(pages)/task/filter-modal";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { TaskExpenseUpdateRequestType, TaskResponseType } from "@/type_schema/task";
import { UserType } from "@/type_schema/user.schema";
import debounce from "debounce";
import { Filter, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function TaskExpenseUpdateRequestPage() {
  const requestType: RequestViewType = getRequestById("task")!;
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const userList: UserType[] = useAppSelector((state) => state.userListState.users) as UserType[];
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const searchKeyword = queryParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const teamId = queryParams.get("teamId") || "";
  const userId = queryParams.get("userId") || "";
  const [taskList, setTaskList] = useState<Pagination<
    RequestUpdateType<TaskResponseType, TaskExpenseUpdateRequestType>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchTasks = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      const result = await getAllExpenseUpdateTasks(page, limit, keyword, sortBy, sortOrder, teamId, userId);

      const { data, metadata } = result;
      const taskData = data.map((taskExpense) => {
        const { previous_data: task, ...rest } = taskExpense;
        const { user_id, ...restTask } = task;
        return {
          ...rest,
          previous_data: {
            ...restTask,
            user_id,
            user: userList.find((user) => user.user_id === user_id)!
          }
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

  const getExpenseApprovalStatusBadge = (status?: string) => {
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
          </FilterTaskModal>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white dark:bg-slate-700 my-5">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">No.</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Expense</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          {!taskList && <TableSkeleton columns={6} />}
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
              taskList.data.map((taskExpense, index) => (
                <ExpenseUpdateRequestDialog
                  key={index}
                  taskExpense={taskExpense}
                  fetchTaskExpenses={() => handleFetchTasks()}
                >
                  <tr className="border-t dark:border-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800">
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {taskExpense.previous_data.id}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: taskExpense.previous_data.color || "#6C757D" }}
                        ></div>
                        <span className="ml-2">{taskExpense.previous_data.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {taskExpense.previous_data.user?.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {taskExpense.previous_data.expense.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                      {getExpenseApprovalStatusBadge(taskExpense.status)}
                    </td>
                  </tr>
                </ExpenseUpdateRequestDialog>
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

export default AuthenticatedRoute(TaskExpenseUpdateRequestPage, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
