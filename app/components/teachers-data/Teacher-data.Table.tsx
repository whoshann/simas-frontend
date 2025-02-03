import { TeacherData } from '@/app/api/teachers-data/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface TeacherDataTableProps {
    teachersdata: TeacherData[];
    startIndex: number;
    onEdit: (teacherdata: TeacherData) => void;
    onDelete: (id: number) => void;
}

export const TeacherDataTable: React.FC<TeacherDataTableProps> = ({ teachersdata, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b text-left">No</th>
                    <th className="py-2 px-4 border-b text-left">Nama</th>
                    <th className="py-2 px-4 border-b text-left">NIP</th>
                    <th className="py-2 px-4 border-b text-left">Jenis Kelamin</th>
                    <th className="py-2 px-4 border-b text-left">Tanggal Lahir</th>
                    <th className="py-2 px-4 border-b text-left">Tempat Lahir</th>
                    <th className="py-2 px-4 border-b text-left">Alamat</th>
                    <th className="py-2 px-4 border-b text-left">Telepon</th>
                    <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {teachersdata.map((teacherdata, index) => (
                    <tr key={teacherdata.id}>
                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                        <td className="py-2 px-4 border-b">{teacherdata.name}</td>
                        <td className="py-2 px-4 border-b">{teacherdata.nip}</td>
                        <td className="py-2 px-4 border-b">{teacherdata.gender}</td>
                        <td className="py-2 px-4 border-b">{teacherdata.birthDate}</td>
                        <td className="py-2 px-4 border-b">{teacherdata.birthPlace}</td>
                        <td className="py-2 px-4 border-b">{teacherdata.address}</td>
                        <td className="py-2 px-4 border-b">{teacherdata.phone}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(teacherdata)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(teacherdata.id!)}
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