"use client";

import { useState } from "react";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";
import { ProjectList } from "./components/project-list";
import { ProjectCreateDialog } from "./components/project-create-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Search, FileDown, Upload } from "lucide-react";
import { Project } from "@/type_schema/project";

// Mock data for projects
const mockProjects: Project[] = [
    {
        id: "1",
        name: "Project Alpha",
        color: "#FF5733",
        project_number: 101,
        order_number: 2023001,
        order_date: new Date("2025-03-23"),
        start_date: new Date("2025-04-01"),
        end_date: new Date("2025-12-31"),
        budget: 50000,
        teams: [1, 2, 3],
        customer: "Customer 1",
        visible: true,
        billable: true,
        createdAt: new Date("2023-01-01")
    },
    {
        id: "2",
        name: "Project Beta",
        color: "#33FF57",
        project_number: 102,
        order_number: 2023002,
        order_date: new Date("2025-03-24"),
        start_date: new Date("2025-04-15"),
        end_date: new Date("2025-11-30"),
        budget: 75000,
        teams: [1, 3],
        customer: "Customer 2",
        visible: false,
        billable: true,
        createdAt: new Date("2023-01-02")
    },
    {
        id: "3",
        name: "Project Gamma",
        color: "#3357FF",
        project_number: 103,
        order_number: 2023003,
        order_date: new Date("2025-03-25"),
        start_date: new Date("2025-05-01"),
        end_date: new Date("2026-01-31"),
        budget: 100000,
        teams: [2],
        customer: "Customer 3",
        visible: true,
        billable: false,
        createdAt: new Date("2023-01-03")
    },
    {
        id: "4",
        name: "Project Delta",
        color: "#FF33A8",
        project_number: 104,
        order_number: 2023004,
        start_date: new Date("2025-06-01"),
        end_date: new Date("2026-03-31"),
        budget: 125000,
        teams: [1, 2, 3],
        customer: "Customer 4",
        visible: true,
        billable: true,
        createdAt: new Date("2023-01-04")
    },
    {
        id: "5",
        name: "Project Epsilon",
        color: "#33FFF1",
        project_number: 105,
        order_number: 2023005,
        start_date: new Date("2025-07-01"),
        budget: 80000,
        teams: [2, 3],
        customer: "Customer 5",
        visible: false,
        billable: true,
        createdAt: new Date("2023-01-05")
    }
];

function ProjectPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const itemsPerPage = 5;

    // Filter projects based on search term
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total pages for pagination
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle project creation
    const handleCreateProject = (projectData: any) => {
        const newProject: Project = {
            id: (projects.length + 1).toString(),
            name: projectData.name,
            color: projectData.color,
            project_number: projectData.project_number ? Number(projectData.project_number) : undefined,
            order_number: projectData.order_number ? Number(projectData.order_number) : undefined,
            order_date: projectData.order_date ? new Date(projectData.order_date) : undefined,
            start_date: projectData.start_date ? new Date(projectData.start_date) : undefined,
            end_date: projectData.end_date ? new Date(projectData.end_date) : undefined,
            budget: projectData.budget ? Number(projectData.budget) : undefined,
            teams: projectData.teams || [],
            customer: projectData.customer || "",
            visible: projectData.visible,
            billable: projectData.billable,
            description: projectData.description,
            createdAt: new Date()
        };

        setProjects([...projects, newProject]);
    };

    return (
        <div className="container mx-auto py-6 px-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
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

            {/* Project list with pagination */}
            <ProjectList
                projects={filteredProjects}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
            />

            {/* Create project dialog */}
            <ProjectCreateDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreateProject={handleCreateProject}
            />
        </div>
    );
}

export default AuthenticatedRoute(ProjectPage, [Role.SUPER_ADMIN, Role.ADMIN]);
