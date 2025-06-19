"use client";

import { getAllCategories } from "@/api/category.api";
import { CategoryCreateDialog } from "@/app/(pages)/category/category-create-dialog";
import { CategoryUpdateDialog } from "@/app/(pages)/category/category-update-dialog";
import CategoryViewDialog from "@/app/(pages)/category/category-view-dialog";
import FilterCategoryModal from "@/app/(pages)/category/filter-modal";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { CategoryType } from "@/type_schema/category";
import { Pagination } from "@/type_schema/common";
import { Role } from "@/type_schema/role";
import { format } from "date-fns";
import debounce from "debounce";
import { Eye, Filter, MoreHorizontal, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function CategoryPage() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const searchKeyword = queryParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const sortBy = queryParams.get("sortBy") || "created_at";
  const sortOrder = queryParams.get("sortOrder") || "desc";
  const [categoryList, setCategoryList] = useState<Pagination<CategoryType> | null>(null);

  const handleFetchCategories = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      const result = await getAllCategories(page, limit, keyword, sortBy, sortOrder);
      setCategoryList(result);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch Tasks on component mount
  useEffect(() => {
    const fetchNecessaryData = async () => {
      await handleFetchCategories(page, limit, searchKeyword, sortBy, sortOrder);
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
    handleFetchCategories(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  const updateUrl = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleFilterChange = (props: any) => {
    const params = new URLSearchParams();
    const { _sortBy, _sortOrder } = props;
    params.set("page", "1"); // Reset to first page when applying filters
    if (_sortBy) params.set("sortBy", _sortBy);
    if (_sortOrder) params.set("sortOrder", _sortOrder);
    updateUrl(params);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
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
          <FilterCategoryModal
            handleFilterChangeAction={handleFilterChange}
            keyword={keyword}
            sortBy={sortBy}
            sortOrder={sortOrder}
          >
            <Button
              variant="outline"
              size="icon"
              className="flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </FilterCategoryModal>
          <CategoryCreateDialog fetchCategories={() => handleFetchCategories(1, limit, keyword, sortBy, sortOrder)}>
            <Button className="flex items-center justify-center bg-main gap-2 cursor-pointer text-white">
              Create <Plus />
            </Button>
          </CategoryCreateDialog>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white dark:bg-slate-700 my-5">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">No.</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Updated At</th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Cost</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Visible</th> */}
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          {!categoryList && <TableSkeleton columns={6} />}
          <tbody>
            {categoryList && categoryList.data.length === 0 && (
              <tr className="h-48 text-center">
                <td
                  colSpan={6}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  No tasks found.
                </td>
              </tr>
            )}
            {categoryList &&
              categoryList.data.map((category, index) => (
                <tr
                  key={index}
                  className={`border-t dark:border-slate-700 `}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color || "#6C757D" }}
                      ></div>
                      <span className="ml-2 text-muted-foreground">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{category.description}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {format(category.updated_at, "dd/MM/yyyy HH:mm")}
                  </td>
                  {/* <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{category.cost}</td> */}
                  {/* <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {category.visible ? "Yes" : "No"}
                  </td> */}
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
                        <CategoryViewDialog category={category}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </CategoryViewDialog>
                        <CategoryUpdateDialog
                          targetCategory={category}
                          fetchCategories={() => handleFetchCategories(1, limit, keyword, sortBy, sortOrder)}
                        >
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <SquarePen size={14} /> Edit
                          </div>
                        </CategoryUpdateDialog>
                        {/* <div className="text-red-500 flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                          <Trash2
                            size={14}
                            stroke="red"
                          />{" "}
                          Delete
                        </div> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {categoryList && (
        <PaginationWithLinks
          page={categoryList.metadata.page}
          pageSize={categoryList.metadata.limit}
          totalCount={categoryList.metadata.total}
          callback={goToPage}
        />
      )}
    </>
  );
}
export default AuthenticatedRoute(CategoryPage, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
