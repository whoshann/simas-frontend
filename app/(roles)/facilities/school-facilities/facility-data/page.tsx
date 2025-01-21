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

    const { facilities, loading, error, fetchFacilities, createFacility, updateFacility, deleteFacility } = useFacilities();

    useEffect(() => {
        roleMiddleware(["Facilities"]);
        
        fetchFacilities();
    }, []);

    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredFacilities = facilities.filter(facility => 
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
            if (selectedFacility) {
                await updateFacility(selectedFacility.id!, data);
            } else {
                await createFacility(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling room:', error);
        }
    };

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
    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
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
