import React, { useState, useEffect } from 'react';
import { OutgoingGoods } from '@/app/api/outgoing-goods/types';
import { GuaranteeOutgoingGoods } from '@/app/utils/enums';
import { useInventory } from '@/app/hooks/useInventory';
import { formatDate } from '@/app/utils/helper';

interface OutgoingGoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number) => void;
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
    guarantee: borrowingData?.guarantee || GuaranteeOutgoingGoods.StudentCard,
    status: borrowingData?.status || ''
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
        guarantee: borrowingData.guarantee || GuaranteeOutgoingGoods.StudentCard,
        status: borrowingData.status || ''
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
        guarantee: GuaranteeOutgoingGoods.StudentCard,
        status: ''
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
    if (borrowingData?.id) {
      onSubmit(borrowingData.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Konfirmasi Pengembalian</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Apakah Anda yakin ingin mengembalikan barang ini?</p>
          <div className="mt-4">
            <p><strong>Peminjam:</strong> {borrowingData?.borrowerName}</p>
            <p><strong>Barang:</strong> {borrowingData?.inventory?.name}</p>
            <p><strong>Tanggal Pinjam:</strong> {formatDate(borrowingData?.borrowDate || '')}</p>
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
              Konfirmasi Pengembalian
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};