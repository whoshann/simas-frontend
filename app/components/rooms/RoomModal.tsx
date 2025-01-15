import React, { useState } from 'react';
import { Room } from '@/app/api/rooms/types';
import { reverseStatusMapping } from '@/app/utils/statusConverter';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Room) => void;
    roomData?: Room | null;
}

export const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, onSubmit, roomData }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<Room>(roomData || {
        name: '',
        type: '',
        capacity: 1,
        status: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'capacity' ? parseInt(value, 10) : value;

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                        {roomData ? 'Edit Data Ruang Sekolah' : 'Tambah Data Ruang Sekolah'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama Ruang</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tipe Ruang</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="Ruang Teori">Ruang Teori</option>
                                <option value="Lab">Lab</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kapasitas</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
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
                                <option value="">Pilih Status</option>
                                <option value="Available">Tersedia</option>
                                <option value="InUse">Sedang Digunakan</option>
                                <option value="UnderRepair">Sedang Diperbaiki</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {roomData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RoomModal;