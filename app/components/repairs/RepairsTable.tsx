import { Repairs } from "@/app/api/repairs/types";
import { RepairCategoryLabel, RepairStatusLabel } from "@/app/utils/enumHelpers";

interface RepairsTableProps {
    repairs: Repairs[];
    startIndex: number;
    onEdit: (repairs: Repairs) => void;
    onDelete: (id: number) => void;
}

export const RepairsTable: React.FC<RepairsTableProps> = ({ repairs, onEdit, onDelete, startIndex }) => {
    // Format currency
    const formatRupiah = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">No</th>
                    <th className="py-2 px-4 border-b">Nama</th>
                    <th className="py-2 px-4 border-b">Kategori</th>
                    <th className="py-2 px-4 border-b">Biaya</th>
                    <th className="py-2 px-4 border-b">Deskripsi</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Tanggal Perbaikan</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {repairs.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="py-4 text-center text-gray-500">
                            Tidak ada data
                        </td>
                    </tr>
                ) : (
                    repairs.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-center">
                                {startIndex + index + 1}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {item.inventory?.name || item.room?.name}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {item.category === 'Items' ? 'Barang' : 'Ruangan'}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {formatRupiah(item.cost)}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {item.description}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    item.status === 'Completed' 
                                        ? 'bg-green-100 text-green-800'
                                        : item.status === 'InProgress'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {item.status === 'Completed' 
                                        ? 'Selesai'
                                        : item.status === 'InProgress'
                                        ? 'Sedang Dikerjakan'
                                        : 'Pending'}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b">
                                {formatDate(item.maintenanceDate)}
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
                    ))
                )}
            </tbody>
        </table>
    );
};