"use client";

import { getAllInvoiceTemplates } from "@/api/invoice.api";
import FilterInvoiceTemplateModal from "@/app/(pages)/invoice-template/filter-modal";
import { InvoiceTemplateCreateDialog } from "@/app/(pages)/invoice-template/invoice-template-create-dialog";
import { InvoiceTemplateUpdateDialog } from "@/app/(pages)/invoice-template/invoice-template-update-dialog";
import InvoiceTemplateViewDialog from "@/app/(pages)/invoice-template/invoice-template-view-dialog";
import FilterProjectModal from "@/app/(pages)/project/filter-modal";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Pagination } from "@/type_schema/common";
import { InvoiceTemplate } from "@/type_schema/invoice";
import { Role } from "@/type_schema/role";
import debounce from "debounce";
import {
  Eye,
  FileCode,
  FileDown,
  FileText,
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

function InvoiceTemplatePage() {
  const { t } = useTranslation();
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const searchKeyword = queryParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "");
  const [isActive, setIsActive] = useState<boolean>(
    queryParams.get("isActive") ? Boolean(queryParams.get("isActive")) : true
  );
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [invoiceTemplateList, setInvoiceTemplateList] = useState<Pagination<InvoiceTemplate> | null>(null);

  // const handleCreateTemplate = (newTemplate: Omit<InvoiceTemplate, "id" | "createdAt" | "updatedAt">) => {
  //   const template: InvoiceTemplate = {
  //     ...newTemplate,
  //     id: Math.random().toString(36).substring(7),
  //     createdAt: new Date().toISOString()
  //   };
  //   setTemplates(templates);
  //   setIsCreateDialogOpen(false);
  // };

  const updateQueryParams = (param: string, value: string) => {
    const params = new URLSearchParams(queryParams);
    params.set(param, value);
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const fetchInvoiceTemplates = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean
  ) => {
    const result = await getAllInvoiceTemplates(page, limit, keyword, sortBy, sortOrder, isActive);
    setInvoiceTemplateList(result);
  };

  useEffect(() => {
    fetchInvoiceTemplates(page, limit, searchKeyword, sortBy, sortOrder, isActive);
  }, [page, limit, searchKeyword, sortBy, sortOrder, isActive]);

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
    fetchInvoiceTemplates(page, limit, keyword, sortBy, sortOrder);
    updateQueryParams("page", page.toString());
  };

  const updateUrl = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleFilterChange = (props: any) => {
    const params = new URLSearchParams();
    const { _sortBy, _sortOrder, _isActive } = props;
    params.set("page", "1"); // Reset to first page when applying filters
    if (_sortBy) params.set("sortBy", _sortBy);
    if (_sortOrder) params.set("sortOrder", _sortOrder);
    if (_isActive) params.set("isActive", _isActive);
    updateUrl(params);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice template</h1>
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
          <FilterInvoiceTemplateModal
            handleFilterChangeAction={handleFilterChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            isActive={isActive}
          >
            <Button
              variant="outline"
              size="icon"
              className="flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </FilterInvoiceTemplateModal>
          <InvoiceTemplateCreateDialog refetchInvoiceTemplates={fetchInvoiceTemplates}>
            <Button className="flex items-center justify-center gap-2 cursor-pointer bg-main text-white">
              Create <Plus />
            </Button>
          </InvoiceTemplateCreateDialog>
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

      <div className="rounded-md">
        <Table className="rounded-lg border border-slate-200 bg-white dark:bg-slate-700">
          <TableHeader className="rounded-lg border border-slate-200 bg-gray-100 dark:bg-slate-800">
            <TableRow>
              <TableHead className="font-semibold">{t("invoiceTemplate.NAME")}</TableHead>
              <TableHead className="font-semibold">{t("invoiceTemplate.FORMAT")}</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceTemplateList &&
              invoiceTemplateList.data.length > 0 &&
              invoiceTemplateList.data.map((invoiceTemplate, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <TableCell className="font-medium">{invoiceTemplate.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getInvoiceTemplateFormatIcon(invoiceTemplate.format)}
                      <span>{invoiceTemplate.format}</span>
                    </div>
                  </TableCell>
                  <TableCell>
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
                        <InvoiceTemplateViewDialog invoiceTemplate={invoiceTemplate}>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Eye size={14} /> Show
                          </div>
                        </InvoiceTemplateViewDialog>
                        <InvoiceTemplateUpdateDialog
                          targetInvoiceTemplate={invoiceTemplate}
                          refetchInvoiceTemplates={fetchInvoiceTemplates}
                        >
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <SquarePen size={14} />
                            Edit
                          </div>
                        </InvoiceTemplateUpdateDialog>
                        <div className="text-red-500 flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                          <Trash2 size={14} />
                          Delete
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            {invoiceTemplateList && invoiceTemplateList.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-6 text-gray-500"
                >
                  {t("invoiceTemplate.NO_TEMPLATES_FOUND")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

const AuthenticatedInvoiceTemplatePage = AuthenticatedRoute(InvoiceTemplatePage, [Role.ADMIN, Role.SUPER_ADMIN]);

export default AuthenticatedInvoiceTemplatePage;

export const getInvoiceTemplateFormatIcon = (format: string) => {
  return format === "PDF" ? (
    <FileText className="h-4 w-4 text-red-500" />
  ) : (
    <FileCode className="h-4 w-4 text-blue-500" />
  );
};
