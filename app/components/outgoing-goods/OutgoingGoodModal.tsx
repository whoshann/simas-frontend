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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Konfirmasi Pengembalian</h2>
      <hr className="border-gray-300 my-2" />
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-700 text-sm">Apakah Anda yakin ingin mengembalikan barang ini?</p>
          <div className="mt-4">
            <div className="flex flex-col mt-4">
              <div className="flex flex-col">
                <p className="font-semibold"><strong>Peminjam:</strong></p>
                <p className="text-gray-800">{borrowingData?.borrowerName}</p>
              </div>
              <div className="flex flex-col mt-4">
                <p className="font-semibold"><strong>Barang:</strong></p>
                <p className="text-gray-800 text-left">{borrowingData?.inventory?.name}</p>
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <p className="font-semibold"><strong>Tanggal Pinjam:</strong></p>
              <p className="text-gray-800">{formatDate(borrowingData?.borrowDate || '')}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[var(--main-color)] text-white py-2 px-4 rounded-md hover:bg-[#2154a1] disabled:opacity-50"
            >
              Konfirmasi Pengembalian
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};