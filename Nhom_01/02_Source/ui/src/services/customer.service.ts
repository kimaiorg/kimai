import { Customer } from "@/type_schema/customer";

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    color: "#FF5733",
    company_name: "Acme Inc.",
    country: "United States",
    email: "contact@acme.com",
    phone: "+1 123-456-7890",
    visible: true
  },
  {
    id: "2",
    name: "Globex Corporation",
    color: "#33A1FF",
    company_name: "Globex Co.",
    country: "United Kingdom",
    email: "info@globex.com",
    visible: true
  },
  {
    id: "3",
    name: "Soylent Corp",
    color: "#33FF57",
    company_name: "Soylent Corporation",
    country: "Canada",
    phone: "+1 987-654-3210",
    visible: true
  },
  {
    id: "4",
    name: "Initech",
    color: "#A133FF",
    company_name: "Initech LLC",
    country: "Germany",
    email: "support@initech.com",
    visible: false
  },
  {
    id: "5",
    name: "Umbrella Corporation",
    color: "#FF33A1",
    company_name: "Umbrella Corp",
    country: "Japan",
    email: "contact@umbrella.jp",
    phone: "+81 123-4567",
    visible: true
  }
];

export class CustomerService {
  // Get all customers
  static async getCustomers(): Promise<Customer[]> {
    // In a real application, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCustomers);
      }, 500);
    });
  }

  // Get customer by ID
  static async getCustomerById(id: string): Promise<Customer | undefined> {
    // In a real application, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === id);
        resolve(customer);
      }, 300);
    });
  }

  // Create new customer
  static async createCustomer(customerData: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
    // In a real application, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer: Customer = {
          id: (mockCustomers.length + 1).toString(),
          ...customerData,
          createdAt: new Date()
        };
        mockCustomers.push(newCustomer);
        resolve(newCustomer);
      }, 500);
    });
  }

  // Update customer
  static async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer | undefined> {
    // In a real application, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex((c) => c.id === id);
        if (index !== -1) {
          mockCustomers[index] = { ...mockCustomers[index], ...customerData };
          resolve(mockCustomers[index]);
        } else {
          resolve(undefined);
        }
      }, 500);
    });
  }

  // Delete customer
  static async deleteCustomer(id: string): Promise<boolean> {
    // In a real application, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex((c) => c.id === id);
        if (index !== -1) {
          mockCustomers.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
}
