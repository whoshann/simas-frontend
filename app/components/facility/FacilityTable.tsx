import { Facility } from '@/app/api/facilities/types';

interface FacilityTableProps {
    facilities: Facility[];
    startIndex: number;
    onEdit: (facility: Facility) => void;
    onDelete: (id: number) => void;
}

export const FacilityTable: React.FC<FacilityTableProps> = ({ facilities, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-left">No</th>
                    <th className="py-2 px-4 border-b text-left">Nama Fasilitas</th>
                    <th className="py-2 px-4 border-b text-left">Jumlah</th>
                    <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                    <th className="py-2 px-4 border-b text-left">Catatan</th>
                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {facilities.map((facility, index) => (
                    <tr key={facility.id}>
                        <td className="py-2 px-4 border-b">{startIndex + facilities.indexOf(facility) + 1}</td>
                        <td className="py-2 px-4 border-b">{facility.name}</td>
                        <td className="py-2 px-4 border-b">{facility.count}</td>
                        <td className="py-2 px-4 border-b">{facility.description}</td>
                        <td className="py-2 px-4 border-b">{facility.note || '-'}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(facility)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(facility.id!)}
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