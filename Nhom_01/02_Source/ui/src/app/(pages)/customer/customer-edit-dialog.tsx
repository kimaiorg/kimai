"use client";

import { updateCustomer } from "@/api/customer.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleErrorApi } from "@/lib/utils";
import { countries, currencies, timezones } from "@/type_schema/common";
import { CreateCustomerRequestSchema, CustomerType, UpdateCustomerRequestDTO } from "@/type_schema/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CustomerUpdateDialog({
  children,
  targetCustomer,
  fetchCustomers
}: {
  children: React.ReactNode;
  targetCustomer: CustomerType;
  fetchCustomers: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const updateCustomerForm = useForm<UpdateCustomerRequestDTO>({
    resolver: zodResolver(CreateCustomerRequestSchema),
    defaultValues: {
      name: targetCustomer.name,
      color: targetCustomer.color,
      description: targetCustomer.description,
      address: targetCustomer.address,
      company_name: targetCustomer.company_name,
      account_number: targetCustomer.account_number,
      vat_id: targetCustomer.vat_id,
      country: targetCustomer.country,
      currency: targetCustomer.currency,
      timezone: targetCustomer.timezone,
      email: targetCustomer.email,
      phone: targetCustomer.phone,
      homepage: targetCustomer.homepage
    }
  });
  async function onSubmit(values: UpdateCustomerRequestDTO) {
    if (loading) return;
    setLoading(true);
    try {
      const response = await updateCustomer(values, targetCustomer.id);

      if (response == 200 || response == 201 || response == 204) {
        toast("Success", {
          description: "Update customer successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchCustomers();
        updateCustomerForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to update customer. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: updateCustomerForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Update customer</DialogTitle>
        </DialogHeader>

        <Form {...updateCustomerForm}>
          <form
            onSubmit={updateCustomerForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={updateCustomerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-10">
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
                control={updateCustomerForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        id="color"
                        type="color"
                        className="h-10 !mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Company Name and VAT ID */}
              <FormField
                control={updateCustomerForm.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your company name"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateCustomerForm.control}
                name="vat_id"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Vat ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your VAT ID"
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
                control={updateCustomerForm.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Account Number"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateCustomerForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full !mt-0 border-gray-200">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country, index) => (
                          <SelectItem
                            key={index}
                            value={country}
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Currency */}
              <FormField
                control={updateCustomerForm.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full !mt-0 border-gray-200">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.code}
                            value={currency.code}
                          >
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Timezone */}
              <FormField
                control={updateCustomerForm.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Time zone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full !mt-0 border-gray-200">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem
                            key={timezone}
                            value={timezone}
                          >
                            {timezone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={updateCustomerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-5">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={updateCustomerForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your phone number"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Homepage */}
              <FormField
                control={updateCustomerForm.control}
                name="homepage"
                render={({ field }) => (
                  <FormItem className="col-span-5">
                    <FormLabel>Home page</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your homepage"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Address */}
              <FormField
                control={updateCustomerForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-7">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your address"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={updateCustomerForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-10">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your description"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="mt-2 bg-main cursor-pointer text-white"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
