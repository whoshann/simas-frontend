import React, { useState } from 'react';
import { Facility } from '@/app/api/facilities/types';
import { reverseStatusMapping } from '@/app/utils/statusConverter';

interface FacilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Facility) => void;
    facilityData?: Facility | null;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({ isOpen, onClose, onSubmit, facilityData }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<Facility>(facilityData || {
        name: '',
        count: 1,
        description: '',
        note: '',
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
                        {facilityData ? 'Edit Data Ruang Sekolah' : 'Tambah Data Ruang Sekolah'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama Fasilitas</label>
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
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jumlah</label>
                            <input
                                type="number"
                                name="count"
                                value={formData.count}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Deskripsi</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Catatan (Opsional)</label>
                            <input
                                type="text"
                                name="note"
                                value={formData.note || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {facilityData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FacilityModal;