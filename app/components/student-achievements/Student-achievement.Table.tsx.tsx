import { StudentAchievement } from '@/app/api/student-achievements/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface StudentAchievementTableProps {
    studentachievements: StudentAchievement[];
    startIndex: number;
    onEdit: (studentachievement: StudentAchievement) => void;
    onDelete: (id: number) => void;
}

export const StudentAchievementTable: React.FC<StudentAchievementTableProps> = ({ studentachievements, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
            <tr>
                <th className="py-2 px-4 border-b text-left">No</th>
                <th className="py-2 px-4 border-b text-left">Nama</th>
                <th className="py-2 px-4 border-b text-left">Kelas</th>
                <th className="py-2 px-4 border-b text-left">Prestasi</th>
                <th className="py-2 px-4 border-b text-left">Kategori</th>
                <th className="py-2 px-4 border-b text-left">Bukti Foto</th>
                <th className="py-2 px-4 border-b text-left">Tanggal</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
            </tr>
            </thead>
            <tbody>
                {studentachievements.map((studentachievement, index) => (
                    <tr key={studentachievement.id}>
                        <td className="py-2 px-4 border-b">{startIndex + studentachievements.indexOf(studentachievement) + 1}</td>
                        <td className="py-2 px-4 border-b">{studentachievement.name}</td>
                        <td className="py-2 px-4 border-b">{studentachievement.classSchool}</td>
                        <td className="py-2 px-4 border-b">{studentachievement.achievement}</td>
                        <td className="py-2 px-4 border-b">
                            <span className={`inline-block px-3 py-1 rounded-full ${studentachievement.category === 'Non Akademik' ? 'bg-[#0a97b028] text-[var(--third-color)]' : studentachievement.category === 'Akademik' ? 'bg-[#e88e1f29] text-[var(--second-color)] ' : ''}`}>
                                {studentachievement.category}
                            </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                            <div className="w-16 h-16 overflow-hidden rounded">
                                {studentachievement.photoEvidence? (
                                    <img
                                        src={studentachievement.photoEvidence}
                                        alt="Bukti Surat"
                                        className="w-full h-full object-cover"
                                        width={256}
                                        height={256}
                                    />
                                ) : (
                                    '-'
                                )}
                            </div>
                        </td>
                        <td className="py-2 px-4 border-b">{studentachievement.date}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(studentachievement)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(studentachievement.id!)}
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