"use client";

import { useState, useEffect } from 'react';
import { Room } from '@/app/api/rooms/types';
import { RoomHeader } from '@/app/components/rooms/RoomHeader';
import { RoomActions } from '@/app/components/rooms/RoomActions';
import { RoomTable } from '@/app/components/rooms/RoomTable';
import { RoomPagination } from '@/app/components/rooms/RoomPagination';
import RoomModal from '@/app/components/rooms/RoomModal';
import { useRooms } from '@/app/hooks/useRooms';
import { roleMiddleware } from '@/app/(auth)/middleware/middleware';
import LoadingSpinner from '@/app/components/loading/LoadingSpinner';
import { getStatusInIndonesian, statusMapping } from '@/app/utils/statusConverter';
import { showSuccessAlert, showErrorAlert } from '@/app/utils/sweetAlert';

export default function RoomDataPage() {
    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Hooks
    const { rooms, loading, error, fetchRooms, createRoom, updateRoom, deleteRoom } = useRooms();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
                await fetchRooms();
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return null;
    }

    // Calculations
    const startIndex = (currentPage - 1) * entriesPerPage;
    const filteredRooms = rooms.filter(room => {
        const searchValue = searchTerm.toLowerCase();
        return (
            room.name.toLowerCase().includes(searchValue) ||
            room.type.toLowerCase().includes(searchValue) ||
            room.capacity.toString().includes(searchValue) ||
            getStatusInIndonesian(room.status as keyof typeof statusMapping).toLowerCase().includes(searchValue)
        );
    });
    const totalEntries = filteredRooms.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const displayedRooms = filteredRooms.slice(startIndex, startIndex + entriesPerPage);

    // Handlers
    const handleAddClick = () => {
        setSelectedRoom(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: Room) => {
        try {
            if (selectedRoom) {
                await updateRoom(selectedRoom.id!, data);
                showSuccessAlert('Data ruangan berhasil diperbarui!');
            } else {
                await createRoom(data);
                showSuccessAlert('Data ruangan berhasil ditambahkan!');
            }
            await fetchRooms(); // Refresh data
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling room:', error);
            showErrorAlert('Terjadi kesalahan saat menyimpan data!');
        }
    };


    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <RoomHeader
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            <main className="px-9 pb-6">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <RoomActions
                        entriesPerPage={entriesPerPage}
                        onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        onAddClick={handleAddClick}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />

                    <RoomTable
                        rooms={displayedRooms}
                        startIndex={startIndex}
                        onEdit={handleEditClick}
                        onDelete={deleteRoom}
                    />

                    <RoomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        entriesPerPage={entriesPerPage}
                        totalEntries={totalEntries}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            <RoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                roomData={selectedRoom}
            />
        </div>
    );
}
