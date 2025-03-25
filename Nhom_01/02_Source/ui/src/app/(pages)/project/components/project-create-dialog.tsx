"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Define a type for the project form data
interface ProjectFormData {
  name: string;
  color: string;
  project_number: string;
  order_number: string;
  order_date: string;
  start_date: string;
  end_date: string;
  budget: string;
  teams: number[];
  customer: string;
  description: string;
  visible: boolean;
  billable: boolean;
}

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (projectData: ProjectFormData) => void;
}

export function ProjectCreateDialog({ open, onOpenChange, onCreateProject }: ProjectCreateDialogProps) {
  const [projectData, setProjectData] = useState<ProjectFormData>({
    name: "",
    color: "#FF5733",
    project_number: "",
    order_number: "",
    order_date: "",
    start_date: "",
    end_date: "",
    budget: "",
    teams: [] as number[],
    customer: "",
    description: "",
    visible: true,
    billable: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProjectData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateProject(projectData);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Name and Color */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                type="color"
                className="h-10"
                value={projectData.color}
                onChange={handleInputChange}
              />
            </div>

            {/* Project Number and Order Number */}
            <div className="space-y-2">
              <Label htmlFor="project_number">Project Number</Label>
              <Input
                id="project_number"
                name="project_number"
                type="number"
                value={projectData.project_number}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_number">Order Number</Label>
              <Input
                id="order_number"
                name="order_number"
                type="number"
                value={projectData.order_number}
                onChange={handleInputChange}
              />
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <Label htmlFor="order_date">Order Date</Label>
              <Input
                id="order_date"
                name="order_date"
                type="date"
                value={projectData.order_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={projectData.start_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={projectData.end_date}
                onChange={handleInputChange}
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={projectData.budget}
                onChange={handleInputChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Customer */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("customer", value)}
                value={projectData.customer.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">Customer 1</SelectItem>
                  <SelectItem value="102">Customer 2</SelectItem>
                  <SelectItem value="103">Customer 3</SelectItem>
                  <SelectItem value="104">Customer 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Teams */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="teams">Teams</Label>
              <Select
                onValueChange={(value: string) => {
                  const teamId = parseInt(value);
                  setProjectData((prev) => ({
                    ...prev,
                    teams: prev.teams.includes(teamId)
                      ? prev.teams.filter((id) => id !== teamId)
                      : [...prev.teams, teamId]
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Team 1</SelectItem>
                  <SelectItem value="2">Team 2</SelectItem>
                  <SelectItem value="3">Team 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {projectData.teams.map((teamId) => (
                  <div
                    key={teamId}
                    className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center"
                  >
                    Team {teamId}
                    <button
                      type="button"
                      className="ml-1 text-primary hover:text-primary/80"
                      onClick={() => {
                        setProjectData((prev) => ({
                          ...prev,
                          teams: prev.teams.filter((id) => id !== teamId)
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Visible</Label>
              <Switch
                id="visible"
                checked={projectData.visible}
                onCheckedChange={(checked: boolean) => handleSwitchChange("visible", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="billable">Billable</Label>
              <Switch
                id="billable"
                checked={projectData.billable}
                onCheckedChange={(checked: boolean) => handleSwitchChange("billable", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
