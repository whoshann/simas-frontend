import { Income } from '@/app/api/incomes/types';
import { formatDateDisplay, formatDate, formatRupiah } from '@/app/utils/helper';

interface IncomeTableProps {
    incomes: Income[];
    startIndex: number;
    onEdit: (income: Income) => void;
    onDelete: (id: number) => void;
}

export const IncomeTable: React.FC<IncomeTableProps> = ({ incomes, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b text-left">No</th>
                <th className="py-2 px-4 border-b text-left">Bulan</th>
                <th className="py-2 px-4 border-b text-left">Sumber</th>
                <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                <th className="py-2 px-4 border-b text-left">Jumlah</th>
                <th className="py-2 px-4 border-b text-left">Tanggal Pemasukan</th>
                <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {incomes.map((income) => (
                    <tr key={income.id}>
                        <td className="py-2 px-4 border-b">{startIndex + incomes.indexOf(income) + 1}</td>
                        <td className="py-2 px-4 border-b">{formatDateDisplay(income.MonthlyFinance.month)}</td>
                        <td className="py-2 px-4 border-b">{income.source}</td>
                        <td className="py-2 px-4 border-b">{income.description}</td>
                        <td className="py-2 px-4 border-b">{formatRupiah(income.amount)}</td>
                        <td className="py-2 px-4 border-b">{formatDate(income.incomeDate)}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(income)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(income.id!)}
                                    className="w-8 h-8 rounded-full bg-[#bd000029] flex items-center justify-center text-[var(--fourth-color)]"
                                >
                                    <i className="bx bxs-trash-alt text-lg"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {incomes.length === 0 && (
                    <tr>
                        <td colSpan={10} className="text-center py-4">Tidak ada data</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};