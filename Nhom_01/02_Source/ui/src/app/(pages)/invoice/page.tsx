"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllCustomers } from "@/api/customer.api";
import { filterInvoices, saveInvoice } from "@/api/invoice.api";
import { getAllProjects } from "@/api/project.api";
import InvoiceActivityViewDialog from "@/app/(pages)/invoice/invoice-activity-view-dialog";
import InvoicePreviewDialog from "@/app/(pages)/invoice/invoice-preview-dialog";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { currencyFormat, handleErrorApi } from "@/lib/utils";
import { ActivityType } from "@/type_schema/activity";
import { CustomerType } from "@/type_schema/customer";
import {
  FilterInvoiceRequestSchema,
  FilterInvoiceValidation,
  InvoiceHistoryRequestType,
  InvoiceHistoryResponseType
} from "@/type_schema/invoice";
import { ProjectType } from "@/type_schema/project";
import { Role } from "@/type_schema/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, FileCheck, MoreHorizontal, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

function InvoiceContent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [noteInput, setNoteInput] = useState<string>("No note");

  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistoryResponseType | null>(null);

  const [customerList, setCustomerList] = useState<CustomerType[]>([]);
  const [projectList, setProjectList] = useState<ProjectType[] | null>(null);
  const [activityList, setActivityList] = useState<ActivityType[] | null>(null);

  const router = useRouter();

  const activityOptions = (activityList || []).map((activity) => ({
    label: `${activity.name}`,
    value: activity.id.toString(),
    icon: Star
  }));

  const filterInvoiceForm = useForm<FilterInvoiceValidation>({
    resolver: zodResolver(FilterInvoiceRequestSchema),
    defaultValues: {
      from: "2025-04-01",
      to: "2025-07-01",
      customer_id: "99",
      project_id: "129",
      activities: ["160", "148"]
    }
  });
  async function handleSubmitFilterInvoice(values: FilterInvoiceValidation) {
    if (loading) return;
    setLoading(true);
    try {
      const { customer_id, project_id, activities, ...rest } = values;
      const payload = {
        ...rest,
        customer_id: Number(customer_id),
        project_id: Number(project_id),
        activities: activities.map((activity) => Number(activity))
      };
      const targetInvoice: InvoiceHistoryResponseType = await filterInvoices(payload);

      setInvoiceHistory(targetInvoice);
      if (targetInvoice.success) {
        toast("Success", {
          description: "Filter invoice successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
      } else {
        toast("Failed", {
          description: "Failed to filter invoice. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: filterInvoiceForm.setError
      });
    } finally {
      setLoading(false);
    }
  }
  // Handle save invoice status
  const handleSaveInvoice = async () => {
    try {
      const payload: InvoiceHistoryRequestType = {
        filteredInvoiceId: invoiceHistory!.filteredInvoiceId!,
        userId: invoiceHistory!.data.customer.id.toString(),
        comment: noteInput,
        dueDays: 30
      };
      // console.log(payload);
      const result = await saveInvoice(payload);
      if (result == 201 || result == 200) {
        toast("Success", {
          description: "Invoice saved successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        router.push("/invoice-history");
      } else {
        toast("Failed", {
          description: "Failed to save invoice. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      toast("Error", {
        description: "Failed to save invoice. Please try again!",
        duration: 2000,
        className: "!bg-red-500 !text-white"
      });
    }
  };

  const fetchCustomerData = async () => {
    try {
      const customers = await getAllCustomers(1, 200);
      setCustomerList(customers.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchProjectData = async (customerId: number) => {
    try {
      const projects = await getAllProjects(1, 111, undefined, undefined, undefined, customerId.toString());
      setProjectList(projects.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  const fetchActivityData = async (projectId: string) => {
    try {
      const activities = await getAllActivities(1, 100, undefined, undefined, undefined, projectId);
      setActivityList(activities.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };
  const selectedCustomerId = useWatch({
    control: filterInvoiceForm.control,
    name: "customer_id"
  });

  const selectedProjectId = useWatch({
    control: filterInvoiceForm.control,
    name: "project_id"
  });

  // const fetchInvoiceTemplates = async () => {
  //   try {
  //     const templates = await getAllInvoiceTemplates();
  //     setInvoiceTemplateList(templates.data);
  //   } catch (error) {
  //     console.error("Error fetching templates:", error);
  //   }
  // };

  useEffect(() => {
    fetchCustomerData();
    // fetchInvoiceTemplates();
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) return;
    fetchProjectData(Number(selectedCustomerId));
  }, [selectedCustomerId]);

  useEffect(() => {
    if (!selectedProjectId) return;
    fetchActivityData(selectedProjectId);
  }, [selectedProjectId]);

  function handleSelectActivities(activityIds: string[]): void {
    filterInvoiceForm.setValue("activities", [...activityIds]);
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 rounded-md p-4">
        <div className="pb-3">
          <h2 className="text-lg font-medium">Create invoice</h2>
        </div>

        <Form {...filterInvoiceForm}>
          <form
            onSubmit={filterInvoiceForm.handleSubmit(handleSubmitFilterInvoice)}
            className="p-2 md:p-4 border border-gray-200 rounded-md lg:mx-20"
            noValidate
          >
            <div className="grid grid-cols-6 gap-4 pb-3 items-start">
              <FormField
                control={filterInvoiceForm.control}
                name="from"
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
                control={filterInvoiceForm.control}
                name="to"
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

              <FormField
                control={filterInvoiceForm.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      {customerList.length > 0 ? (
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <SelectTrigger className="!mt-0 border border-gray-200 rounded-md w-full">
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
                      ) : (
                        <p className="text-center text-sm">No customers were found</p>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={filterInvoiceForm.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Project</FormLabel>
                    {!projectList && <p className="text-center text-sm">Please select a customer</p>}
                    <FormControl>
                      {projectList && projectList.length > 0 && (
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <SelectTrigger className="w-full !mt-0 border rounded-md border-gray-200">
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectList.map((project, index) => (
                              <SelectItem
                                key={index}
                                value={project.id.toString()}
                              >
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    {projectList && projectList.length === 0 && (
                      <p className="text-center text-sm">No projects were found</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={filterInvoiceForm.control}
                name="activities"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Activities</FormLabel>
                    {!activityList && <p className="text-center text-sm">Please select a project</p>}
                    <FormControl>
                      {activityList && activityList.length > 0 && (
                        <MultiSelect
                          options={activityOptions}
                          onValueChange={handleSelectActivities}
                          value={field.value}
                          placeholder="Select activities"
                          variant="secondary"
                          className="border border-gray-200 cursor-pointer"
                        />
                      )}
                    </FormControl>
                    {activityList && activityList.length === 0 && (
                      <p className="text-center text-sm">No activities were found</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="bg-main cursor-pointer text-white"
            >
              Filter
            </Button>
          </form>
        </Form>

        {/* Results Section */}

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">Preview</h2>

          <div className="rounded-md border bg-white dark:bg-slate-900 my-5">
            <table className="w-full border-collapse rounded-md border border-gray-200">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">No.</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 ">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit price
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total price
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceHistory &&
                  invoiceHistory.data.activities!.map((invoiceActivity, index) => (
                    <Fragment key={index}>
                      <tr className={`border-t dark:border-slate-700 font-semibold text-md`}>
                        <td className="px-4 py-2 text-sm">{index + 1}</td>
                        <td className="px-2 py-2 text-sm">
                          <div className="flex items-center">
                            <Star
                              size={18}
                              style={{ fill: invoiceActivity.color }}
                            />
                            <span className="ml-2">{invoiceActivity.name}</span>
                          </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td className="px-4 py-2 text-center text-[#6e44ff]">
                          {currencyFormat(invoiceActivity.totalPrice, "USD") || "1235"}
                        </td>
                        <td className="px-4 py-2 text-center">
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
                              <InvoiceActivityViewDialog invoiceActivity={invoiceActivity}>
                                <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                                  <Eye size={14} /> Show
                                </div>
                              </InvoiceActivityViewDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      {invoiceActivity.tasks?.map((task, idx) => (
                        <tr
                          key={idx}
                          className={`border-t dark:border-slate-700 `}
                        >
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"></td>
                          <td className="px-5 py-2 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center">
                              <FileCheck
                                size={14}
                                style={{ color: task.color }}
                              />
                              <span className="ml-2">{task.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center">{task.quantity || "45"}</td>
                          <td className="px-4 py-2 text-center">{currencyFormat(task.price, "USD") || "1235"}</td>
                          <td className="text-center">{currencyFormat(Number(task.quantity) * task.price, "USD")}</td>
                          <td className="px-4 py-2 text-center"></td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                {invoiceHistory && invoiceHistory.data.activities && invoiceHistory.data.activities.length > 0 && (
                  <tr className={`border-gray-200 border`}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="px-4 py-2 text-end text-lg">Total:</td>
                    <td className="px-4 py-2 text-center text-[#6e44ff] font-semibold text-lg">
                      {currencyFormat(invoiceHistory!.data.totalPrice!, "USD")}
                    </td>
                    <td></td>
                  </tr>
                )}
                {(!invoiceHistory || !invoiceHistory?.data.activities?.length) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="border-t dark:border-slate-700 text-center py-1"
                    >
                      Please select an invoice
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {invoiceHistory && invoiceHistory.data.activities && invoiceHistory.data.activities.length > 0 && (
            <div className="pb-6 pt-1 space-y-4">
              <div className="flex flex-col gap-2">
                <Label
                  id="notes"
                  className="text-md font-semibold"
                >
                  Note:
                </Label>
                <Textarea
                  id="notes"
                  className="w-full border border-gray-200 rounded-md p-2"
                  rows={2}
                  value={noteInput}
                  placeholder="Enter notes"
                  onChange={(e) => {
                    setNoteInput(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 py-3">
                <InvoicePreviewDialog invoice={invoiceHistory!.data}>
                  <Button
                    variant="outline"
                    className="border border-gray-200 cursor-pointer text-[#6e44ff]"
                  >
                    Preview
                  </Button>
                </InvoicePreviewDialog>
                <Button
                  onClick={handleSaveInvoice}
                  className="bg-main cursor-pointer text-white"
                >
                  Export
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const AuthenticatedInvoice = AuthenticatedRoute(InvoiceContent, [Role.ADMIN, Role.SUPER_ADMIN, Role.TEAM_LEAD]);
export { InvoiceContent };
export default AuthenticatedInvoice;
