"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllCustomers } from "@/api/customer.api";
import { filterInvoices } from "@/api/invoice.api";
import { getAllProjects } from "@/api/project.api";
import ActivityViewDialog from "@/app/(pages)/activity/activity-view-dialog";
import InvoicePreviewDialog from "@/app/(pages)/invoice/invoice-preview-dialog";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleErrorApi } from "@/lib/utils";
import { ActivityType } from "@/type_schema/activity";
import { CustomerType } from "@/type_schema/customer";
import {
  FilterInvoiceRequestSchema,
  FilterInvoiceValidation,
  InvoiceHistoryType,
  InvoiceType
} from "@/type_schema/invoice";
import { ProjectType } from "@/type_schema/project";
import { Role } from "@/type_schema/role";
import { useUser } from "@auth0/nextjs-auth0/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { Eye, MoreHorizontal, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

function InvoiceContent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);

  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceHistoryType | null>(null);

  const [customerList, setCustomerList] = useState<CustomerType[]>([]);
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const [activityList, setActivityList] = useState<ActivityType[]>([]);

  const router = useRouter();
  const { user: currentUser } = useUser();

  const activityOptions = activityList.map((activity) => ({
    label: `${activity.name}`,
    value: activity.id.toString(),
    icon: Star
  }));

  const filterInvoiceForm = useForm<FilterInvoiceValidation>({
    resolver: zodResolver(FilterInvoiceRequestSchema),
    defaultValues: {
      from: "",
      to: "",
      customer_id: "",
      project_id: "",
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
      const response = await filterInvoices(payload);
      setSelectedInvoice({
        project: projectList.find((project) => project.id === payload.project_id)!,
        activities: payload.activities.map(
          (activityId) => activityList.find((activity) => activity.id === activityId)!
        ),
        customer: customerList.find((customer) => customer.id === payload.customer_id)!
      });
      console.log(activityList);
      const exportableInvoices: InvoiceHistoryType = {
        id: customerList.find((customer) => customer.id === payload.customer_id)!.id.toString(),
        customer: customerList.find((customer) => customer.id === payload.customer_id)!,
        date: formatDate(new Date(), "dd.MM.yyyy"),
        dueDate: new Date().toISOString(),
        status: "NEW",
        totalPrice: `${Math.round(Math.random() * 4000) + 1000}`,
        currency: "$",
        notes: "No notes",
        createdBy: currentUser!.sub!,
        createdAt: new Date(2025, 4, 7).toISOString(),
        items: activityList.map((activity) => ({
          description: activity.name,
          quantity: Math.round(Math.random() * 20 + 5),
          unitPrice: Math.round(activity.budget / (activity?.quota ? Number(activity.quota) : Math.random() * 90 + 10)),
          taxRate: 0.1,
          date: new Date().toISOString()
        }))
      };
      localStorage.setItem("invoiceHistory", JSON.stringify(exportableInvoices));
      setInvoiceHistory(exportableInvoices);
      if (response == 201 || response == 200) {
        toast("Success", {
          description: "Add new customer successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
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
        setError: filterInvoiceForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  // Handle save invoice status
  const handleSaveInvoice = () => {
    const invoiceHistories = JSON.parse(localStorage.getItem("invoiceHistoryList") || "[]") as InvoiceHistoryType[];
    invoiceHistories.push(invoiceHistory!);
    localStorage.setItem("invoiceHistoryList", JSON.stringify(invoiceHistories));
    router.push("/invoice-history");
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
      const projects = await getAllProjects(undefined, undefined, undefined, undefined, undefined, customerId);
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

  useEffect(() => {
    fetchCustomerData();
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
          <h2 className="text-lg font-medium">Filter invoice data</h2>
        </div>

        <Form {...filterInvoiceForm}>
          <form
            onSubmit={filterInvoiceForm.handleSubmit(handleSubmitFilterInvoice)}
            className="p-2 md:p-4 border border-gray-200 rounded-md mx-20"
            noValidate
          >
            <div className="grid grid-cols-6 gap-4 pb-3 items-start">
              {/* Name and Color */}
              {/* <FormField
                control={filterInvoiceForm.control}
                name="start"
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
              />  */}
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
                    <FormControl>
                      {projectList.length > 0 ? (
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
                      ) : (
                        <p className="text-center text-sm">No projects were found</p>
                      )}
                    </FormControl>
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
                    <FormControl>
                      {activityList.length > 0 ? (
                        <MultiSelect
                          options={activityOptions}
                          onValueChange={handleSelectActivities}
                          value={field.value}
                          placeholder="Select activities"
                          variant="secondary"
                          className="border border-gray-200 cursor-pointer"
                        />
                      ) : (
                        <p className="text-center text-sm">No activities were found</p>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 cursor-pointer text-white"
            >
              Filter
            </Button>
          </form>
        </Form>

        {/* Results Section */}

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">Preview</h2>
          {selectedInvoice && selectedInvoice.activities && selectedInvoice.activities.length > 0 && (
            <div className="flex justify-end gap-3">
              <InvoicePreviewDialog invoice={invoiceHistory!}>
                <Button
                  variant="outline"
                  className=" cursor-pointer text-sky-600 dark:text-sky-400"
                >
                  Preview
                </Button>
              </InvoicePreviewDialog>
              <Button
                onClick={handleSaveInvoice}
                className="bg-lime-500 hover:bg-lime-600 cursor-pointer text-white"
              >
                Export
              </Button>
            </div>
          )}
          <div className="rounded-md border bg-white dark:bg-slate-900 my-5">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Budget</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Project</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice &&
                  selectedInvoice.activities.map((activity, index) => (
                    <tr
                      key={index}
                      className={`border-t dark:border-slate-700 `}
                    >
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: activity.color || "#FF5733" }}
                          ></div>
                          <span className="ml-2">{activity.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.budget}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{activity.project.name}</td>
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
                            <ActivityViewDialog activity={activity}>
                              <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                                <Eye size={14} /> Show
                              </div>
                            </ActivityViewDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                {(!selectedInvoice || !selectedInvoice?.activities?.length) && (
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

          {/* {filteredInvoices.length >= 0 && (
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Duration
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-3 w-3 rounded-full mr-2 ${invoice.customer}`}></div>
                            <div className="text-sm font-medium text-gray-900">{invoice.customer}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {Math.floor(Math.random() * 200) + 1}.{Math.floor(Math.random() * 60)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {invoice.totalPrice} {invoice.currency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                          onClick={() => handlePreviewInvoice(invoice.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Preview
                        </button>
                        {saveSuccess === invoice.id ? (
                          <span className="text-green-600 px-3 py-1">Saved ✓</span>
                        ) : (
                          <button
                            onClick={() => handleSaveInvoice(invoice.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No invoices found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

// export function Invoice() {
//   const [isClientSide, setIsClientSide] = useState(false);

//   useEffect(() => {
//     setIsClientSide(true);
//   }, []);

//   if (!isClientSide) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <DatabaseProvider>
//       <InvoiceContent />
//     </DatabaseProvider>
//   );
// }

// Sử dụng AuthenticatedRoute như một Higher-Order Component
const AuthenticatedInvoice = AuthenticatedRoute(InvoiceContent, [Role.ADMIN, Role.SUPER_ADMIN, Role.TEAM_LEAD]);

export default AuthenticatedInvoice;
