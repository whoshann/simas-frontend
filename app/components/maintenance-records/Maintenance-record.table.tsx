import { MaintenanceRecord } from '@/app/api/maintenance-records/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface MaintenanceRecordTableProps {
    maintenancerecords: MaintenanceRecord[];
    startIndex: number;
    onEdit: (maintenancerecord: MaintenanceRecord) => void;
    onDelete: (id: number) => void;
}

export const MaintenanceRecordTable: React.FC<MaintenanceRecordTableProps> = ({ maintenancerecords, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b text-left">No</th>
                <th className="py-2 px-4 border-b text-left">Kategori</th>
                <th className="py-2 px-4 border-b text-left">Nama</th>
                <th className="py-2 px-4 border-b text-left">Tanggal</th>
                <th className="py-2 px-4 border-b text-left">Biaya Perbaikan</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {maintenancerecords.map((maintenancerecord) => (
                    <tr key={maintenancerecord.id}>
                        <td className="py-2 px-4 border-b">{startIndex + maintenancerecords.indexOf(maintenancerecord) + 1}</td>
                        <td className="py-2 px-4 border-b">{maintenancerecord.category}</td>
                        <td className="py-2 px-4 border-b">{maintenancerecord.description}</td>
                        <td className="py-2 px-4 border-b">{maintenancerecord.maintenanceDate}</td>
                        <td className="py-2 px-4 border-b">{maintenancerecord.cost}</td>
                        <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-xs ${maintenancerecord.status === "Belum Diproses" ? 'bg-red-100 text-red-600' : maintenancerecord.status === "Sedang Proses" ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                {maintenancerecord.status}
                            </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                            {getStatusInIndonesian(maintenancerecord.status as keyof typeof statusMapping)}
                        </td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(maintenancerecord)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(maintenancerecord.id!)}
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