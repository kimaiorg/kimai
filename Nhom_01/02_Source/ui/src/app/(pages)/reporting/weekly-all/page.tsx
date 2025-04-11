"use client";

import React, { useState, useEffect } from "react";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, FilterIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useUser } from "@auth0/nextjs-auth0/client";
import { formatDuration } from "@/lib/utils";
import * as XLSX from "xlsx";
import { getWeeklyAllUsersReport } from "@/api/report.api";
import { WeekDay, WeeklyReportEntry, UserReportData } from "@/type_schema/report";
import { generateWeeklyReportPdf } from "@/lib/pdf-utils";

function WeeklyAllUsersReport() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [currentWeek, setCurrentWeek] = useState<WeekDay[]>([]);
  const [currentWeekNumber, setCurrentWeekNumber] = useState(15);
  const [currentYear, setCurrentYear] = useState(2025);
  const [timeEntries, setTimeEntries] = useState<WeeklyReportEntry[]>([]);
  const [projects, setProjects] = useState<{ id: number; name: string; color: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weekInfo, setWeekInfo] = useState({ number: 15, year: 2025, start: "", end: "" });

  // Mock teams for filter
  const [teams, setTeams] = useState([
    { id: "1", name: "Development" },
    { id: "2", name: "Design" },
    { id: "3", name: "Marketing" },
    { id: "4", name: "Management" },
    { id: "5", name: "All Teams" }
  ]);

  // Selected team ID
  const [selectedTeamId, setSelectedTeamId] = useState<string>("5");

  // Project filter
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const data = await getWeeklyAllUsersReport(currentWeekNumber, currentYear);
        setTimeEntries(data.entries || []);
        setProjects(data.projects || []);

        // Convert user IDs to strings for consistency
        const formattedUsers = (data.users || []).map((user) => ({
          ...user,
          id: String(user.id)
        }));
        setUsers(formattedUsers);
        setWeekInfo(data.week || { number: currentWeekNumber, year: currentYear, start: "", end: "" });
      } catch (error) {
        console.error("Error fetching weekly all users report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [currentWeekNumber, currentYear, selectedTeamId]);

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

  // Function to get time entries for a specific user, project and day
  const getTimeForUserProjectAndDay = (userId: string, projectId: number, date: Date) => {
    const dateString = date.toISOString().split("T")[0];

    // If project filter is applied, only show that project
    if (selectedProjectId !== undefined && selectedProjectId !== projectId) {
      return null;
    }

    const entries = timeEntries.filter(
      (entry) => entry.user_id === parseInt(userId) && entry.project_id === projectId && entry.date === dateString
    );

    if (entries.length === 0) return null;

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate total hours for a user and project across the week
  const getUserProjectTotal = (userId: string, projectId: number) => {
    // If project filter is applied, only show that project
    if (selectedProjectId !== undefined && selectedProjectId !== projectId) {
      return formatDuration(0);
    }

    const entries = timeEntries.filter((entry) => entry.user_id === parseInt(userId) && entry.project_id === projectId);

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate total hours for a user across all projects
  const getUserTotal = (userId: string) => {
    let entries = timeEntries.filter((entry) => entry.user_id === parseInt(userId));

    // If project filter is applied, only include that project
    if (selectedProjectId !== undefined) {
      entries = entries.filter((entry) => entry.project_id === selectedProjectId);
    }

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalDuration);
  };

  // Calculate total hours for a project across all users
  const getProjectTotal = (projectId: number) => {
    // If project filter is applied, only show that project
    if (selectedProjectId !== undefined && selectedProjectId !== projectId) {
      return formatDuration(0);
    }

    const entries = timeEntries.filter((entry) => entry.project_id === projectId);
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
      // Header row with user and project
      ["User", "Project", "Total", ...currentWeek.map((day) => `${day.dayName} ${day.dayNumber}`)]
    ];

    // Add data rows for each user and project
    users.forEach((user) => {
      // Filter projects if needed
      const filteredProjects =
        selectedProjectId !== undefined ? projects.filter((p) => p.id === selectedProjectId) : projects;

      filteredProjects.forEach((project) => {
        const row = [
          user.name,
          project.name,
          getUserProjectTotal(user.id, project.id),
          ...currentWeek.map((day) => getTimeForUserProjectAndDay(user.id, project.id, day.date) || "")
        ];
        wsData.push(row);
      });

      // Add user total row
      wsData.push([
        user.name,
        "Total",
        getUserTotal(user.id),
        ...currentWeek.map((day) => {
          const dateString = day.date.toISOString().split("T")[0];
          let entries = timeEntries.filter((entry) => entry.user_id === parseInt(user.id) && entry.date === dateString);

          if (selectedProjectId !== undefined) {
            entries = entries.filter((entry) => entry.project_id === selectedProjectId);
          }

          const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
          return formatDuration(totalDuration);
        })
      ]);
    });

    // Add grand total row
    wsData.push([
      "All Users",
      "Grand Total",
      getGrandTotal(),
      ...currentWeek.map((day) => {
        const dateString = day.date.toISOString().split("T")[0];
        let entries = timeEntries.filter((entry) => entry.date === dateString);

        if (selectedProjectId !== undefined) {
          entries = entries.filter((entry) => entry.project_id === selectedProjectId);
        }

        const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
        return formatDuration(totalDuration);
      })
    ]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Weekly All Users Report");

    // Generate filename
    const teamName = teams.find((t) => t.id === selectedTeamId)?.name || "All Teams";
    const fileName = `Weekly_All_Users_Report_${teamName}_Week${currentWeekNumber}_${currentYear}.xlsx`;

    // Export
    XLSX.writeFile(wb, fileName);
  };

  // Export to PDF
  const exportToPdf = () => {
    // Create table data for PDF
    const tableData: any[] = [];

    // Add data rows for each user and project
    users.forEach((user) => {
      // Filter projects if needed
      const filteredProjects =
        selectedProjectId !== undefined ? projects.filter((p) => p.id === selectedProjectId) : projects;

      filteredProjects.forEach((project) => {
        const row = [
          user.name,
          project.name,
          getUserProjectTotal(user.id, project.id),
          ...currentWeek.map((day) => getTimeForUserProjectAndDay(user.id, project.id, day.date) || "")
        ];
        tableData.push(row);
      });

      // Add user total row
      tableData.push([
        user.name,
        "Total",
        getUserTotal(user.id),
        ...currentWeek.map((day) => {
          const dateString = day.date.toISOString().split("T")[0];
          let entries = timeEntries.filter((entry) => entry.user_id === parseInt(user.id) && entry.date === dateString);

          if (selectedProjectId !== undefined) {
            entries = entries.filter((entry) => entry.project_id === selectedProjectId);
          }

          const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
          return formatDuration(totalDuration);
        })
      ]);
    });

    // Add grand total row
    tableData.push([
      "All Users",
      "Grand Total",
      getGrandTotal(),
      ...currentWeek.map((day) => {
        const dateString = day.date.toISOString().split("T")[0];
        let entries = timeEntries.filter((entry) => entry.date === dateString);

        if (selectedProjectId !== undefined) {
          entries = entries.filter((entry) => entry.project_id === selectedProjectId);
        }

        const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
        return formatDuration(totalDuration);
      })
    ]);

    // Column headers
    const columns = ["User", "Project", "Total", ...currentWeek.map((day) => `${day.dayName} ${day.dayNumber}`)];

    // Generate filename
    const teamName = teams.find((t) => t.id === selectedTeamId)?.name || "All Teams";
    const fileName = `Weekly_All_Users_Report_${teamName}_Week${currentWeekNumber}_${currentYear}.pdf`;

    // Generate PDF
    const pdfUrl = generateWeeklyReportPdf(
      `Weekly Report for All Users - ${teamName}`,
      weekInfo,
      columns,
      tableData,
      fileName
    );

    // Open PDF in new window
    window.open(pdfUrl, "_blank");
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

  // Handle team change
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamId(e.target.value);
  };

  // Handle project filter change
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProjectId(value ? parseInt(value) : undefined);
  };

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
        <span>Weekly view for all users</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-md shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <button
              onClick={previousWeek}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
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
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                className="appearance-none border rounded-md p-1 pr-8 cursor-pointer border-gray-200"
                onChange={handleTeamChange}
                value={selectedTeamId}
              >
                {teams.map((team) => (
                  <option
                    key={team.id}
                    value={team.id}
                    className="dark:bg-slate-800 dark:text-white"
                  >
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                className="appearance-none border rounded-md p-1 pr-8 cursor-pointer border-gray-200"
                onChange={handleProjectChange}
                value={selectedProjectId || ""}
              >
                <option
                  value=""
                  className="dark:bg-slate-800 dark:text-white"
                >
                  All Projects
                </option>
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                    className="dark:bg-slate-800 dark:text-white"
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
                className="flex items-center border border-gray-200 cursor-pointer"
              >
                <DownloadIcon className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button
                onClick={exportToPdf}
                variant="outline"
                className="flex items-center border border-gray-200 cursor-pointer"
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
            <Table className="bg-slate-700">
              <TableHeader className="bg-slate-800">
                <TableRow>
                  <TableHead className="w-1/6">User</TableHead>
                  <TableHead className="w-1/6">Project</TableHead>
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
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    {/* Project rows for this user */}
                    {projects
                      .filter((project) => selectedProjectId === undefined || project.id === selectedProjectId)
                      .map((project) => (
                        <TableRow
                          key={`${user.id}-${project.id}`}
                          className="hover:bg-gray-50 dark:bg-slate-800"
                        >
                          <TableCell>{user.name}</TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <ProjectColorDot color={project.color} />
                              {project.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-blue-500 font-medium">
                            {getUserProjectTotal(user.id, project.id)}
                          </TableCell>
                          {currentWeek.map((day, dayIndex) => (
                            <TableCell
                              key={dayIndex}
                              className={day.dayName === "THU" ? "bg-amber-50 dark:bg-slate-900" : ""}
                            >
                              {getTimeForUserProjectAndDay(user.id, project.id, day.date)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}

                    {/* User total row */}
                    <TableRow className="bg-gray-50 dark:bg-slate-800">
                      <TableCell>{user.name}</TableCell>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-blue-500 font-bold">{getUserTotal(user.id)}</TableCell>
                      {currentWeek.map((day, dayIndex) => {
                        const dateString = day.date.toISOString().split("T")[0];
                        let entries = timeEntries.filter(
                          (entry) => entry.user_id === parseInt(user.id) && entry.date === dateString
                        );

                        if (selectedProjectId !== undefined) {
                          entries = entries.filter((entry) => entry.project_id === selectedProjectId);
                        }

                        const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);

                        return (
                          <TableCell
                            key={dayIndex}
                            className={`${day.dayName === "THU" ? "bg-amber-50 dark:bg-slate-900" : ""} font-bold`}
                          >
                            {formatDuration(totalDuration)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </React.Fragment>
                ))}

                {/* Grand total row */}
                <TableRow className="font-bold bg-gray-100 dark:bg-slate-900">
                  <TableCell>All Users</TableCell>
                  <TableCell>Grand Total</TableCell>
                  <TableCell className="text-blue-500">{getGrandTotal()}</TableCell>
                  {currentWeek.map((day, dayIndex) => {
                    const dateString = day.date.toISOString().split("T")[0];
                    let entries = timeEntries.filter((entry) => entry.date === dateString);

                    if (selectedProjectId !== undefined) {
                      entries = entries.filter((entry) => entry.project_id === selectedProjectId);
                    }

                    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);

                    return (
                      <TableCell
                        key={dayIndex}
                        className={day.dayName === "THU" ? "bg-amber-50 dark:bg-slate-900" : ""}
                      >
                        {formatDuration(totalDuration)}
                      </TableCell>
                    );
                  })}
                </TableRow>
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

export default AuthenticatedRoute(WeeklyAllUsersReport, []);
