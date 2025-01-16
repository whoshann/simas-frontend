import { ConditionLabel } from "@/app/utils/enumHelpers";
import { IncomingGoods } from "@/app/api/incoming-goods/types";

interface IncomingGoodTableProps {
    incomingGoods: IncomingGoods[];
    startIndex: number;
    onEdit: (incomingGoods: IncomingGoods) => void;
    onDelete: (id: number) => void;
}

export const IncomingGoodTable: React.FC<IncomingGoodTableProps> = ({ incomingGoods, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">No</th>
                    <th className="py-2 px-4 border-b">Nama Barang</th>
                    <th className="py-2 px-4 border-b">Jumlah</th>
                    <th className="py-2 px-4 border-b">Tanggal</th>
                    <th className="py-2 px-4 border-b">Kondisi</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {incomingGoods.map((item, index) => (
                    <tr key={item.id}>
                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                        <td className="py-2 px-4 border-b">{item.inventory?.name || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{item.quantity}</td>
                        <td className="py-2 px-4 border-b">{item.date}</td>
                        <td className="py-2 px-4 border-b">
                            {ConditionLabel[item.condition]}
                        </td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(item.id!)}
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