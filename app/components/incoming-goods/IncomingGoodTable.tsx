import { ConditionLabel } from "@/app/utils/enumHelpers";
import { IncomingGoods } from "@/app/api/incoming-goods/types";

interface IncomingGoodTableProps {
    incomingGoods: IncomingGoods[];
    startIndex: number;
    onEdit: (incomingGoods: IncomingGoods) => void;
    onDelete: (id: number) => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const IncomingGoodTable: React.FC<IncomingGoodTableProps> = ({ incomingGoods, onEdit, onDelete, startIndex }) => {

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'Good':
                return 'bg-[#0a97b02a] text-[var(--third-color)]';
            case 'MinorDamage':
                return 'bg-[#e88e1f29] text-[var(--second-color)]';
            case 'SevereDamage':
                return 'bg-[#bd000025] text-[var(--fourth-color)]';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-left">No</th>
                    <th className="py-2 px-4 border-b text-left">Nama Barang</th>
                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                    <th className="py-2 px-4 border-b text-left">Kondisi</th>
                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {incomingGoods.map((item, index) => (
                    <tr key={item.id}>
                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                        <td className="py-2 px-4 border-b">{item.inventory?.name || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{item.quantity}</td>
                        <td className="py-2 px-4 border-b">{formatDate(item.date)}</td>
                        <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-md font-medium ${getConditionColor(item.condition)}`}>
                                {ConditionLabel[item.condition]}
                            </span>
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
                {incomingGoods.length === 0 && (
                    <tr>
                        <td colSpan={10} className="text-center py-4">Tidak ada data</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};