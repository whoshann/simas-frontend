import { Room } from '@/app/api/rooms/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface RoomTableProps {
    rooms: Room[];
    startIndex: number;
    onEdit: (room: Room) => void;
    onDelete: (id: number) => void;
}

export const RoomTable: React.FC<RoomTableProps> = ({ rooms, onEdit, onDelete, startIndex }) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available':
                return 'bg-[#0a97b02a] text-[var(--third-color)]';
            case 'InUse':
                return 'bg-[#e88e1f29] text-[var(--second-color)]';
            case 'UnderRepair':
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
                    <th className="py-2 px-4 border-b text-left">Nama</th>
                    <th className="py-2 px-4 border-b text-left">Tipe</th>
                    <th className="py-2 px-4 border-b text-left">Kapasitas</th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map((room) => (
                    <tr key={room.id}>
                        <td className="py-2 px-4 border-b">{startIndex + rooms.indexOf(room) + 1}</td>
                        <td className="py-2 px-4 border-b">{room.name}</td>
                        <td className="py-2 px-4 border-b">{room.type}</td>
                        <td className="py-2 px-4 border-b">{room.capacity}</td>
                        <td className="py-2 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-md font-medium ${getStatusColor(room.status)}`}>
                                {getStatusInIndonesian(room.status as keyof typeof statusMapping)}
                            </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(room)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(room.id!)}
                                    className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                >
                                    <i className="bx bxs-trash-alt text-lg"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {rooms.length === 0 && (
                    <tr>
                        <td colSpan={10} className="text-center py-4">Tidak ada data</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};