import { Room } from '@/app/api/rooms/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface RoomTableProps {
    rooms: Room[];
    startIndex: number;
    onEdit: (room: Room) => void;
    onDelete: (id: number) => void;
}

export const RoomTable: React.FC<RoomTableProps> = ({ rooms, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">No</th>
                    <th className="py-2 px-4 border-b">Nama</th>
                    <th className="py-2 px-4 border-b">Tipe</th>
                    <th className="py-2 px-4 border-b">Kapasitas</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
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
                            {getStatusInIndonesian(room.status as keyof typeof statusMapping)}
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
            </tbody>
        </table>
    );
};