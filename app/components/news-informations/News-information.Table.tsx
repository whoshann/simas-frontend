import { NewsInformation } from '@/app/api/news-informations/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface NewsInformationTableProps {
    newsinformations: NewsInformation[];
    startIndex: number;
    onEdit: (newsinformation: NewsInformation) => void;
    onDelete: (id: number) => void;
}

export const NewsInformationTable: React.FC<NewsInformationTableProps> = ({ newsinformations, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b text-left">No</th>
                <th className="py-2 px-4 border-b text-left">Gambar</th>
                <th className="py-2 px-4 border-b text-left">Judul</th>
                <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                <th className="py-2 px-4 border-b text-left">Tanggal</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
            </thead>
            <tbody>
                {newsinformations.map((newsinformation, index) => (
                    <tr key={newsinformation.id}>
                        <td className="py-2 px-4 border-b">{startIndex + newsinformations.indexOf(newsinformation) + 1}</td>
                        <td className="py-2 px-4 border-b">{newsinformation.photo}</td>
                        <td className="py-2 px-4 border-b">{newsinformation.title}</td>
                        <td className="py-2 px-4 border-b">{newsinformation.description}</td>
                        <td className="py-2 px-4 border-b">{newsinformation.date}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(newsinformation)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(newsinformation.id!)}
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