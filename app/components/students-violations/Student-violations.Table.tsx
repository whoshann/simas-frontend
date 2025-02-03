import { StudentViolations } from '@/app/api/students-violations/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface StudentViolationsTableProps {
    studentsviolations: StudentViolations[];
    startIndex: number;
    onEdit: (studentviolations: StudentViolations) => void;
    onDelete: (id: number) => void;
}

export const StudentViolationsTable: React.FC<StudentViolationsTableProps> = ({ studentsviolations, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b text-left">No</th>
                <th className="py-2 px-4 border-b text-left">Nama</th>
                <th className="py-2 px-4 border-b text-left">Kelas</th>
                <th className="py-2 px-4 border-b text-left">Pelanggaran</th>
                <th className="py-2 px-4 border-b text-left">Kategori</th>
                <th className="py-2 px-4 border-b text-left">Hukuman</th>
                <th className="py-2 px-4 border-b text-left">Bukti Foto</th>
                <th className="py-2 px-4 border-b text-left">Tanggal</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {studentsviolations.map((studentviolations, index) => (
                    <tr key={studentviolations.id}>
                        <td className="py-2 px-4 border-b">{startIndex + studentsviolations.indexOf(studentviolations) + 1}</td>
                        <td className="py-2 px-4 border-b">{studentviolations.name}</td>
                        <td className="py-2 px-4 border-b">{studentviolations.classSchool}</td>
                        <td className="py-2 px-4 border-b">{studentviolations.violations}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(studentviolations)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(studentviolations.id!)}
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