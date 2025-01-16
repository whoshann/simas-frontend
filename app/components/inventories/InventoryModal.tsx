import React, { useState } from 'react';
import { Inventory, CreateInventoryDto } from '@/app/api/inventories/types';

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateInventoryDto) => void;
    inventoryData?: Inventory | null;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    inventoryData
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<CreateInventoryDto>({
        code: inventoryData?.code || '',
        name: inventoryData?.name || '',
        photo: inventoryData?.photo || '',
        stock: inventoryData?.stock || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormData(prev => ({
                ...prev,
                photo: base64
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[28rem] max-h-[80vh] overflow-hidden mx-4">
                <div className="bg-white p-4 sticky top-0 z-10">
                    <button 
                        onClick={onClose} 
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl mb-2 font-semibold text-[var(--text-semi-bold-color)]">
                        {inventoryData ? 'Edit Data Inventory' : 'Tambah Data Inventory'}
                    </h2>
                </div>

                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">
                                Kode Barang
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">
                                Nama Barang
                            </label>
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
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">
                                Stok
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">
                                Gambar
                            </label>
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border p-2 w-full rounded-lg"
                                required={!inventoryData}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {inventoryData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};