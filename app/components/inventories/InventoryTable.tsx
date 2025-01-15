import { Inventory } from '@/app/api/inventories/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface InventoryTableProps {
    inventories: Inventory[];
    startIndex: number;
    onEdit: (inventory: Inventory) => void;
    onDelete: (id: number) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
    inventories,
    onEdit,
    onDelete,
    startIndex
}) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-left">No</th>
                    <th className="py-2 px-4 border-b text-left">Kode Barang</th>
                    <th className="py-2 px-4 border-b text-left">Nama Barang</th>
                    <th className="py-2 px-4 border-b text-left">Gambar</th>
                    <th className="py-2 px-4 border-b text-left">Stok</th>
                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {inventories.map((inventory) => (
                    <tr key={inventory.id}>
                        <td className="py-2 px-4 border-b">{startIndex + inventories.indexOf(inventory) + 1}</td>
                        <td className="py-2 px-4 border-b">{inventory.code}</td>
                        <td className="py-2 px-4 border-b">{inventory.name}</td>
                        <td className="py-2 px-4 border-b">{inventory.photo}</td>
                        <td className="py-2 px-4 border-b">{inventory.stock}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(inventory)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(inventory.id!)}
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