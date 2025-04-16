"use client";

import { getWeeklyUserReport } from "@/api/report.api";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/lib/i18n";
import { generateWeeklyReportPdf } from "@/lib/pdf-utils";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { formatDuration } from "@/lib/utils";
import { WeekDay, WeeklyReportEntry } from "@/type_schema/report";
import { UserType } from "@/type_schema/user.schema";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function WeeklyUserReport() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [currentWeek, setCurrentWeek] = useState<WeekDay[]>([]);
  const [currentWeekNumber, setCurrentWeekNumber] = useState(15);
  const [currentYear, setCurrentYear] = useState(2025);
  const [timeEntries, setTimeEntries] = useState<WeeklyReportEntry[]>([]);
  const [projects, setProjects] = useState<{ id: number; name: string; color: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState(user?.name || "Anna Smith");
  const [isLoading, setIsLoading] = useState(true);
  const [weekInfo, setWeekInfo] = useState({ number: 15, year: 2025, start: "", end: "" });

  // Mock users for filter
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];

  // Selected user ID
  const [selectedUserId, setSelectedUserId] = useState<string>(user?.sub || "1");

  // Project filter
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const data = await getWeeklyUserReport(selectedUserId, currentWeekNumber, currentYear);
        setTimeEntries(data.entries || []);
        setProjects(data.projects || []);
        setSelectedUser(data.user?.name || "Anna Smith");
        setWeekInfo(data.week || { number: currentWeekNumber, year: currentYear, start: "", end: "" });
      } catch (error) {
        console.error("Error fetching weekly report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [currentWeekNumber, currentYear, selectedUserId]);

  // Generate week days
  useEffect(() => {
    const generateWeekDays = () => {
      // Get the first day of the week (Monday) for the current week number
      const firstDayOfWeek = new Date(currentYear, 0, (currentWeekNumber - 1) * 7 + 1);
      while (firstDayOfWeek.getDay() !== 1) {
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 1);
      }

      const days: WeekDay[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        days.push({
          date,
          dayNumber: date.getDate(),
          dayName: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
        });
      }
      setCurrentWeek(days);
    };

    generateWeekDays();
  }, [currentWeekNumber, currentYear]);

  // Function to get time entries for a specific project and day
  const getTimeForProjectAndDay = (projectId: number, date: Date) => {
    const dateString = date.toISOString().split("T")[0];

    // If project filter is applied, only show that project
    if (selectedProjectId !== undefined && selectedProjectId !== projectId) {
      return null;
    }

    const entries = timeEntries.filter((entry) => entry.project_id === projectId && entry.date === dateString);

    if (entries.length === 0) return null;

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate total hours for a project across the week
  const getProjectTotal = (projectId: number) => {
    // If project filter is applied, only show that project
    if (selectedProjectId !== undefined && selectedProjectId !== projectId) {
      return formatDuration(0);
    }

    const entries = timeEntries.filter((entry) => entry.project_id === projectId);
    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate total hours for a day across all projects
  const getDayTotal = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    let entries = timeEntries.filter((entry) => entry.date === dateString);

    // If project filter is applied, only include that project
    if (selectedProjectId !== undefined) {
      entries = entries.filter((entry) => entry.project_id === selectedProjectId);
    }

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate grand total
  const getGrandTotal = () => {
    let entries = timeEntries;

    // If project filter is applied, only include that project
    if (selectedProjectId !== undefined) {
      entries = entries.filter((entry) => entry.project_id === selectedProjectId);
    }

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Handle week navigation
  const previousWeek = () => {
    if (currentWeekNumber === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentWeekNumber(52);
    } else {
      setCurrentWeekNumber(currentWeekNumber - 1);
    }
  };

  const nextWeek = () => {
    if (currentWeekNumber === 52) {
      setCurrentYear(currentYear + 1);
      setCurrentWeekNumber(1);
    } else {
      setCurrentWeekNumber(currentWeekNumber + 1);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create worksheet data
    const wsData = [
      // Header row with days
      ["Project", "Total", ...currentWeek.map((day) => `${day.dayName} ${day.dayNumber}`)],

      // Project rows
      ...projects
        .filter((project) => selectedProjectId === undefined || project.id === selectedProjectId)
        .map((project) => [
          project.name,
          getProjectTotal(project.id),
          ...currentWeek.map((day) => getTimeForProjectAndDay(project.id, day.date) || "")
        ]),

      // Total row
      ["Total", getGrandTotal(), ...currentWeek.map((day) => getDayTotal(day.date))]
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Weekly Report");

    // Generate filename
    const fileName = `Weekly_Report_${selectedUser}_Week${currentWeekNumber}_${currentYear}.xlsx`;

    // Export
    XLSX.writeFile(wb, fileName);
  };

  // Export to PDF
  const exportToPdf = () => {
    // Create table data for PDF
    const tableData = [
      // Project rows
      ...projects
        .filter((project) => selectedProjectId === undefined || project.id === selectedProjectId)
        .map((project) => [
          project.name,
          getProjectTotal(project.id),
          ...currentWeek.map((day) => getTimeForProjectAndDay(project.id, day.date) || "")
        ]),

      // Total row
      ["Total", getGrandTotal(), ...currentWeek.map((day) => getDayTotal(day.date))]
    ];

    // Column headers
    const columns = ["Project", "Total", ...currentWeek.map((day) => `${day.dayName} ${day.dayNumber}`)];

    // Generate filename
    const fileName = `Weekly_Report_${selectedUser}_Week${currentWeekNumber}_${currentYear}.pdf`;

    // Generate PDF
    const pdfUrl = generateWeeklyReportPdf(`Weekly Report for ${selectedUser}`, weekInfo, columns, tableData, fileName);

    // Open PDF in new window
    window.open(pdfUrl, "_blank");
  };

  // Color dot for project
  const ProjectColorDot = ({ color }: { color: string }) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      pink: "bg-pink-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      orange: "bg-orange-500"
    };

    return <span className={`inline-block w-2 h-2 rounded-full mr-2 ${colorMap[color]}`}></span>;
  };

  // Handle user change
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = userList.find((u) => u.user_id === userId);
    if (user) {
      setSelectedUser(user.name);
    }
  };

  // Handle project filter change
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProjectId(value ? parseInt(value) : undefined);
  };

  // Format week display
  const formatWeekDisplay = () => {
    if (!weekInfo || !weekInfo.start || !weekInfo.end) {
      // Fallback if week info is not available
      return `${currentYear} - Week ${currentWeekNumber}`;
    }

    try {
      // Parse dates from ISO format (YYYY-MM-DD)
      const startParts = weekInfo.start.split("-");
      const endParts = weekInfo.end.split("-");

      if (startParts.length !== 3 || endParts.length !== 3) {
        return `${currentYear} - Week ${currentWeekNumber}`;
      }

      // Create date objects
      const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
      const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return `${currentYear} - Week ${currentWeekNumber}`;
      }

      // Format dates
      const startMonth = startDate.toLocaleString("default", { month: "long" });
      const endMonth = endDate.toLocaleString("default", { month: "long" });

      // If same month
      if (startMonth === endMonth) {
        return `${startMonth} ${currentYear} - Week ${currentWeekNumber}`;
      } else {
        return `${startMonth}/${endMonth} ${currentYear} - Week ${currentWeekNumber}`;
      }
    } catch (error) {
      console.error("Error formatting week display:", error);
      return `${currentYear} - Week ${currentWeekNumber}`;
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-700 rounded-md shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <button
              onClick={previousWeek}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer dark:hover:bg-slate-800"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div className="relative">
              <select
                className="appearance-none bg-transparent pr-8 py-1 pl-2 border border-gray-300 rounded-md cursor-pointer font-medium"
                value={`${currentWeekNumber}`}
                onChange={(e) => setCurrentWeekNumber(parseInt(e.target.value))}
              >
                {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
                  <option
                    key={week}
                    value={week}
                  >
                    {formatWeekDisplay()}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-2 h-4 w-4 pointer-events-none" />
            </div>

            <button
              onClick={nextWeek}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer dark:hover:bg-slate-800"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="rounded-md px-3 py-1 pr-8 cursor-pointer border border-gray-200"
                onChange={handleUserChange}
                value={selectedUserId}
              >
                {userList.map((user, index) => (
                  <option
                    key={index}
                    value={user.user_id}
                    className="dark:bg-slate-800 dark:text-white"
                  >
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                className="appearance-none border rounded-md py-1 pr-8 cursor-pointer border-gray-200"
                onChange={handleProjectChange}
                value={selectedProjectId || ""}
              >
                <option
                  value=""
                  className="dark:bg-slate-800 dark:text-white px-3"
                >
                  All projects
                </option>
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                    className="dark:bg-slate-800 dark:text-white px-3"
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={exportToExcel}
                variant="outline"
                className="flex items-center cursor-pointer border-gray-200"
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button
                onClick={exportToPdf}
                variant="outline"
                className="flex items-center cursor-pointer border-gray-200"
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading report data...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="dark:bg-slate-800">
                <TableRow>
                  <TableHead className="w-1/4">Project</TableHead>
                  <TableHead>Total</TableHead>
                  {currentWeek.map((day, index) => (
                    <TableHead
                      key={index}
                      className={day.dayName === "THU" ? "bg-amber-50 dark:bg-slate-900" : ""}
                    >
                      {day.dayName} {day.dayNumber}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects
                  .filter((project) => selectedProjectId === undefined || project.id === selectedProjectId)
                  .map((project) => (
                    <TableRow
                      key={project.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <ProjectColorDot color={project.color} />
                          {project.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-blue-500 font-medium">{getProjectTotal(project.id)}</TableCell>
                      {currentWeek.map((day, dayIndex) => (
                        <TableCell
                          key={dayIndex}
                          className={day.dayName === "THU" ? "bg-amber-50 dark:bg-slate-900" : ""}
                        >
                          {getTimeForProjectAndDay(project.id, day.date)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-blue-500">{getGrandTotal()}</TableCell>
                  {currentWeek.map((day, dayIndex) => (
                    <TableCell
                      key={dayIndex}
                      className={day.dayName === "THU" ? "bg-amber-50 dark:bg-slate-900" : ""}
                    >
                      {getDayTotal(day.date)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
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

export default AuthenticatedRoute(WeeklyUserReport, []);
