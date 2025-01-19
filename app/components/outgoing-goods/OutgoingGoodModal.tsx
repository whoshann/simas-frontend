import React, { useState, useEffect } from 'react';
import { OutgoingGoods } from '@/app/api/outgoing-goods/types';
import { GuaranteeOutgoingGoods } from '@/app/utils/enums';
import { useInventory } from '@/app/hooks/useInventory';

interface OutgoingGoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OutgoingGoods) => void;
  borrowingData?: OutgoingGoods | null;
}

export const OutgoingGoodModal: React.FC<OutgoingGoodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  borrowingData
}) => {
  const { inventories } = useInventory();
  const [formData, setFormData] = useState({
    role: borrowingData?.role || '',
    borrowerName: borrowingData?.borrowerName || '',
    inventoryId: borrowingData?.inventoryId || 0,
    quantity: borrowingData?.quantity || 1,
    borrowDate: borrowingData?.borrowDate || '',
    returnDate: borrowingData?.returnDate || '',
    reason: borrowingData?.reason || '',
    guarantee: borrowingData?.guarantee || GuaranteeOutgoingGoods.StudentCard
  });

  useEffect(() => {
    if (borrowingData) {
      setFormData({
        role: borrowingData.role || '',
        borrowerName: borrowingData.borrowerName || '',
        inventoryId: borrowingData.inventoryId || 0,
        quantity: borrowingData.quantity || 1,
        borrowDate: borrowingData.borrowDate || '',
        returnDate: borrowingData.returnDate || '',
        reason: borrowingData.reason || '',
        guarantee: borrowingData.guarantee || GuaranteeOutgoingGoods.StudentCard
      });
    } else {
      setFormData({
        role: '',
        borrowerName: '',
        inventoryId: 0,
        quantity: 1,
        borrowDate: '',
        returnDate: '',
        reason: '',
        guarantee: GuaranteeOutgoingGoods.StudentCard
      });
    }
  }, [borrowingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'inventoryId' || name === 'quantity') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.inventoryId) {
      alert('Silakan pilih barang terlebih dahulu');
      return;
    }

    onSubmit(formData as OutgoingGoods);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {borrowingData ? 'Edit Peminjaman' : 'Ajukan Peminjaman'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Contoh: Student/Teacher"
            />
          </div>

          {/* Borrower Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Peminjam</label>
            <input
              type="text"
              name="borrowerName"
              value={formData.borrowerName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Masukkan nama peminjam"
            />
          </div>

          {/* Inventory Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Pilih Barang</label>
            <select
              name="inventoryId"
              value={formData.inventoryId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Pilih Barang</option>
              {inventories?.map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {inventory.name} - Stok: {inventory.stock}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Jumlah</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Pinjam</label>
              <input
                type="date"
                name="borrowDate"
                value={formData.borrowDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Kembali</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Alasan Peminjaman</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Guarantee */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Jaminan</label>
            <select
              name="guarantee"
              value={formData.guarantee}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value={GuaranteeOutgoingGoods.StudentCard}>Kartu Pelajar</option>
              <option value={GuaranteeOutgoingGoods.KTP}>KTP</option>
              <option value={GuaranteeOutgoingGoods.Handphone}>Handphone</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {borrowingData ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};