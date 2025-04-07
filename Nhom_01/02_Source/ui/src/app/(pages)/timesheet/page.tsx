"use client";

import { useState } from "react";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";
import { TimesheetList } from "./components/timesheet-list";
import { TimesheetCreateDialog } from "./components/timesheet-create-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Search, FileDown, Upload, Play, Square } from "lucide-react";
import { Timesheet } from "@/type_schema/timesheet";

// Mock data for timesheets
const mockTimesheets: Timesheet[] = [
  {
    id: "1",
    description: "Working on UI components",
    start_time: new Date("2025-04-04T08:30:00"),
    end_time: new Date("2025-04-04T12:45:00"),
    duration: 15300, // 4 hours, 15 minutes
    user_id: "user123",
    user_name: "John Doe",
    project: "Kimai Clone",
    activity: "Development",
    billable: true,
    tags: ["UI", "Frontend"],
    status: "stopped",
    created_at: new Date("2025-04-04T08:30:00"),
    updated_at: new Date("2025-04-04T12:45:00")
  },
  {
    id: "2",
    description: "Team meeting",
    start_time: new Date("2025-04-04T13:00:00"),
    end_time: new Date("2025-04-04T14:00:00"),
    duration: 3600, // 1 hour
    user_id: "user123",
    user_name: "John Doe",
    project: "Kimai Clone",
    activity: "Meeting",
    billable: false,
    tags: ["Meeting", "Planning"],
    status: "stopped",
    created_at: new Date("2025-04-04T13:00:00"),
    updated_at: new Date("2025-04-04T14:00:00")
  },
  {
    id: "3",
    description: "API integration",
    start_time: new Date("2025-04-04T14:30:00"),
    end_time: new Date("2025-04-04T17:45:00"),
    duration: 11700, // 3 hours, 15 minutes
    user_id: "user123",
    user_name: "John Doe",
    project: "Kimai Clone",
    activity: "Development",
    billable: true,
    tags: ["API", "Backend"],
    status: "stopped",
    created_at: new Date("2025-04-04T14:30:00"),
    updated_at: new Date("2025-04-04T17:45:00")
  },
  {
    id: "4",
    description: "Documentation",
    start_time: new Date("2025-04-05T09:00:00"),
    end_time: new Date("2025-04-05T11:30:00"),
    duration: 9000, // 2 hours, 30 minutes
    user_id: "user456",
    user_name: "Jane Smith",
    project: "Kimai Clone",
    activity: "Documentation",
    billable: true,
    tags: ["Docs"],
    status: "stopped",
    created_at: new Date("2025-04-05T09:00:00"),
    updated_at: new Date("2025-04-05T11:30:00")
  },
  {
    id: "5",
    description: "Bug fixing",
    start_time: new Date("2025-04-05T13:00:00"),
    end_time: null, // Currently running
    duration: null,
    user_id: "user123",
    user_name: "John Doe",
    project: "Kimai Clone",
    activity: "Development",
    billable: true,
    tags: ["Bugs", "Fixes"],
    status: "running",
    created_at: new Date("2025-04-05T13:00:00"),
    updated_at: new Date("2025-04-05T13:00:00")
  }
];

function Timesheet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [timesheets, setTimesheets] = useState<Timesheet[]>(mockTimesheets);
  const itemsPerPage = 5;

  // Current user ID (would come from auth context in a real app)
  const currentUserId = "user123";

  // Filter timesheets based on search term
  const filteredTimesheets = timesheets.filter(
    (timesheet) =>
      timesheet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.activity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle timesheet creation
  const handleCreateTimesheet = (timesheetData: any) => {
    const newTimesheet: Timesheet = {
      id: (timesheets.length + 1).toString(),
      description: timesheetData.description,
      start_time: timesheetData.start_time,
      end_time: timesheetData.end_time,
      duration: timesheetData.end_time
        ? Math.floor((timesheetData.end_time.getTime() - timesheetData.start_time.getTime()) / 1000)
        : null,
      user_id: currentUserId,
      user_name: "John Doe", // Would come from user service
      project: timesheetData.project,
      activity: timesheetData.activity,
      billable: timesheetData.billable,
      tags: timesheetData.tags,
      status: timesheetData.end_time ? "stopped" : "running",
      created_at: new Date(),
      updated_at: new Date()
    };

    setTimesheets([...timesheets, newTimesheet]);
  };

  // Handle starting a new timesheet
  const handleStartTimesheet = (userId: string) => {
    // Check if there's already a running timesheet
    const hasRunningTimesheet = timesheets.some((timesheet) => timesheet.user_id === userId && !timesheet.end_time);

    if (hasRunningTimesheet) {
      alert("You already have a running timesheet. Please stop it before starting a new one.");
      return;
    }

    // Create a new running timesheet
    const newTimesheet: Timesheet = {
      id: (timesheets.length + 1).toString(),
      description: "New timesheet",
      start_time: new Date(),
      end_time: null,
      duration: null,
      user_id: userId,
      user_name: "John Doe", // Would come from user service
      project: "Kimai Clone",
      activity: "Development",
      billable: true,
      tags: [],
      status: "running",
      created_at: new Date(),
      updated_at: new Date()
    };

    setTimesheets([...timesheets, newTimesheet]);
  };

  // Handle ending a running timesheet
  const handleEndTimesheet = (userId: string) => {
    const updatedTimesheets = timesheets.map((timesheet) => {
      if (timesheet.user_id === userId && !timesheet.end_time) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - timesheet.start_time.getTime()) / 1000);
        return {
          ...timesheet,
          end_time: endTime,
          duration: duration,
          status: "stopped",
          updated_at: endTime
        };
      }
      return timesheet;
    });

    setTimesheets(updatedTimesheets);
  };

  // Check if the current user has a running timesheet
  const hasRunningTimesheet = timesheets.some(
    (timesheet) => timesheet.user_id === currentUserId && !timesheet.end_time
  );

  return (
    <div className="container mx-auto py-6 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Timesheets</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
          >
            <Filter className="h-4 w-4" />
          </Button>
          {hasRunningTimesheet ? (
            <Button
              onClick={() => handleEndTimesheet(currentUserId)}
              className="flex items-center bg-red-500 hover:bg-red-600"
            >
              <Square className="mr-2 h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button
              onClick={() => handleStartTimesheet(currentUserId)}
              className="flex items-center bg-green-500 hover:bg-green-600"
            >
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
          )}
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
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

      {/* Timesheet list with pagination */}
      <TimesheetList
        timesheets={filteredTimesheets}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onStartTimesheet={handleStartTimesheet}
        onEndTimesheet={handleEndTimesheet}
        currentUserId={currentUserId}
      />

      {/* Create timesheet dialog */}
      <TimesheetCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateTimesheet={handleCreateTimesheet}
      />
    </div>
  );
}

export default AuthenticatedRoute(Timesheet, [Role.SUPER_ADMIN, Role.ADMIN]);
