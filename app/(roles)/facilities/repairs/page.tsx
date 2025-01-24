"use client";

import { useState, useEffect } from 'react';
import { Repairs } from '@/app/api/repairs/types';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { RepairsHeader } from '@/app/components/repairs/RepairsHeader';
import { useInventory } from '@/app/hooks/useInventory';
import RepairsModal from '@/app/components/repairs/RepairsModal';
import { RepairsPagination } from '@/app/components/repairs/RepairsPagination';
import { RepairsTable } from '@/app/components/repairs/RepairsTable';
import { RepairsActions } from '@/app/components/repairs/RepairsActions';
import { useRepairs } from '@/app/hooks/useRepairs';
import { useRooms } from '@/app/hooks/useRooms';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";


export default function RepairsPage() {
    // State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRepairs, setSelectedRepairs] = useState<Repairs | null>(null);

    // Hooks
    const { repairs, loading, error, fetchRepairs, createRepair, updateRepair, deleteRepair } = useRepairs();
    const { inventories, fetchInventories } = useInventory();
    const { rooms, fetchRooms } = useRooms();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);

                // Fetch all data
                const results = await Promise.all([
                    fetchRepairs(),
                    fetchInventories(),
                    fetchRooms()
                ]);

            } catch (error) {
                console.error("Error initializing page:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredRepairs = repairs.filter((repair: Repairs) => {
        if (!searchTerm) return true;

        const searchValue = searchTerm.toLowerCase();
        if (repair.category === 'Items') {
            return repair.inventory?.name?.toLowerCase().includes(searchValue);
        } else {
            return repair.room?.name?.toLowerCase().includes(searchValue);
        }
    });

    console.log('Filtered Repairs:', filteredRepairs);

    const totalEntries = filteredRepairs.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedRepairs = filteredRepairs.slice(startIndex, startIndex + entriesPerPage);

    console.log('Displayed Repairs:', displayedRepairs);

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    // Handlers
    const handleAddClick = () => {
        setSelectedRepairs(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (repairs: Repairs) => {
        setSelectedRepairs(repairs);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: Repairs) => {
        try {
            if (selectedRepairs) {
                await updateRepair(selectedRepairs.id!, data);
            } else {
                await createRepair(data);
            }
            await fetchRepairs(); // Refresh data after submit
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling repairs:', error);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <RepairsHeader
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <RepairsActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <RepairsTable
                        repairs={displayedRepairs}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteRepair}
                    />

                    <RepairsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            <RepairsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                repairsData={selectedRepairs}
                inventories={inventories}
                rooms={rooms}
            />
        </div>
    );
}
