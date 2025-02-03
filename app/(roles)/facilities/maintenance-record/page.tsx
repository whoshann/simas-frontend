"use client";
import "@/app/styles/globals.css";
import { MaintenanceRecord } from '@/app/api/maintenance-records/types';
import { MaintenanceRecordHeader } from '@/app/components/maintenance-records/Maintenance-record.Header';
import { MaintenanceRecordActions } from '@/app/components/maintenance-records/Maintenance-record.Actions';
import { MaintenanceRecordTable } from '@/app/components/maintenance-records/Maintenance-record.table';
import { MaintenanceRecordPagination } from '@/app/components/maintenance-records/Maintenance-record.Pagination';
import MaintenanceRecordModal from '@/app/components/maintenance-records/Maintenance-record.Modal';
import { useMaintenanceRecords } from '@/app/hooks/useMaintenanceRecords';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { useState, useEffect } from 'react';


export default function MaintenanceRecordDataPage() {
    //State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaintenanceRecord, setSelectedMaintenanceRecord] = useState<MaintenanceRecord | null>(null);

    const { MaintenanceRecords, loading, error, fetchMaintenanceRecords, createMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } = useMaintenanceRecords();
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'MaintenanceRecords'
        roleMiddleware(["Facilities"]);
    }, []);

    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredMaintenanceRecords = MaintenanceRecords.filter(MaintenanceRecord => 
        MaintenanceRecord.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        MaintenanceRecord.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalEntries = filteredMaintenanceRecords.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedMaintenanceRecords = filteredMaintenanceRecords.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleAddClick = () => {
        setSelectedMaintenanceRecord(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (maintenancerecord: MaintenanceRecord) => {
        setSelectedMaintenanceRecord(maintenancerecord);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: MaintenanceRecord) => {
        try {
            if (selectedMaintenanceRecord) {
                await updateMaintenanceRecord(selectedMaintenanceRecord.id!, data);
            } else {
                await createMaintenanceRecord(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling maintenance record:', error);
        }
    };


    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                <MaintenanceRecordHeader 
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                />

            <main className="px-9 pb-6">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <MaintenanceRecordActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <MaintenanceRecordTable
                        maintenancerecords={displayedMaintenanceRecords}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteMaintenanceRecord}
                    />

                    <MaintenanceRecordPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>
            <MaintenanceRecordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                maintenancerecordData={selectedMaintenanceRecord}
            />
        </div>
    );
}
