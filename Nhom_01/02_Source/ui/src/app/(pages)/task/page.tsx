"use client";

import { getAllTasks } from "@/api/task.api";
import { TaskCreateDialog } from "@/app/(pages)/task/task-create-dialog";
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
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { TaskType } from "@/type_schema/task";
import { FileDown, Filter, MoreHorizontal, Plus, Search, Upload } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Task() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc");
  const [taskList, setTaskList] = useState<Pagination<TaskType>>({
    metadata: {
      page: 1,
      limit: 10,
      totalPages: 0,
      total: 0
    },
    data: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchTasks = async (page: number, limit: number, keyword: string, sortBy: string, sortOrder: string) => {
    try {
      const data = await getAllTasks(page, limit, keyword, sortBy, sortOrder);
      console.log(data);
      setTaskList(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch Tasks on component mount
  useEffect(() => {
    setIsLoading(true);
    handleFetchTasks(page, limit, keyword, sortBy, sortOrder);
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
    handleFetchTasks(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  if (isLoading) {
    return <Loading />;
  }

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
          <Button
            variant="outline"
            size="icon"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <TaskCreateDialog fetchTasks={() => handleFetchTasks(1, limit, keyword, sortBy, sortOrder)}>
            <Button className="flex items-center justify-center gap-2 cursor-pointer">
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

      <div className="rounded-md border bg-white dark:bg-slate-900 my-5">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Activity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {taskList.data.length === 0 && (
              <tr className="h-48 text-center">
                <td
                  colSpan={6}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  No tasks found.
                </td>
              </tr>
            )}
            {taskList.data.map((task, index) => (
              <tr
                key={index}
                className={`border-t dark:border-slate-700 `}
              >
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="ml-2">{task.title}</span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.activity_id}</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.user_id}</td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{task.deadline}</td>
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
        page={taskList.metadata.page}
        pageSize={taskList.metadata.limit}
        totalCount={taskList.metadata.total}
        callback={goToPage}
      />
    </>
  );
}
export default AuthenticatedRoute(Task, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
