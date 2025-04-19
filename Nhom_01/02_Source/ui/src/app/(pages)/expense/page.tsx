"use client";

import { getAllExpenses } from "@/api/expense.api";
import { getAllProjects } from "@/api/project.api";
import { ExpenseCreateDialog } from "@/app/(pages)/expense/expense-create-dialog";
import { ExpenseUpdateDialog } from "@/app/(pages)/expense/expense-update-dialog";
import ExpenseViewDialog from "@/app/(pages)/expense/expense-view-dialog";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { Pagination } from "@/type_schema/common";
import { ExpenseType } from "@/type_schema/expense";
import { Role } from "@/type_schema/role";
import { Eye, FileDown, Filter, MoreHorizontal, Plus, Search, SquarePen, Trash2, Upload } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ExpensePage() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const [keyword, setKeyword] = useState<string>(queryParams.get("keyword") || "");
  const sortBy = queryParams.get("sortBy") || "";
  const sortOrder = queryParams.get("sortOrder") || "";
  const [expenseList, setExpenseList] = useState<Pagination<ExpenseType> | null>(null);

  const handleFetchExpenses = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      const [projects] = await Promise.all([getAllProjects()]);
      const result = await getAllExpenses(page, limit, keyword, sortBy, sortOrder);
      const { data, metadata } = result;
      console.log(projects);
      const expenses = data.map((expense) => {
        const project = projects.data.find((project) => project.id === expense.project_id)!;
        return {
          ...expense,
          project: project
        };
      });
      console.log(expenses);
      setExpenseList({
        metadata: metadata,
        data: expenses
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Fetch Expenses on component mount
  useEffect(() => {
    const fetchNecessaryData = async () => {
      await handleFetchExpenses(page, limit, keyword, sortBy, sortOrder);
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
    handleFetchExpenses(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
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
          <ExpenseCreateDialog fetchExpenses={() => handleFetchExpenses(1, limit, keyword, sortBy, sortOrder)}>
            <Button className="flex items-center justify-center bg-main gap-2 cursor-pointer text-white">
              Create <Plus />
            </Button>
          </ExpenseCreateDialog>
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Project</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Activity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Category</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          {!expenseList && <TableSkeleton columns={6} />}
          <tbody>
            {expenseList && expenseList.data.length === 0 && (
              <tr className="h-48 text-center">
                <td
                  colSpan={6}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  No expenses found.
                </td>
              </tr>
            )}
            {expenseList &&
              expenseList.data.map((expense, index) => (
                <tr
                  key={index}
                  className={`border-t dark:border-slate-700 `}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{expense.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="ml-2">{expense.name}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{expense.project.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{expense.activity.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{expense.category.name}</td>
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
                        <ExpenseViewDialog expense={expense}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </ExpenseViewDialog>
                        <ExpenseUpdateDialog
                          targetExpense={expense}
                          fetchExpenses={() => handleFetchExpenses(1, limit, keyword, sortBy, sortOrder)}
                        >
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <SquarePen size={14} /> Edit
                          </div>
                        </ExpenseUpdateDialog>
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
      {expenseList && (
        <PaginationWithLinks
          page={expenseList.metadata.page}
          pageSize={expenseList.metadata.limit}
          totalCount={expenseList.metadata.total}
          callback={goToPage}
        />
      )}
    </>
  );
}
export default AuthenticatedRoute(ExpensePage, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
