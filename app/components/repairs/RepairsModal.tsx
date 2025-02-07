import React, { useState } from 'react';
import { Repairs } from '@/app/api/repairs/types';
import { Inventory } from '@/app/api/inventories/types';
import { Room } from '@/app/api/rooms/types';
import { Condition, RepairCategory, RepairStatus } from '@/app/utils/enums';
import { RepairCategoryLabel, RepairStatusLabel } from '@/app/utils/enumHelpers';

interface RepairsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Repairs) => void;
    repairsData?: Repairs | null;
    inventories: Inventory[];
    rooms: Room[];
}

const formatRupiah = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const parseRupiah = (value: string): number => {
    // Hapus semua karakter non-digit
    const numericValue = value.replace(/[^0-9]/g, '');
    return parseInt(numericValue, 10) || 0;
};

export const RepairsModal: React.FC<RepairsModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    repairsData,
    inventories,
    rooms
}) => {
    if (!isOpen) return null;

    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState<Repairs>(() => {
        if (repairsData) {
            return {
                ...repairsData,
                // Format tanggal saat inisialisasi data
                maintenanceDate: formatDateForInput(repairsData.maintenanceDate)
            };
        }
        return {
            category: RepairCategory.Item,
            maintenanceDate: new Date().toISOString().split('T')[0],
            description: '',
            cost: 0,
            status: RepairStatus.Pending
        };
    });


    const [displayCost, setDisplayCost] = useState(() =>
        formatRupiah(repairsData?.cost || 0)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Reset inventoryId/roomId when category changes
        if (name === 'category') {
            setFormData({
                ...formData,
                category: value as RepairCategory,
                inventoryId: undefined,
                roomId: undefined
            });
            return;
        }

        // Handle numeric values
        if (name === 'cost' || name === 'inventoryId' || name === 'roomId') {
            setFormData({
                ...formData,
                [name]: value ? Number(value) : undefined
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = parseRupiah(e.target.value);
        setDisplayCost(formatRupiah(numericValue));
        setFormData({
            ...formData,
            cost: numericValue
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Bersihkan data sebelum dikirim
        const {
            id,
            createdAt,
            updatedAt,
            inventory,
            room,
            ...submitData
        } = formData;

        onSubmit(submitData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[28rem] max-h-[80vh] overflow-hidden mx-4">
                <div className="bg-white p-4 sticky top-0 z-10">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl mb-2 font-semibold text-[var(--text-semi-bold-color)]">
                        {repairsData ? 'Edit Data Perbaikan' : 'Tambah Data Perbaikan'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kategori</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                <option value="Items">Barang</option>
                                <option value="Rooms">Ruangan</option>
                            </select>
                        </div>

                        {/* Conditional rendering based on category */}
                        {formData.category === 'Items' ? (
                            <div className="mb-4">
                                <label className="block mb-1 text-[var(--text-semi-bold-color)]">Pilih Barang</label>
                                <select
                                    name="inventoryId"
                                    value={formData.inventoryId || ''}
                                    onChange={handleChange}
                                    className="border p-2 w-full rounded-lg"
                                    required
                                >
                                    <option value="">Pilih Barang</option>
                                    {inventories.map((inventory) => (
                                        <option key={inventory.id} value={inventory.id}>
                                            {inventory.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <label className="block mb-1 text-[var(--text-semi-bold-color)]">Pilih Ruangan</label>
                                <select
                                    name="roomId"
                                    value={formData.roomId || ''}
                                    onChange={handleChange}
                                    className="border p-2 w-full rounded-lg"
                                    required
                                >
                                    <option value="">Pilih Ruangan</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Perbaikan</label>
                            <input
                                type="date"
                                name="maintenanceDate"
                                value={formData.maintenanceDate}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Deskripsi</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Biaya</label>
                            <input
                                type="text"
                                name="cost"
                                value={displayCost}
                                onChange={handleCostChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                <option value="Pending">Pending</option>
                                <option value="InProgress">Sedang Dikerjakan</option>
                                <option value="Completed">Selesai</option>
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {repairsData ? 'Update' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RepairsModal;