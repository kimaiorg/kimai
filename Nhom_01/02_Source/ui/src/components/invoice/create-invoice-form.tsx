"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useDatabase } from "@/db/DatabaseContext";
import { CreateInvoiceParams, InvoiceItem } from "@/db/invoiceService";

export function CreateInvoiceForm() {
  const router = useRouter();
  const { templates, customers, createInvoice } = useDatabase();

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, unitPrice: 0, taxRate: 0 }]);

  // Add a new item to the invoice
  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, taxRate: 0 }]);
  };

  // Remove an item from the invoice
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Update an item in the invoice
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Calculate the total price of the invoice
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const tax = itemTotal * (item.taxRate / 100);
      return total + itemTotal + tax;
    }, 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!selectedCustomer || !selectedTemplateId || items.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if items are valid
    for (const item of items) {
      if (!item.description || item.quantity <= 0 || item.unitPrice <= 0) {
        alert("Please check your invoice items. All items must have a description, quantity and unit price.");
        return;
      }
    }

    // Create invoice params
    const invoiceParams: CreateInvoiceParams = {
      customer: selectedCustomer,
      templateId: selectedTemplateId,
      items,
      dueDate,
      notes
    };

    // Save invoice using the database context
    try {
      createInvoice(invoiceParams);

      // Redirect to invoice history page
      router.push("/invoice-history");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error creating invoice. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Customer <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer, index) => (
              <option
                key={index}
                value={customer}
              >
                {customer}
              </option>
            ))}
          </select>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Template <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            required
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option
                key={template.id}
                value={template.id}
              >
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Items</h3>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Unit Price"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={item.unitPrice}
                  min="0"
                  step="0.01"
                  onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Tax Rate %"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={item.taxRate}
                  min="0"
                  step="0.1"
                  onChange={(e) => updateItem(index, "taxRate", parseFloat(e.target.value))}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-2 flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Total */}
      <div className="mt-4 flex justify-end">
        <div className="text-lg font-medium">Total: {calculateTotal().toFixed(2)} TTD</div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create Invoice
        </button>
      </div>
    </form>
  );
}
