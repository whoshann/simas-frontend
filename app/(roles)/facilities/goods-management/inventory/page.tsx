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
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { showSuccessAlert, showErrorAlert, showConfirmDelete } from "@/app/utils/sweetAlert";
    
export default function InventoryPage() {
    const { inventories, loading, error, fetchInventories, addInventory, updateInventory, deleteInventory } = useInventory();
    
    // State untuk table
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
                await fetchInventories();
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (!isAuthorized) {
        return null;
    }

    // Filter dan pagination logic
    const filteredData = inventories.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stock.toString().includes(searchTerm.toLowerCase()) ||
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
        const isConfirmed = await showConfirmDelete(
            'Hapus Data Inventory',
            'Apakah Anda yakin ingin menghapus data inventory ini?'
        );

        if (isConfirmed) {
            await deleteInventory(id);
            showSuccessAlert('Berhasil', 'Data inventory berhasil dihapus');
        } else {
            showErrorAlert('Error', 'Gagal menghapus data inventory');
        }
    };

    const handleModalSubmit = async (formData: FormData) => {
        try {
            if (selectedInventory) {
                await updateInventory(selectedInventory.id!, formData);
                showSuccessAlert('Success', 'Data inventory berhasil diubah');
            } else {
                await addInventory(formData);
                showSuccessAlert('Success', 'Data inventory berhasil ditambahkan');
            }
            setIsModalOpen(false);
        } catch (error) {
            showErrorAlert('Error', 'Gagal menambahkan data inventory');
        }
    };

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