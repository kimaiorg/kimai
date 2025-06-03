"use client";

import { getWeeklyOneUserReport } from "@/api/report.api";
import { AuthenticatedRoute, hasRole } from "@/components/shared/authenticated-route";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/lib/i18n";
import { generateWeeklyReportPdf } from "@/lib/pdf-utils";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { formatDuration, generateWeekOption } from "@/lib/utils";
import { ProjectType } from "@/type_schema/project";
import { WeekDayType, WeeklyOneUserReportType, WeeklyReportEntry } from "@/type_schema/report";
import { Role, RolePermissionType } from "@/type_schema/role";
import { UserType } from "@/type_schema/user.schema";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function WeeklyUserReport() {
  const { t } = useTranslation();
  const { user } = useUser();
  const weekOptions = generateWeekOption();
  const [currentWeekNumber, setCurrentWeekNumber] = useState(21);

  const [selectedWeek, setSelectedWeek] = useState(weekOptions.find((week) => week.week === currentWeekNumber));
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];
  const userRolePermissions = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
  const allowRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD];
  const [currentWeek, setCurrentWeek] = useState<WeekDayType[]>([]);
  const [timeEntries, setTimeEntries] = useState<WeeklyReportEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType>(userList.find((u) => u.user_id === user!.sub!)!);
  const [isLoading, setIsLoading] = useState(true);

  const [weekInfo, setWeekInfo] = useState({ number: 15, year: 2025, start: "", end: "" });

  const [weeklyReport, setWeeklyReport] = useState<WeeklyOneUserReportType | null>(null);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const response = await getWeeklyOneUserReport(selectedUser.user_id!, selectedWeek!.from, selectedWeek!.to);
        const timeEachDays = [];
        for (let i = 0; i < 7; i++) {
          const totalTimeDay = response.entries.reduce(
            (sum, entry) => addTimeDuration(sum, entry.duration[i] || "0:00"),
            "0:00"
          );
          timeEachDays.push(totalTimeDay);
        }
        const data: WeeklyOneUserReportType = {
          ...response,
          user: userList.find((u) => u.user_id === selectedUser.user_id)!,
          totalOfDays: response.entries.reduce((sum, entry) => addTimeDuration(sum, entry.totalDuration), "0:00"),
          totalOfEachDay: timeEachDays
        };
        setWeeklyReport(data);
      } catch (error) {
        console.error("Error fetching weekly report data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, [selectedWeek, selectedUser]);

  // Generate week days
  useEffect(() => {
    const days: WeekDayType[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(selectedWeek!.from);
      date.setDate(date.getDate() + i);
      days.push({
        date,
        dayNumber: date.getDate(),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
      });
    }
    setCurrentWeek(days);
  }, [selectedWeek]);

  // Function to get time entries for a specific project and day
  const getTimeForProjectAndDay = (projectId: string, date: Date) => {
    const dateString = date.toISOString().split("T")[0];

    const entries = timeEntries.filter(
      (entry) => entry.project_id.toString() === projectId && entry.date === dateString
    );

    if (entries.length === 0) return null;

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate total hours for a project across the week
  const getProjectTotal = (projectId: string) => {
    // If project filter is applied, only show that project
    // if (selectedProjectId! !== projectId) {
    //   return formatDuration(0);
    // }

    const entries = timeEntries.filter((entry) => entry.project_id.toString() === projectId);
    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate total hours for a day across all projects
  const getDayTotal = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const entries = timeEntries.filter((entry) => entry.date === dateString);

    // If project filter is applied, only include that project
    // if (selectedProjectId !== undefined) {
    //   entries = entries.filter((entry) => entry.project_id.toString() === selectedProjectId);
    // }

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate grand total
  const getGrandTotal = () => {
    const entries = timeEntries;

    // If project filter is applied, only include that project
    // if (selectedProjectId !== undefined) {
    //   entries = entries.filter((entry) => entry.project_id.toString() === selectedProjectId);
    // }

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Handle week navigation
  const previousWeek = () => {
    if (selectedWeek!.week !== 1) {
      setSelectedWeek(weekOptions.find((week) => week.week === currentWeekNumber - 1)!);
      setCurrentWeekNumber(currentWeekNumber - 1);
    }
  };

  const nextWeek = () => {
    if (selectedWeek!.week !== 52) {
      setSelectedWeek(weekOptions.find((week) => week.week === currentWeekNumber + 1)!);
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
        .filter((project) => project.id.toString() === "1")
        .map((project) => [
          project.name,
          getProjectTotal(project.id.toString()),
          ...currentWeek.map((day) => getTimeForProjectAndDay(project.id.toString(), day.date) || "")
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
    const fileName = `Weekly_Report_${selectedUser}.xlsx`;

    // Export
    XLSX.writeFile(wb, fileName);
  };

  // Export to PDF
  const exportToPdf = () => {
    // Create table data for PDF
    const tableData = [
      // Project rows
      ...projects
        .filter((project) => project.id.toString() === "1")
        .map((project) => [
          project.name,
          getProjectTotal(project.id.toString()),
          ...currentWeek.map((day) => getTimeForProjectAndDay(project.id.toString(), day.date) || "")
        ]),

      // Total row
      ["Total", getGrandTotal(), ...currentWeek.map((day) => getDayTotal(day.date))]
    ];

    // Column headers
    const columns = ["Project", "Total", ...currentWeek.map((day) => `${day.dayName} ${day.dayNumber}`)];

    // Generate filename
    const fileName = `Weekly_Report_${selectedUser}.pdf`;

    // Generate PDF
    const pdfUrl = generateWeeklyReportPdf(`Weekly Report for ${selectedUser}`, weekInfo, columns, tableData, fileName);

    // Open PDF in new window
    window.open(pdfUrl, "_blank");
  };

  // Handle user change
  const handleUserChange = (userId: string) => {
    setSelectedUser(userList.find((u) => u.user_id === userId)!);
  };

  return (
    <>
      <div className="border border-gray-200 bg-white dark:bg-slate-700 rounded-md shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <button
              onClick={previousWeek}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer dark:hover:bg-slate-800"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div className="flex">
              <Select
                value={selectedWeek!.week.toString()}
                onValueChange={(e) => setSelectedWeek(weekOptions.find((week) => week.week === Number(e))!)}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200 cursor-pointer">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  {weekOptions.map((weekOption, index) => (
                    <SelectItem
                      key={index}
                      value={weekOption.week.toString()}
                      className="cursor-pointer"
                    >
                      {weekOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={nextWeek}
              className="p-1 rounded hover:bg-gray-100 cursor-pointer dark:hover:bg-slate-800"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {hasRole(userRolePermissions.role, allowRoles) && (
              <Select
                onValueChange={handleUserChange}
                value={selectedUser.user_id}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200 cursor-pointer">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  {userList.map((user, index) => (
                    <SelectItem
                      key={index}
                      value={user.user_id}
                      className="cursor-pointer"
                    >
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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
                  <TableHead className="w-1/4">Task</TableHead>
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
                {weeklyReport &&
                  weeklyReport.entries.map((entry, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">{entry.task.title}</div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">{entry.totalDuration}</div>
                      </TableCell>
                      {entry.duration.map((dur, index) => (
                        <TableCell
                          key={index}
                          className="text-blue-500 font-medium"
                        >
                          {dur || "0:00"}
                        </TableCell>
                      ))}
                      {/* {currentWeek.map((day, dayIndex) => (
                      <TableCell
                        key={dayIndex}
                        className={day.dayName === "THU" ? "bg-amber-50 dark:bg-slate-900" : ""}
                      >
                        {getTimeForProjectAndDay(project.id.toString(), day.date)}
                      </TableCell>
                    ))} */}
                    </TableRow>
                  ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-blue-500">{weeklyReport?.totalOfDays}</TableCell>
                  {weeklyReport?.totalOfEachDay.map((dayTotal, dayIndex) => (
                    <TableCell key={dayIndex}>{dayTotal}</TableCell>
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

export default AuthenticatedRoute(WeeklyUserReport, []);

function addTimeDuration(time1: string, time2: string): string {
  // Split the time strings into hours and minutes
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);

  // Add minutes and hours
  let totalMinutes: number = minutes1 + minutes2;
  let totalHours: number = hours1 + hours2;

  // Convert excess minutes into hours
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  // Format as "HH:MM" with leading zeros
  const formattedHours: string = totalHours.toString().padStart(2, "0");
  const formattedMinutes: string = totalMinutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}
