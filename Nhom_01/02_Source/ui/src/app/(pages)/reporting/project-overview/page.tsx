"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FilterIcon,
  MoreHorizontalIcon
} from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useUser } from "@auth0/nextjs-auth0/client";
import { formatDuration, formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";
import { getProjectOverviewReport } from "@/api/report.api";
import { ProjectReportData, CustomerReportData } from "@/type_schema/report";
import { generateProjectOverviewPdf } from "@/lib/pdf-utils";

function ProjectOverviewReport() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [projects, setProjects] = useState<ProjectReportData[]>([]);
  const [customers, setCustomers] = useState<CustomerReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected customer ID
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        // Chuyển đổi selectedCustomer sang number nếu không phải 'all'
        const customerId = selectedCustomer === "all" ? undefined : parseInt(selectedCustomer);
        const data = await getProjectOverviewReport(customerId);

        // Đảm bảo tất cả các dự án đều có customer_name
        const projectsWithCustomers = (data.projects || []).map((project) => {
          if (!project.customer_name && project.customer_id) {
            const customer = (data.customers || []).find((c) => c.id === project.customer_id);
            return {
              ...project,
              customer_name: customer?.name || "Unknown Customer"
            };
          }
          return project;
        });

        setProjects(projectsWithCustomers);
        setCustomers(data.customers || []);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [selectedCustomer]);

  // Calculate totals
  const calculateTotals = () => {
    const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
    const totalSpent = projects.reduce((sum, project) => sum + (project.spent || 0), 0);
    const totalRemaining = totalBudget - totalSpent;
    const totalTimeSpent = projects.reduce((sum, project) => sum + (project.time_spent || 0), 0);
    const totalThisMonth = projects.reduce((sum, project) => sum + (project.this_month || 0), 0);
    const totalNotExported = projects.reduce((sum, project) => sum + (project.not_exported || 0), 0);

    return {
      budget: totalBudget,
      spent: totalSpent,
      remaining: totalRemaining,
      timeSpent: totalTimeSpent,
      thisMonth: totalThisMonth,
      notExported: totalNotExported
    };
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create worksheet data
    const wsData = [
      // Header row
      ["Name", "Hourly Quota", "Budget", "Last Entry", "This Month", "Total", "Not Exported", "Budget Used"],

      // Project rows
      ...projects.map((project) => [
        project.name,
        project.hourly_quota || 0,
        formatCurrency(project.budget || 0),
        project.last_entry || "-",
        formatDuration(project.this_month || 0),
        formatDuration(project.total || 0),
        formatDuration(project.not_exported || 0),
        `${Math.min(100, Math.round(((project.spent || 0) / (project.budget || 1)) * 100))}%`
      ])
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Project Overview");

    // Generate filename
    const customerName =
      selectedCustomer !== "all"
        ? customers.find((c) => c.id.toString() === selectedCustomer)?.name || "Selected Customer"
        : "All Customers";
    const fileName = `Project_Overview_${customerName}_${new Date().toISOString().split("T")[0]}.xlsx`;

    // Export
    XLSX.writeFile(wb, fileName);
  };

  // Export to PDF
  const exportToPdf = () => {
    // Create table data for PDF
    const tableData = [
      // Project rows
      ...projects.map((project) => [
        project.name,
        project.hourly_quota || 0,
        formatCurrency(project.budget || 0),
        project.last_entry || "-",
        formatDuration(project.this_month || 0),
        formatDuration(project.total || 0),
        formatDuration(project.not_exported || 0),
        `${Math.min(100, Math.round(((project.spent || 0) / (project.budget || 1)) * 100))}%`
      ])
    ];

    // Column headers
    const columns = [
      "Name",
      "Hourly Quota",
      "Budget",
      "Last Entry",
      "This Month",
      "Total",
      "Not Exported",
      "Budget Used"
    ];

    // Generate filename
    const customerName =
      selectedCustomer !== "all"
        ? customers.find((c) => c.id.toString() === selectedCustomer)?.name || "Selected Customer"
        : "All Customers";
    const fileName = `Project_Overview_${customerName}_${new Date().toISOString().split("T")[0]}.pdf`;

    // Generate PDF
    const pdfUrl = generateProjectOverviewPdf(`Project Overview - ${customerName}`, columns, tableData, fileName);

    // Open PDF in new window
    window.open(pdfUrl, "_blank");
  };

  // Handle customer change
  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCustomer(value);
  };

  // Progress bar component with color
  const ProgressBar = ({ value, color }: { value: number; color: string }) => {
    const percentage = Math.min(100, Math.round(value * 100));
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Project color dot component
  const ProjectColorDot = ({ color }: { color: string }) => {
    return (
      <div
        className={`w-3 h-3 rounded-full mr-2 flex-shrink-0`}
        style={{ backgroundColor: color }}
      ></div>
    );
  };

  const tableData = useMemo(() => {
    if (!projects) return [];

    // If a specific customer is selected, group projects by customer
    if (selectedCustomer !== "all") {
      return projects
        .filter((p) => p.customer_id.toString() === selectedCustomer)
        .map((project) => ({
          ...project,
          type: "project"
        }));
    }

    // For "All Customers", create a flat list with customer rows and project rows
    const result: (ProjectReportData & { type: "customer" | "project" })[] = [];

    // Group projects by customer
    const groupedByCustomer = projects.reduce((acc: { [key: string]: ProjectReportData[] }, project) => {
      // Sử dụng tên khách hàng thực tế, không dùng "Other"
      const customerName = project.customer_name || "Unknown Customer";
      const customerId = project.customer_id?.toString() || "unknown";

      if (!acc[customerId]) {
        acc[customerId] = [];
      }

      acc[customerId].push(project);
      return acc;
    }, {});

    // Create the flat list with customer rows followed by their projects
    Object.entries(groupedByCustomer).forEach(([customerId, customerProjects]) => {
      // Add customer row
      const customerName = customerProjects[0]?.customer_name || "Unknown Customer";
      result.push({
        id: customerId,
        name: customerName,
        customer_id: customerId,
        customer_name: customerName,
        type: "customer",
        // Thêm các thuộc tính bắt buộc từ ProjectReportData với giá trị mặc định
        hourly_quota: 0,
        budget: 0,
        spent: 0,
        time_spent: 0,
        last_entry: "",
        this_month: 0,
        total: 0,
        not_exported: 0,
        not_billed: 0,
        budget_used_percentage: 0,
        color: ""
      } as unknown as ProjectReportData & { type: "customer" | "project" });

      // Add project rows
      customerProjects.forEach((project) => {
        result.push({
          ...project,
          type: "project"
        });
      });
    });

    return result;
  }, [projects, selectedCustomer]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link
          href="/reporting"
          className="text-blue-500 hover:underline mr-2"
        >
          {t("page.reporting.title")}
        </Link>
        <span className="mx-2">›</span>
        <span>Project overview</span>
      </div>

      <div className="bg-white dark:bg-slate-700 rounded-md shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">Project Overview</h2>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="appearance-none border rounded-md p-1 pr-8 cursor-pointer border-gray-200"
                onChange={handleCustomerChange}
                value={selectedCustomer}
              >
                <option
                  value="all"
                  className="dark:bg-slate-800 dark:text-white"
                >
                  All Customers
                </option>
                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                    className="dark:bg-slate-800 dark:text-white"
                  >
                    {customer.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none" />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={exportToExcel}
                variant="outline"
                className="flex items-center cursor-pointer border border-gray-200"
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button
                onClick={exportToPdf}
                variant="outline"
                className="flex items-center cursor-pointer border border-gray-200"
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading project data...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-slate-800">
                <TableRow>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("Hourly Quota")}</TableHead>
                  <TableHead>{t("Budget")}</TableHead>
                  <TableHead>{t("Last Entry")}</TableHead>
                  <TableHead>{t("This Month")}</TableHead>
                  <TableHead>{t("Total")}</TableHead>
                  <TableHead>{t("Not Exported")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-4"
                    >
                      No projects found
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {tableData.map((item) => {
                      if (item.type === "customer") {
                        // Customer row
                        return (
                          <TableRow
                            key={`customer-${item.id}`}
                            className="bg-gray-100 dark:bg-slate-700"
                          >
                            <TableCell
                              colSpan={8}
                              className="font-semibold "
                            >
                              <div className="flex items-center">
                                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                                {item.name}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        // Project row
                        const projectColor = item.color || "#3498db";
                        return (
                          <TableRow
                            key={`project-${item.id}`}
                            className="hover:bg-gray-50 dark:bg-slate-800"
                          >
                            <TableCell>
                              <div className="flex items-center">
                                <ProjectColorDot color={projectColor} />
                                <span>{item.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="whitespace-nowrap">{item.hourly_quota?.toFixed(2) || "0.00"}</div>
                            </TableCell>
                            <TableCell>
                              {item.budget ? (
                                <div>
                                  <div className="flex justify-between">
                                    <div className="whitespace-nowrap">FKP {item.budget?.toFixed(2) || "0.00"}</div>
                                    {item.spent > 0 && (
                                      <div className="whitespace-nowrap text-right">
                                        FKP {(item.spent || 0).toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                  <ProgressBar
                                    value={item.budget_used_percentage || 0}
                                    color={
                                      (item.budget_used_percentage || 0) > 1
                                        ? "bg-red-500"
                                        : (item.budget_used_percentage || 0) > 0.8
                                          ? "bg-orange-500"
                                          : "bg-green-500"
                                    }
                                  />
                                  <div className="text-xs mt-1">
                                    {Math.round((item.budget_used_percentage || 0) * 100)}% used
                                    {item.budget_used_percentage >= 1 ? (
                                      <span className="ml-1 text-red-500">(Budget exceeded)</span>
                                    ) : item.not_billed > 0 ? (
                                      <span className="ml-1 text-gray-500">
                                        ({(item.not_billed || 0).toFixed(2)} are still open)
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{item.last_entry || "-"}</TableCell>
                            <TableCell>{formatDuration(item.this_month * 3600 || 0)}</TableCell>
                            <TableCell>{formatDuration(item.total * 3600 || 0)}</TableCell>
                            <TableCell>{formatDuration(item.not_exported * 3600 || 0)}</TableCell>
                            <TableCell>
                              <button className="text-gray-500 hover:text-gray-700">
                                <MoreHorizontalIcon className="h-5 w-5" />
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// Add ChevronDownIcon component
const ChevronDownIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default AuthenticatedRoute(ProjectOverviewReport, []);
