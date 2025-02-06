import { OutgoingGoods } from '@/app/api/outgoing-goods/types';
import { getGuaranteeOutgoingGoodsLabel } from '@/app/utils/enumHelpers';
import { formatDate } from '@/app/utils/helper';
import { useState } from 'react';
import { OutgoingGoodModal } from './OutgoingGoodModal';
import { useOutgoingGoods } from '@/app/hooks/useOutgoingGoods';

interface OutgoingGoodTableProps {
    outgoingGoods: OutgoingGoods[];
    startIndex: number;
    loading: boolean;
    onEdit: (outgoingGoods: OutgoingGoods) => void;
    updateBorrowingStatus: (id: number) => Promise<void>;
}

export const OutgoingGoodTable: React.FC<OutgoingGoodTableProps> = ({ outgoingGoods, startIndex, loading, onEdit, updateBorrowingStatus }) => {
    const { error } = useOutgoingGoods();
    const [selectedItem, setSelectedItem] = useState<OutgoingGoods | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (item: OutgoingGoods) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleUpdateStatus = async (id: number) => {
        try {
            await updateBorrowingStatus(id);
            alert('Status peminjaman berhasil diperbarui!');
            handleCloseModal();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">No</th>
                        <th className="py-2 px-4 border-b text-left">Nama Peminjam</th>
                        <th className="py-2 px-4 border-b text-left">Role</th>
                        <th className="py-2 px-4 border-b text-left">Barang</th>
                        <th className="py-2 px-4 border-b text-left">Jumlah</th>
                        <th className="py-2 px-4 border-b text-left">Tanggal Peminjaman</th>
                        <th className="py-2 px-4 border-b text-left">Tanggal Pengembalian</th>
                        <th className="py-2 px-4 border-b text-left">Alasan</th>
                        <th className="py-2 px-4 border-b text-left">Jaminan</th>
                        <th className="py-2 px-4 border-b text-left">Status</th>
                        <th className="py-2 px-4 border-b text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {outgoingGoods.map((outgoingGoods, index) => (
                        <tr key={outgoingGoods.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-left">{startIndex + index + 1}</td>
                            <td className="py-2 px-4 border-b text-left">{outgoingGoods.borrowerName}</td>
                            <td className="py-2 px-4 border-b text-left">{outgoingGoods.role}</td>
                            <td className="py-2 px-4 border-b text-left">{outgoingGoods.inventory.name}</td>
                            <td className="py-2 px-4 border-b text-left">{outgoingGoods.quantity}</td>
                            <td className="py-2 px-4 border-b text-left">
                                {formatDate(outgoingGoods.borrowDate)}
                            </td>
                            <td className="py-2 px-4 border-b text-left">
                                {formatDate(outgoingGoods.returnDate)}
                            </td>
                            <td className="py-2 px-4 border-b text-left">{outgoingGoods.reason}</td>
                            <td className="py-2 px-4 border-b text-left">
                                {getGuaranteeOutgoingGoodsLabel(outgoingGoods.guarantee)}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <span className={`px-2 py-1 rounded-full text-xs ${outgoingGoods.status === "Returned" ? 'bg-green-100 text-green-600' : outgoingGoods.status === "Borrowed" ? 'bg-red-100 text-red-600' : ''}`}>
                                    {outgoingGoods.status}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b text-left">
                                <div className="flex space-x-2">
                                    {outgoingGoods.status === "Borrowed" && (
                                        <button
                                            onClick={() => onEdit(outgoingGoods)}
                                            className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                    >
                                        <i className="bx bxs-message text-lg"></i>
                                    </button>
                                    )}
                                    {outgoingGoods.status === "Returned" && (
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                                            Sudah Dikembalikan
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <OutgoingGoodModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleUpdateStatus}
                borrowingData={selectedItem}
            />
        </div>
    );
};