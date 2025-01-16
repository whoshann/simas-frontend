import React, { useState } from 'react';
import { MaintenanceRecord } from '@/app/api/maintenance-records/types';
import { reverseStatusMapping } from '@/app/utils/statusConverter';

interface MaintenanceRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MaintenanceRecord) => void;
    maintenancerecordData?: MaintenanceRecord | null;
}

export const MaintenanceRecordModal: React.FC<MaintenanceRecordModalProps> = ({ isOpen, onClose, onSubmit, maintenancerecordData }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<MaintenanceRecord>(maintenancerecordData || {
        id: undefined,
        category: '',
        inventoryId: '',
        roomId: undefined,
        maintenanceDate: Date.now(),
        description: '',
        cost: 0,
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
                        {maintenancerecordData ? 'Edit Data Perbaikan Sekolah' : 'Tambah Data Perbaikan Sekolah'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kategori</label>
                            <select
                                name="category" // Ganti input menjadi select untuk kategori
                                value={formData.category}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="Ruang">Ruang</option>
                                <option value="Barang">Barang</option>
                            </select>
                        </div>
                        <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Deskripsi</label>
                            <input
                                type="text"
                                name="description" // Tambahkan input untuk description
                                value={formData.description}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Perbaikan</label>
                            <input
                                type="date"
                                name="maintenanceDate"
                                value={formData.maintenanceDate ? new Date(formData.maintenanceDate).toISOString().split('T')[0] : ''}
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
                                    <option value="Complete">Selesai</option>
                                    <option value="Pending">Menunggu</option>
                                    <option value="InProgress">Dalam Proses</option>

                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Biaya</label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {maintenancerecordData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceRecordModal;