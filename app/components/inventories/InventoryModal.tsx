import React, { useState } from 'react';
import { Inventory, CreateInventoryDto } from '@/app/api/inventories/types';

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const submitFormData = new FormData();
        submitFormData.append('code', formData.code);
        submitFormData.append('name', formData.name);
        submitFormData.append('stock', '0');

        // Handle file upload
        if (selectedFile) {
            submitFormData.append('photo', selectedFile);
        } else if (inventoryData && inventoryData.photo) {
            // If editing and no new file selected, send the existing photo
            const response = await fetch(inventoryData.photo);
            const blob = await response.blob();
            submitFormData.append('photo', blob, inventoryData.photo.split('/').pop() || 'photo.jpg');
        }

        await onSubmit(submitFormData);
        onClose();
    } catch (error: any) {
        console.error('Error:', error);
        alert(error.response?.data?.message || 'Terjadi kesalahan');
    }
};

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedFile(file);
        // You can still keep the base64 preview if needed
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFormData(prev => ({
                ...prev,
                photo: reader.result as string
            }));
        };
    }
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