"use client";

import { updateInvoiceStatus } from "@/api/invoice.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/utils";
import { InvoiceHistoryType, UpdateInvoiceRequestDTO, UpdateInvoiceRequestSchema } from "@/type_schema/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const statusList = [
  { name: "New", value: "NEW" },
  // { name: "Pending", value: "PENDING" },
  { name: "Paid", value: "PAID" },
  { name: "Cancelled", value: "CANCELLED" }
];

export default function InvoiceStatusUpdateDialog({
  children,
  targetInvoice,
  refetchData
}: {
  children: React.ReactNode;
  targetInvoice: InvoiceHistoryType;
  refetchData: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateInvoiceStatusForm = useForm<UpdateInvoiceRequestDTO>({
    resolver: zodResolver(UpdateInvoiceRequestSchema),
    defaultValues: {
      comment: "",
      status: "PAID"
    }
  });
  async function onSubmit(values: UpdateInvoiceRequestDTO) {
    if (loading) return;
    setLoading(true);
    try {
      const response = await updateInvoiceStatus(values, targetInvoice.id);

      if (response == 200) {
        toast("Success", {
          description: "Update invoice status successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        refetchData();
        updateInvoiceStatusForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to update invoice status. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: updateInvoiceStatusForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-h-[90vh] w-[34rem] overflow-y-auto border border-gray-200 !block space-y-1">
          <DialogHeader>
            <DialogTitle>Update status</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...updateInvoiceStatusForm}>
              <form
                onSubmit={updateInvoiceStatusForm.handleSubmit(onSubmit)}
                className="p-2 md:p-4 mt-2 border border-gray-200 rounded-lg"
                noValidate
              >
                <div className="grid grid-cols-12 gap-4 mb-3 items-start">
                  {/* Name and Color */}
                  <FormField
                    control={updateInvoiceStatusForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description"
                            rows={3}
                            className="!mt-0 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={updateInvoiceStatusForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full !mt-0 border-gray-200">
                                <SelectValue
                                  placeholder="Select invoice status"
                                  defaultValue={field.value}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusList.map((status, index) => (
                                <SelectItem
                                  key={index}
                                  value={status.value}
                                  className="flex items-center gap-1"
                                >
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <Button
                    type="submit"
                    className="mt-2 bg-main cursor-pointer text-white"
                  >
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
