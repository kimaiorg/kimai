"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllCustomers } from "@/api/customer.api";
import { filterInvoices, getAllInvoiceTemplates, saveInvoice } from "@/api/invoice.api";
import { getAllProjects } from "@/api/project.api";
import { getInvoiceTemplateFormatIcon } from "@/app/(pages)/invoice-template/page";
import InvoiceActivityViewDialog from "@/app/(pages)/invoice/invoice-activity-view-dialog";
import InvoicePreviewDialog from "@/app/(pages)/invoice/invoice-preview-dialog";
import { periods } from "@/app/(pages)/invoice/period";
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
  InvoiceHistoryType,
  InvoiceTemplateType
} from "@/type_schema/invoice";
import { ProjectType } from "@/type_schema/project";
import { Role } from "@/type_schema/role";
import { TaskType } from "@/type_schema/task";
import { useUser } from "@auth0/nextjs-auth0/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, FileCheck, MoreHorizontal, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

function InvoiceContent() {
  const [loading, setLoading] = useState<boolean>(false);

  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistoryType | null>(null);

  const [customerList, setCustomerList] = useState<CustomerType[]>([]);
  const [projectList, setProjectList] = useState<ProjectType[] | null>(null);
  const [activityList, setActivityList] = useState<ActivityType[] | null>(null);
  const [invoiceTemplateList, setInvoiceTemplateList] = useState<InvoiceTemplateType[] | null>(null);
  const [invoiceTemplateId, setInvoiceTemplateId] = useState<number>(1);

  const router = useRouter();
  const { user: currentUser } = useUser();

  const activityOptions = (activityList || []).map((activity) => ({
    label: `${activity.name}`,
    value: activity.id.toString(),
    icon: Star
  }));

  const filterInvoiceForm = useForm<FilterInvoiceValidation>({
    resolver: zodResolver(FilterInvoiceRequestSchema),
    defaultValues: {
      from: "",
      to: "",
      customer_id: "9",
      project_id: "16",
      period: "",
      activities: []
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
      const response: InvoiceHistoryType = await filterInvoices(payload);
      console.log(response);
      const exportableInvoices: InvoiceHistoryType = {
        id: customerList.find((customer) => customer.id === payload.customer_id)!.id.toString(),
        customer: customerList.find((customer) => customer.id === payload.customer_id)!,
        project: (projectList || []).find((project) => project.id === payload.project_id)!,
        fromDate: values.from,
        toDate: values.to,
        status: "NEW",
        totalPrice: Math.round(Math.random() * 40000) + 5000,
        taxRate: 10,
        taxPrice: Math.round(Math.random() * 100),
        finalPrice: Math.round(Math.random() * 40000) + 10000,
        currency: "USD",
        notes: "",
        createdBy: currentUser!.sub!,
        createdAt: new Date(2025, 4, 7).toISOString(),
        template: invoiceTemplateList!.find((template) => template.id === invoiceTemplateId)!,
        activities: (activityList || []).map((activity) => ({
          ...activity,
          tasks: fakeTaskData(),
          totalPrice: Math.round(Math.random() * 10000) + 10000
        }))
      };
      setInvoiceHistory(exportableInvoices);
      if (response.hasOwnProperty("id")) {
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
        customerId: Number(invoiceHistory!.id),
        projectId: invoiceHistory!.project!.id,
        fromDate: invoiceHistory!.fromDate,
        toDate: invoiceHistory!.toDate,
        status: invoiceHistory!.status,
        totalPrice: invoiceHistory!.totalPrice,
        taxRate: invoiceHistory!.taxRate,
        taxPrice: invoiceHistory!.taxPrice,
        finalPrice: invoiceHistory!.finalPrice,
        currency: invoiceHistory!.currency,
        notes: invoiceHistory!.notes,
        createdBy: invoiceHistory!.createdBy,
        createdAt: invoiceHistory!.createdAt,
        templateId: Number(invoiceHistory!.template.id),
        activities: invoiceHistory!.activities.map((activity) => {
          return {
            activityId: activity.id,
            totalPrice: activity.totalPrice,
            tasks: activity.tasks.map((task) => task.id)
          };
        })
      };
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
      const customers = await getAllCustomers();
      setCustomerList(customers.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchProjectData = async (customerId: number) => {
    try {
      const projects = await getAllProjects(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        customerId.toString()
      );
      setProjectList(projects.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  const fetchActivityData = async (projectId: string) => {
    try {
      const activities = await getAllActivities(undefined, undefined, undefined, undefined, undefined, projectId);
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

  const fetchInvoiceTemplates = async () => {
    try {
      const templates = await getAllInvoiceTemplates();
      setInvoiceTemplateList(templates.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchInvoiceTemplates();
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
                  <FormItem className="col-span-2">
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
                name="period"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Period time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full !mt-0 border border-gray-200">
                          <SelectValue placeholder="Select a period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border border-gray-200">
                        {periods.map((period, index) => (
                          <SelectItem
                            key={index}
                            value={period.value}
                          >
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={filterInvoiceForm.control}
                name="to"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                  invoiceHistory.activities.map((invoiceActivity, index) => (
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
                          <td className="px-4 py-2 text-center">{task.expense.quantity || "45"}</td>
                          <td className="px-4 py-2 text-center">
                            {currencyFormat(task.expense.cost, "USD") || "1235"}
                          </td>
                          <td className="text-center">
                            {currencyFormat(Number(task.expense.quantity) * Number(task.expense.cost), "USD")}
                          </td>
                          <td className="px-4 py-2 text-center"></td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                {invoiceHistory && invoiceHistory.activities && invoiceHistory.activities.length > 0 && (
                  <tr className={`border-gray-200 border`}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="px-4 py-2 text-end text-lg">Total:</td>
                    <td className="px-4 py-2 text-center text-[#6e44ff] font-semibold text-lg">
                      {currencyFormat(invoiceHistory!.totalPrice!, "USD")}
                    </td>
                    <td></td>
                  </tr>
                )}
                {(!invoiceHistory || !invoiceHistory?.activities?.length) && (
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

          {invoiceHistory && invoiceHistory.activities && invoiceHistory.activities.length > 0 && (
            <div className="pb-6 pt-1 space-y-4">
              <div className="flex flex-col gap-2">
                <Label className="text-md font-semibold">Template:</Label>
                {invoiceTemplateList && (
                  <Select
                    onValueChange={(e) => setInvoiceTemplateId(Number(e))}
                    value={invoiceTemplateId.toString()}
                  >
                    <SelectTrigger className="w-full !mt-0 border-gray-200">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceTemplateList.map((invoiceTemplate, index) => (
                        <SelectItem
                          key={index}
                          value={invoiceTemplate.id.toString()}
                          className="flex items-center gap-1"
                        >
                          <div className="flex items-center gap-2">
                            {getInvoiceTemplateFormatIcon(invoiceTemplate.format)}
                            <span>{invoiceTemplate.format}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
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
                  value={invoiceHistory?.notes || ""}
                  placeholder="Enter notes"
                  onChange={(e) => {
                    if (invoiceHistory) {
                      setInvoiceHistory({
                        ...invoiceHistory,
                        notes: e.target.value
                      });
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 py-3">
                <InvoicePreviewDialog invoice={invoiceHistory!}>
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

export default AuthenticatedInvoice;

function fakeTaskData(): TaskType[] {
  return [
    {
      id: 1,
      title: "Do something",
      color: "#FF5733",
      deadline: "string",
      created_at: "string",
      deleted_at: null,
      description: "string",
      updated_at: "string",
      activity: {
        id: 0,
        name: "",
        color: "",
        description: "",
        activity_number: 0,
        budget: 0,
        project_id: 0,
        created_at: "",
        updated_at: "",
        deleted_at: null,
        project: {
          id: 0,
          name: "",
          color: "",
          project_number: 0,
          order_number: 0,
          order_date: "",
          start_date: "",
          end_date: "",
          budget: 0,
          customer_id: 0,
          created_at: "",
          updated_at: "",
          deleted_at: null
        },
        team: {
          id: 0,
          name: "",
          color: "",
          created_at: "",
          updated_at: "",
          deleted_at: null,
          lead: "",
          users: []
        },
        tasks: []
      },
      expense: {
        id: 0,
        name: "",
        color: "",
        description: "",
        project_id: 0,
        project: {
          id: 0,
          name: "",
          color: "",
          project_number: 0,
          order_number: 0,
          order_date: "",
          start_date: "",
          end_date: "",
          budget: 0,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          teams: [],
          customer: {
            id: 0,
            name: "",
            color: "",
            description: "",
            address: "",
            company_name: "",
            account_number: "",
            vat_id: "",
            country: "",
            currency: "",
            timezone: "",
            email: "",
            phone: "",
            homepage: "",
            created_at: "",
            updated_at: "",
            deleted_at: null,
            projects: []
          }
        },
        activity: {
          id: 0,
          name: "",
          color: "",
          description: "",
          activity_number: 0,
          budget: 0,
          project_id: 0,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          project: {
            id: 0,
            name: "",
            color: "",
            project_number: 0,
            order_number: 0,
            order_date: "",
            start_date: "",
            end_date: "",
            budget: 0,
            customer_id: 0,
            created_at: "",
            updated_at: "",
            deleted_at: null
          },
          team: {
            id: 0,
            name: "",
            color: "",
            created_at: "",
            updated_at: "",
            deleted_at: null,
            lead: "",
            users: []
          },
          tasks: [],
          quota: undefined
        },
        category: {
          id: 0,
          name: "",
          color: "",
          description: "",
          created_at: "",
          updated_at: "",
          deleted_at: null
        },
        quantity: 10,
        cost: 1000,
        created_at: "",
        updated_at: "",
        deleted_at: null,
        task: []
      },
      user: {
        created_at: "",
        user_id: "auth0|67d991b80f7916d942e25d1d",
        email: "",
        picture: "",
        name: "",
        nickname: "",
        email_verified: false,
        updated_at: ""
      },
      status: "string",
      billable: true
    },
    {
      id: 2,
      title: "Research something",
      color: "#DC143C",
      deadline: "string",
      created_at: "string",
      deleted_at: null,
      description: "string",
      updated_at: "string",
      activity: {
        id: 0,
        name: "",
        color: "",
        description: "",
        activity_number: 0,
        budget: 0,
        project_id: 0,
        created_at: "",
        updated_at: "",
        deleted_at: null,
        project: {
          id: 0,
          name: "",
          color: "",
          project_number: 0,
          order_number: 0,
          order_date: "",
          start_date: "",
          end_date: "",
          budget: 0,
          customer_id: 0,
          created_at: "",
          updated_at: "",
          deleted_at: null
        },
        team: {
          id: 0,
          name: "",
          color: "",
          created_at: "",
          updated_at: "",
          deleted_at: null,
          lead: "",
          users: []
        },
        tasks: []
      },
      expense: {
        id: 0,
        name: "",
        color: "",
        description: "",
        project_id: 0,
        project: {
          id: 0,
          name: "",
          color: "",
          project_number: 0,
          order_number: 0,
          order_date: "",
          start_date: "",
          end_date: "",
          budget: 0,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          teams: [],
          customer: {
            id: 0,
            name: "",
            color: "",
            description: "",
            address: "",
            company_name: "",
            account_number: "",
            vat_id: "",
            country: "",
            currency: "",
            timezone: "",
            email: "",
            phone: "",
            homepage: "",
            created_at: "",
            updated_at: "",
            deleted_at: null,
            projects: []
          }
        },
        activity: {
          id: 0,
          name: "",
          color: "",
          description: "",
          activity_number: 0,
          budget: 0,
          project_id: 0,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          project: {
            id: 0,
            name: "",
            color: "",
            project_number: 0,
            order_number: 0,
            order_date: "",
            start_date: "",
            end_date: "",
            budget: 0,
            customer_id: 0,
            created_at: "",
            updated_at: "",
            deleted_at: null
          },
          team: {
            id: 0,
            name: "",
            color: "",
            created_at: "",
            updated_at: "",
            deleted_at: null,
            lead: "",
            users: []
          },
          tasks: [],
          quota: undefined
        },
        category: {
          id: 0,
          name: "",
          color: "",
          description: "",
          created_at: "",
          updated_at: "",
          deleted_at: null
        },
        quantity: 32,
        cost: 1500,
        created_at: "",
        updated_at: "",
        deleted_at: null,
        task: []
      },
      user: {
        created_at: "",
        user_id: "auth0|67d991b80f7916d942e25d1d",
        email: "",
        picture: "",
        name: "",
        nickname: "",
        email_verified: false,
        updated_at: ""
      },
      status: "string",
      billable: true
    }
  ];
}
