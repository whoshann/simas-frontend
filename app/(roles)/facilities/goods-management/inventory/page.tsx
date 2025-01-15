"use client";

import { useState, useEffect } from "react";
import { useInventory } from "@/app/hooks/useInventory";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import { Inventory } from "@/app/api/inventories/types";
import { InventoryHeader } from "@/app/components/inventories/InventoryHeader";
import { InventoryActions } from "@/app/components/inventories/InventoryActions";
import { InventoryTable } from "@/app/components/inventories/InventoryTable";
import { InventoryPagination } from "@/app/components/inventories/InventoryPagination";
import { InventoryModal } from "@/app/components/inventories/InventoryModal";

export default function InventoryPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { inventories, loading, error, addInventory, updateInventory, deleteInventory } = useInventory();
    
    // State untuk table
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);

    useEffect(() => {
        try {
            roleMiddleware(["Facilities"]);
            setIsAuthorized(true);
        } catch (error) {
            setIsAuthorized(false);
        }
    }, []);

    // Filter dan pagination logic
    const filteredData = inventories.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleAddClick = () => {
        setSelectedInventory(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            try {
                await deleteInventory(id);
            } catch (error) {
                console.error('Error deleting inventory:', error);
            }
        }
    };

    const handleModalSubmit = async (data: any) => {
        try {
            if (selectedInventory) {
                await updateInventory(selectedInventory.id!, data);
            } else {
                await addInventory(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isAuthorized || loading) return null;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <InventoryHeader 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <InventoryActions 
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={handleEntriesChange}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <InventoryTable 
                        inventories={currentEntries}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />

                    <InventoryPagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            <InventoryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                inventoryData={selectedInventory}
            />
        </div>
    );
}