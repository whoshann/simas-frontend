import { StudentData } from '@/app/api/students-data/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface StudentDataTableProps {
    studentsdata: StudentData[];
    startIndex: number;
    onEdit: (studentdata: StudentData) => void;
    onDelete: (id: number) => void;
}

export const StudentDataTable: React.FC<StudentDataTableProps> = ({ studentsdata, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b text-left">No</th>
                <th className="py-2 px-4 border-b text-left">Nama</th>
                <th className="py-2 px-4 border-b text-left">Kelas</th>
                <th className="py-2 px-4 border-b text-left">Jurusan</th>
                <th className="py-2 px-4 border-b text-left">Nis</th>
                <th className="py-2 px-4 border-b text-left">Nisn</th>
                <th className="py-2 px-4 border-b text-left">Jenis Kelamin</th>
                <th className="py-2 px-4 border-b text-left">Tanggal Lahir</th>
                <th className="py-2 px-4 border-b text-left">Tempat Lahir</th>
                <th className="py-2 px-4 border-b text-left">Alamat</th>
                <th className="py-2 px-4 border-b text-left">Nomor</th>
                <th className="py-2 px-4 border-b text-left">Nomor Orangtua</th>
                <th className="py-2 px-4 border-b text-left">Agama</th>
                <th className="py-2 px-4 border-b text-left">Nama Ibu</th>
                <th className="py-2 px-4 border-b text-left">Nama Ayah</th>
                <th className="py-2 px-4 border-b text-left">Wali</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {studentsdata.map((studentdata, index) => (
                    <tr key={studentdata.id}>
                        <td className="py-2 px-4 border-b">{startIndex + studentsdata.indexOf(studentdata) + 1}</td>
                        <td className="py-2 px-4 border-b">{studentdata.name}</td>
                        <td className="py-2 px-4 border-b">{studentdata.classSchool}</td>
                        <td className="py-2 px-4 border-b">{studentdata.major}</td>
                        <td className="py-2 px-4 border-b">{studentdata.nis}</td>
                        <td className="py-2 px-4 border-b">{studentdata.nisn}</td>
                        <td className="py-2 px-4 border-b">{studentdata.gender}</td>
                        <td className="py-2 px-4 border-b">{studentdata.birthDate}</td>
                        <td className="py-2 px-4 border-b">{studentdata.birthPlace}</td>
                        <td className="py-2 px-4 border-b">{studentdata.address}</td>
                        <td className="py-2 px-4 border-b">{studentdata.phone}</td>
                        <td className="py-2 px-4 border-b">{studentdata.parentPhone}</td>
                        <td className="py-2 px-4 border-b">{studentdata.religion}</td>
                        <td className="py-2 px-4 border-b">{studentdata.motherName}</td>
                        <td className="py-2 px-4 border-b">{studentdata.fatherName}</td>
                        <td className="py-2 px-4 border-b">{studentdata.guardian || '-'}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(studentdata)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(studentdata.id!)}
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