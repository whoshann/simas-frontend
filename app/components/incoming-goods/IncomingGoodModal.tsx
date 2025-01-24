import React, { useState } from 'react';
import { IncomingGoods } from '@/app/api/incoming-goods/types';
import { Inventory } from '@/app/api/inventories/types';
import { Condition } from '@/app/utils/enums';
import { ConditionLabel } from '@/app/utils/enumHelpers';

interface IncomingGoodsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IncomingGoods) => void;
    incomingGoodsData?: IncomingGoods | null;
    inventories: Inventory[];
}

export const IncomingGoodsModal: React.FC<IncomingGoodsModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    incomingGoodsData,
    inventories 
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<IncomingGoods>(incomingGoodsData || {
        inventoryId: 0,
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
        condition: Condition.Good
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'quantity' || name === 'inventoryId' 
            ? parseInt(value, 10) 
            : value;

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const { 
            id, 
            createdAt, 
            updatedAt, 
            inventory,
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
                        {incomingGoodsData ? 'Edit Data Barang Masuk' : 'Tambah Data Barang Masuk'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama Barang</label>
                            <select
                                name="inventoryId"
                                value={formData.inventoryId}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                <option value="">Pilih Barang</option>
                                {inventories.map((inventory) => (
                                    <option key={inventory.id} value={inventory.id}>
                                        {inventory.name} - Stok: {inventory.stock}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jumlah</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                                min="1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kondisi</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                {Object.values(Condition).map((condition) => (
                                    <option key={condition} value={condition}>
                                        {ConditionLabel[condition]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {incomingGoodsData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IncomingGoodsModal;