"use client";

import type React from "react";

import { getAllCustomers } from "@/api/customer.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { activityFilters } from "@/type_schema/activity";
import { CustomerType } from "@/type_schema/customer";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function FilterInvoiceHistoryModal({
  children,
  sortBy,
  sortOrder,
  fromDate,
  toDate,
  customerId,
  status,
  handleFilterChangeAction
}: {
  children: React.ReactNode;
  sortBy: string;
  sortOrder: string;
  fromDate: string;
  toDate: string;
  customerId: string;
  status: string;
  handleFilterChangeAction: (props: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: sortBy,
    sortOrder: sortOrder,
    fromDate: fromDate,
    toDate: toDate,
    customerId: customerId,
    status: status
  });
  const [customerList, setCustomerList] = useState<CustomerType[] | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const [customers] = await Promise.all([getAllCustomers()]);
        setCustomerList(customers.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    handleFilterChangeAction({
      _sortBy: filters.sortBy,
      _sortOrder: filters.sortOrder,
      _fromDate: filters.fromDate,
      _toDate: filters.toDate,
      _customerId: filters.customerId,
      _status: filters.status
    });
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: "",
      sortOrder: "",
      fromDate: "",
      toDate: "",
      customerId: "",
      status: ""
    });
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 border border-gray-200 !p-0"
        align="end"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 pl-2">
            <Filter className="h-4 w-4" />
            <h4 className="font-medium">Filter invoices</h4>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="!m-0" />

        <div className="grid gap-4 p-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger
                  id="sortBy"
                  className="border border-gray-200 !w-full"
                >
                  <SelectValue
                    placeholder="Sort By"
                    defaultValue={filters.sortBy}
                  />
                </SelectTrigger>
                <SelectContent>
                  {activityFilters.map((filter, index) => (
                    <SelectItem
                      key={index}
                      value={filter.name}
                    >
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) => handleFilterChange("sortOrder", value)}
              >
                <SelectTrigger
                  id="sortOrder"
                  className="border border-gray-200 !w-full"
                >
                  <SelectValue
                    placeholder="Order"
                    defaultValue={filters.sortOrder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                className="border border-gray-200"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fromDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                className="border border-gray-200"
                value={filters.toDate}
                onChange={(e) => {
                  if (e.target.value > filters.fromDate) {
                    handleFilterChange("toDate", e.target.value);
                  }
                }}
              />
            </div>
          </div>
          {customerList && (
            <div className="grid gap-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select
                onValueChange={(value) => handleFilterChange("customerId", value)}
                value={filters.customerId}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select customer"
                    defaultValue={filters.customerId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {customerList.map((customer, index) => (
                    <SelectItem
                      key={index}
                      value={customer.id.toString()}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: customer.color || "#FF5733" }}
                      ></div>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {statusList && (
            <div className="grid gap-2">
              <Label htmlFor="customerId">Status</Label>
              <Select
                onValueChange={(value) => handleFilterChange("status", value)}
                value={filters.status}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select status"
                    defaultValue={filters.status}
                  />
                </SelectTrigger>
                <SelectContent>
                  {statusList.map((status, index) => (
                    <SelectItem
                      key={index}
                      value={status.value}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: status.color || "#FF5733" }}
                      ></div>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator className="mt-1" />

        <div className="flex justify-end p-2 items-stretch gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer border border-gray-200"
            onClick={handleResetFilters}
          >
            Reset
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-main text-white"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const statusList = [
  { name: "New", value: "NEW", color: "blue" },
  { name: "Pending", value: "PENDING", color: "yellow" },
  { name: "Paid", value: "PAID", color: "lime" },
  { name: "Cancelled", value: "CANCELLED", color: "red" }
];
