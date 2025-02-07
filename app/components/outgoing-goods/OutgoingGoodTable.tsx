import { OutgoingGoods } from '@/app/api/outgoing-goods/types';
import { getGuaranteeOutgoingGoodsLabel } from '@/app/utils/enumHelpers';
import { formatDate } from '@/app/utils/helper';
import { useState } from 'react';
import { OutgoingGoodModal } from './OutgoingGoodModal';
import { useOutgoingGoods } from '@/app/hooks/useOutgoingGoods';
import { getOutgoingGoodsStatusLabel } from '@/app/utils/enumHelpers';

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Borrowed':
                return 'bg-[#bd000025] text-[var(--fourth-color)]';
            case 'Returned':
                return 'bg-[#0a97b02a] text-[var(--third-color)]';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>{startIndex + index + 1}</td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>{outgoingGoods.borrowerName}</td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>{outgoingGoods.role}</td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>{outgoingGoods.inventory.name}</td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>{outgoingGoods.quantity}</td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>
                                {formatDate(outgoingGoods.borrowDate)}
                            </td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>
                                {formatDate(outgoingGoods.returnDate)}
                            </td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>{outgoingGoods.reason}</td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>
                                {getGuaranteeOutgoingGoodsLabel(outgoingGoods.guarantee)}
                            </td>
                            <td className="py-2 px-4 border-b" style={{ whiteSpace: 'nowrap' }}>
                                <span className={`px-2 py-1 rounded-full text-md font-medium ${getStatusColor(outgoingGoods.status)}`}>
                                    {getOutgoingGoodsStatusLabel(outgoingGoods.status)}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b text-left" style={{ whiteSpace: 'nowrap' }}>
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
                                        <span className="px-2 py-1 rounded-full text-md bg-[#0a97b02a] text-[var(--third-color)]">
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