"use client";

import { getAllCustomers } from "@/api/customer.api";
import { CustomerUpdateDialog } from "@/app/(pages)/customer/customer-edit-dialog";
import CustomerViewDialog from "@/app/(pages)/customer/customer-view-dialog";
import FilterCustomerModal from "@/app/(pages)/customer/filter-modal";
import Loading from "@/app/loading";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { TableCell } from "@/components/ui/table";
import { Pagination } from "@/type_schema/common";
import { CustomerType } from "@/type_schema/customer";
import { Role } from "@/type_schema/role";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import debounce from "debounce";
import { Eye, Filter, MoreHorizontal, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CustomerCreateDialog } from "./customer-create-dialog";

function CustomerPage() {
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const searchKeyword = queryParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const sortBy = queryParams.get("sortBy") || "created_at";
  const sortOrder = queryParams.get("sortOrder") || "";
  const [customerList, setCustomerList] = useState<Pagination<CustomerType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchCustomers = async (
    page?: number,
    size?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      const data = await getAllCustomers(page, size, keyword, sortBy, sortOrder);
      setCustomerList(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    setIsLoading(true);
    handleFetchCustomers(page, limit, searchKeyword, sortBy, sortOrder);
    setIsLoading(false);
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
    handleFetchCustomers(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  const updateUrl = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleFilterChange = (props: any) => {
    const params = new URLSearchParams();
    const { _keyword, _sortBy, _sortOrder } = props;
    params.set("page", "1"); // Reset to first page when applying filters
    if (_sortBy) params.set("sortBy", _sortBy);
    if (_sortOrder) params.set("sortOrder", _sortOrder);
    if (_keyword) params.set("keyword", _keyword);
    updateUrl(params);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
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
          <FilterCustomerModal
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
          </FilterCustomerModal>
          <CustomerCreateDialog fetchCustomers={() => handleFetchCustomers(1, limit, keyword, sortBy, sortOrder)}>
            <Button className="flex items-center justify-center gap-2 cursor-pointer bg-main text-white">
              Create <Plus />
            </Button>
          </CustomerCreateDialog>
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 my-5">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Country</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
            </tr>
          </thead>
          {!customerList && <TableSkeleton />}
          <tbody>
            {customerList && customerList.data.length === 0 && (
              <tr className="h-48 text-center">
                <td
                  colSpan={6}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  No customers found.
                </td>
              </tr>
            )}
            {customerList &&
              customerList.data.map((customer, index) => (
                <tr
                  key={index}
                  className={`border-t dark:border-slate-700`}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: customer.color || "#FF5733" }}
                      ></div>
                      <span className="ml-2">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{customer.country}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{customer.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{customer.phone}</td>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 cursor-pointer text-center"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-28 border border-gray-200 rounded-md bg-white dark:bg-slate-800"
                      >
                        <CustomerViewDialog customer={customer}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </CustomerViewDialog>
                        <CustomerUpdateDialog
                          targetCustomer={customer}
                          fetchCustomers={() => handleFetchCustomers(1)}
                        >
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <SquarePen size={14} />
                            Edit
                          </div>
                        </CustomerUpdateDialog>
                        <div className="text-red-500 items-center flex gap-2 cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                          <Trash2 size={14} />
                          Delete
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {customerList && (
        <PaginationWithLinks
          page={customerList.metadata.page}
          pageSize={customerList.metadata.limit}
          totalCount={customerList.metadata.total}
          callback={goToPage}
        />
      )}
    </>
  );
}

export default AuthenticatedRoute(CustomerPage, [Role.SUPER_ADMIN, Role.ADMIN]);
