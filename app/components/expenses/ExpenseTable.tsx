import { Expense } from '@/app/api/expenses/types';
import { getStatusInIndonesian, statusMapping } from '../../utils/statusConverter';

interface ExpenseTableProps {
    expenses: Expense[];
    startIndex: number;
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete, startIndex }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b text-left">No</th>
                <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                <th className="py-2 px-4 border-b text-left">Jumlah</th>
                <th className="py-2 px-4 border-b text-left">Tanggal Pengeluaran</th>
                <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((expense) => (
                    <tr key={expense.id}>
                        <td className="py-2 px-4 border-b">{startIndex + expenses.indexOf(expense) + 1}</td>
                        <td className="py-2 px-4 border-b">{expense.description}</td>
                        <td className="py-2 px-4 border-b">{expense.amount}</td>
                        <td className="py-2 px-4 border-b">{expense.expenseDate}</td>
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(expense)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flex items-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(expense.id!)}
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