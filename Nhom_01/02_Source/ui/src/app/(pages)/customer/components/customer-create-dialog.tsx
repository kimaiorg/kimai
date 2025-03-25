"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Define a type for the customer form data
interface CustomerFormData {
  name: string;
  color: string;
  description: string;
  address: string;
  company_name: string;
  account_number: string;
  vat_id: string;
  country: string;
  currency: string;
  timezone: string;
  email: string;
  phone: string;
  homepage: string;
  visible: boolean;
}

interface CustomerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCustomer: (customerData: CustomerFormData) => void;
}

// List of common currencies
const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "VND", name: "Vietnamese Dong" }
];

// List of common timezones
const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Ho_Chi_Minh",
  "Australia/Sydney"
];

// List of common countries
const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Singapore",
  "Vietnam"
];

export function CustomerCreateDialog({ open, onOpenChange, onCreateCustomer }: CustomerCreateDialogProps) {
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: "",
    color: "#FF5733",
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
    visible: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCustomerData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateCustomer(customerData);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create customer</DialogTitle>
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
                value={customerData.name}
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
                value={customerData.color}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Name and VAT ID */}
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={customerData.company_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vat_id">VAT ID</Label>
              <Input
                id="vat_id"
                name="vat_id"
                value={customerData.vat_id}
                onChange={handleInputChange}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                name="account_number"
                value={customerData.account_number}
                onChange={handleInputChange}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("country", value)}
                value={customerData.country}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country}
                      value={country}
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("currency", value)}
                value={customerData.currency}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
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
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("timezone", value)}
                value={customerData.timezone}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
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
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={customerData.phone}
                onChange={handleInputChange}
              />
            </div>

            {/* Homepage */}
            <div className="space-y-2">
              <Label htmlFor="homepage">Homepage</Label>
              <Input
                id="homepage"
                name="homepage"
                type="url"
                value={customerData.homepage}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={customerData.address}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={customerData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Visible Toggle */}
            <div className="flex items-center justify-between col-span-2">
              <Label htmlFor="visible">Visible</Label>
              <Switch
                id="visible"
                checked={customerData.visible}
                onCheckedChange={(checked: boolean) => handleSwitchChange("visible", checked)}
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
