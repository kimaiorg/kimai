"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerList } from "./components/customer-list";
import { CustomerCreateDialog } from "./components/customer-create-dialog";
import { Customer } from "@/type_schema/customer";
import { Plus, Search, Filter, FileDown, Upload } from "lucide-react";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";
import { CustomerService } from "@/services/customer.service";

function CustomerPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 10;

    // Fetch customers on component mount
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setIsLoading(true);
                const data = await CustomerService.getCustomers();
                setCustomers(data);
                setFilteredCustomers(data);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    // Filter customers based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter(
                (customer) =>
                    customer.name.toLowerCase().includes(searchQuery) ||
                    (customer.company_name && customer.company_name.toLowerCase().includes(searchQuery)) ||
                    (customer.country && customer.country.toLowerCase().includes(searchQuery)) ||
                    (customer.email && customer.email.toLowerCase().includes(searchQuery))
            );
            setFilteredCustomers(filtered);
        }
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchQuery, customers]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle customer creation
    const handleCreateCustomer = async (customerData: any) => {
        try {
            const newCustomer = await CustomerService.createCustomer(customerData);
            setCustomers([...customers, newCustomer]);
        } catch (error) {
            console.error("Error creating customer:", error);
        }
    };

    return (
        <div className="container mx-auto py-6 px-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customers</h1>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 w-[200px]"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        className="flex items-center"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                    >
                        <FileDown className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                    >
                        <Upload className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Loading state */}
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                /* Customer list */
                <CustomerList
                    customers={filteredCustomers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                />
            )}

            {/* Create customer dialog */}
            <CustomerCreateDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreateCustomer={handleCreateCustomer}
            />
        </div>
    );
}

export default AuthenticatedRoute(CustomerPage, [Role.SUPER_ADMIN, Role.ADMIN]);
