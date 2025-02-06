"use client";

import { useState, useEffect } from 'react';
import { IncomingGoods } from '@/app/api/incoming-goods/types';
import IncomingGoodsModal from '@/app/components/incoming-goods/IncomingGoodModal';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { IncomingGoodsHeader } from '@/app/components/incoming-goods/IncomingGoodHeader';
import { IncomingGoodsActions } from '@/app/components/incoming-goods/IncomingGoodAction';
import { IncomingGoodTable } from '@/app/components/incoming-goods/IncomingGoodTable';
import { IncomingGoodPagination } from '@/app/components/incoming-goods/IncomingGoodPagination';
import { useIncomingGoods } from '@/app/hooks/useIncomingGoods';
import { useInventory } from '@/app/hooks/useInventory';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { ConditionLabel } from "@/app/utils/enumHelpers";
import { showSuccessAlert, showErrorAlert } from "@/app/utils/sweetAlert";

export default function IncomingGoodDataPage() {
    // State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncomingGoods, setSelectedIncomingGoods] = useState<IncomingGoods | null>(null);

    // Hooks
    const { incomingGoods, loading, error, fetchIncomingGoods, createIncomingGoods, updateIncomingGoods, deleteIncomingGoods } = useIncomingGoods();
    const { 
        inventories, 
        fetchInventories 
    } = useInventory();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
                await fetchIncomingGoods();
                await fetchInventories();
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (!isAuthorized) {
        return null;
    }

    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredIncomingGoods = incomingGoods.filter((item: IncomingGoods) => {
        const searchValue = searchTerm.toLowerCase();
        const date = new Date(item.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).toLowerCase();
        
        return (
            item.inventory?.name.toLowerCase().includes(searchValue) ||
            item.quantity.toString().includes(searchValue) ||
            date.includes(searchValue) ||
            ConditionLabel[item.condition].toLowerCase().includes(searchValue)
        );
    });
    
    const totalEntries = filteredIncomingGoods.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedIncomingGoods = filteredIncomingGoods.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleAddClick = () => {
        setSelectedIncomingGoods(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (incomingGoods: IncomingGoods) => {
        setSelectedIncomingGoods(incomingGoods);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: IncomingGoods) => {
        try {
            if (selectedIncomingGoods) {
                await updateIncomingGoods(selectedIncomingGoods.id!, data);
                showSuccessAlert('Data barang masuk berhasil diperbarui!');
            } else {
                await createIncomingGoods(data);
                showSuccessAlert('Data barang masuk berhasil ditambahkan!');
            }
            await fetchIncomingGoods(); // Refresh data
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling incoming goods:', error);
            showErrorAlert('Terjadi kesalahan saat menyimpan data!');
        }
    };
    
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <IncomingGoodsHeader 
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            /> 

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <IncomingGoodsActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <IncomingGoodTable
                        incomingGoods={displayedIncomingGoods}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteIncomingGoods}
                    />

                    <IncomingGoodPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            <IncomingGoodsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                incomingGoodsData={selectedIncomingGoods}
                inventories={inventories}
            />
        </div>
    );
}
