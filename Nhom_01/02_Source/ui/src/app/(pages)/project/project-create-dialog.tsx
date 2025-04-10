"use client";

import { getAllCustomers } from "@/api/customer.api";
import { addNewProject } from "@/api/project.api";
import { getAllTeams } from "@/api/team.api";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { handleErrorApi } from "@/lib/utils";
import { CustomerType } from "@/type_schema/customer";
import { CreateProjectRequestDTO, CreateProjectRequestSchema, CreateProjectValidation } from "@/type_schema/project";
import { TeamType } from "@/type_schema/team";
import { UserType } from "@/type_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ProjectCreateDialog({
  children,
  refetchProjects
}: {
  children: React.ReactNode;
  refetchProjects: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [customerList, setCustomerList] = useState<CustomerType[]>([]);
  const [teamList, setTeamList] = useState<TeamType[]>([]);
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];
  const [selectedTeams, setSelectedTeams] = useState<TeamType[]>([]);
  const teamOptions = teamList.map((team) => ({ label: `${team.name}`, value: team.id.toString(), icon: Users }));

  const createProjectForm = useForm<CreateProjectValidation>({
    resolver: zodResolver(CreateProjectRequestSchema),
    defaultValues: {
      name: "Project Alpha",
      color: "#FF5733",
      project_number: "101",
      order_number: "2023001",
      order_date: "2025-03-23",
      start_date: "2025-04-01",
      end_date: "2025-12-31",
      budget: "50000",
      customer_id: "1"
    }
  });

  async function handleSubmit(values: CreateProjectValidation) {
    if (!selectedTeams.length) {
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const { customer_id, project_number, order_number, budget, ...rest } = values;
      const payload: CreateProjectRequestDTO = {
        ...rest,
        project_number: Number(project_number),
        order_number: Number(order_number),
        customer: Number(customer_id),
        budget: Number(budget),
        teams: selectedTeams.map((team) => Number(team.id))
      };
      const response = await addNewProject(payload);

      if (response == 201) {
        toast("Success", {
          description: "Add new project successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        createProjectForm.reset();
        setOpen(false);
        refetchProjects();
      } else {
        toast("Failed", {
          description: "Failed to add customer. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: createProjectForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchCustomers = async () => {
      const result = await getAllCustomers();
      setCustomerList(result.data);
    };
    const fetchAllTeams = async () => {
      const result = await getAllTeams();
      const teams: TeamType[] = result.data.map((simpleTeam) => {
        const { users, lead, ...data } = simpleTeam;
        const userMembers = users.map((userId) => userList.find((user) => user.user_id == userId)) as UserType[];
        return {
          ...data,
          lead: userList.find((user) => user.user_id == lead)!,
          users: userMembers
        };
      });
      setTeamList(teams);
    };
    fetchCustomers();
    fetchAllTeams();
  }, []);

  function handleSelectTeam(teamIds: string[]): void {
    const chosenTeams = teamList.filter((team) => teamIds.includes(team.id.toString()));
    setSelectedTeams(chosenTeams);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogDescription></DialogDescription>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 select-none">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>

        <Form {...createProjectForm}>
          <form
            onSubmit={createProjectForm.handleSubmit(handleSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-6 gap-4 pb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={createProjectForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-5">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createProjectForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        className="h-10 !mt-0 border-gray-200 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Company Name and VAT ID */}
              <FormField
                control={createProjectForm.control}
                name="project_number"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Project number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter project number"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createProjectForm.control}
                name="order_number"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Order number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your order number"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Account Number */}
              <FormField
                control={createProjectForm.control}
                name="order_date"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Order date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createProjectForm.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createProjectForm.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {customerList && (
                <FormField
                  control={createProjectForm.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <SelectTrigger className="w-full !mt-0 border-gray-200">
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customerList.map((customer, index) => (
                              <SelectItem
                                key={index}
                                value={customer.id.toString()}
                              >
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={createProjectForm.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Budget</FormLabel>
                    <Input
                      type="number"
                      className="!mt-0 border-gray-200"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-6">
                <MultiSelect
                  options={teamOptions}
                  onValueChange={handleSelectTeam}
                  placeholder="Select teams"
                  variant="secondary"
                  className="border border-gray-200 cursor-pointer"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 cursor-pointer text-white"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
