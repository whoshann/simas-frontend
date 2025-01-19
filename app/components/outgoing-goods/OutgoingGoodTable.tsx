import { OutgoingGoods } from '@/app/api/outgoing-goods/types';
import { getGuaranteeOutgoingGoodsLabel } from '@/app/utils/enumHelpers';

interface OutgoingGoodTableProps {
    outgoingGoods: OutgoingGoods[];
    startIndex: number;
    onEdit: (outgoingGoods: OutgoingGoods) => void;
    onDelete: (id: number) => void;
}

export const OutgoingGoodTable: React.FC<OutgoingGoodTableProps> = ({ outgoingGoods, onEdit, onDelete, startIndex }) => {
    return (
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
                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {outgoingGoods.map((outgoingGoods, index) => (
                    <tr key={outgoingGoods.id}>
                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                        <td className="py-2 px-4 border-b">{outgoingGoods.borrowerName}</td>
                        <td className="py-2 px-4 border-b">{outgoingGoods.role}</td>
                        <td className="py-2 px-4 border-b">{outgoingGoods.inventory.name}</td>
                        <td className="py-2 px-4 border-b">{outgoingGoods.quantity}</td>
                        <td className="py-2 px-4 border-b">
                            {new Date(outgoingGoods.borrowDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-2 px-4 border-b">
                            {new Date(outgoingGoods.returnDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-2 px-4 border-b">{outgoingGoods.reason}</td>
                        <td className="py-2 px-4 border-b">
                            {getGuaranteeOutgoingGoodsLabel(outgoingGoods.guarantee)}
                        </td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(outgoingGoods)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(outgoingGoods.id!)}
                                    className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                >
                                    <i className="bx bxs-trash-alt text-lg"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};