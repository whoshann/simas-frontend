"use client";
import "@/app/styles/globals.css";
import { Facility } from '@/app/api/facilities/types';
import { FacilityHeader } from '@/app/components/facility/FacilityHeader';
import { FacilityActions } from '@/app/components/facility/FacilityActions';
import { FacilityTable } from '@/app/components/facility/FacilityTable';
import { FacilityPagination } from '@/app/components/facility/FacilityPagination';
import FacilityModal from '@/app/components/facility/FacilityModal';
import { useFacilities } from '@/app/hooks/useFacilities';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import { useState, useEffect } from 'react';
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { showSuccessAlert, showErrorAlert } from '@/app/utils/sweetAlert';

export default function FacilityDataPage() {
    //State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { facilities, loading, error, fetchFacilities, createFacility, updateFacility, deleteFacility } = useFacilities();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
                await fetchFacilities();
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredFacilities = facilities.filter(facility => {
        const searchValue = searchTerm.toLowerCase();
        return (
            facility.name.toLowerCase().includes(searchValue) ||
            facility.description.toLowerCase().includes(searchValue) ||
            facility.count.toString().includes(searchValue) ||
            (facility.note?.toLowerCase() || '').includes(searchValue)
        );
    });

    const totalEntries = filteredFacilities.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedFacilities = filteredFacilities.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleAddClick = () => {
        setSelectedFacility(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (facility: Facility) => {
        setSelectedFacility(facility);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: Facility) => {
        try {
            // Pastikan count adalah number
            const formattedData = {
                ...data,
                count: Number(data.count)
            };

            if (selectedFacility) {
                await updateFacility(selectedFacility.id!, formattedData);
                showSuccessAlert('Data fasilitas berhasil diperbarui!');
            } else {
                await createFacility(formattedData);
                showSuccessAlert('Data fasilitas berhasil ditambahkan!');
            }
            await fetchFacilities(); // Refresh data
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling facility:', error);
            showErrorAlert('Terjadi kesalahan saat menyimpan data!');
        }
    };

    if (isLoading) {
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
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <FacilityHeader
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <FacilityActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <FacilityTable
                        facilities={displayedFacilities}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteFacility}
                    />

                    <FacilityPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            <FacilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                facilityData={selectedFacility}
            />
        </div>
    );
}
