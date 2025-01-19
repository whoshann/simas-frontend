import React, { useState } from 'react';
import { MonthlyFinance } from '@/app/api/monthly-finances/types';
import { MonthlyFinanceChart } from '../monthly-finances/MonthlyFinance.Chart';
import { Expense } from '@/app/api/expenses/types';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Expense) => void;
    expenseData?: Expense | null;
    monthlyFinances: MonthlyFinance[];
}

export const ExpensesModal: React.FC<ExpenseModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    expenseData,
    monthlyFinances 
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<Expense>(expenseData || {
        description: '',
        monthlyFinanceId: 0,
        amount: 0,
        expenseDate: Date.now(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'amount' || name === 'monthlyFinanceId' 
            ? parseInt(value, 10) 
            : value;

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const { 
            id, 
            createdAt, 
            updatedAt, 
            monthlyFinanceId,
            ...submitData 
        } = formData;
        
        onSubmit({
            ...submitData,
            monthlyFinanceId,
        });
        onClose();
    };

    console.log(monthlyFinances);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[28rem] max-h-[80vh] overflow-hidden mx-4">
                <div className="bg-white p-4 sticky top-0 z-10">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl mb-2 font-semibold text-[var(--text-semi-bold-color)]">
                        {expenseData ? 'Edit Data Pengeluaran' : 'Tambah Data Pengeluaran'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Deskripsi</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Bulan</label>
                            <select
                                name="monthlyFinanceId"
                                value={formData.monthlyFinanceId}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                <option value="">Pilih Bulan</option>
                                {monthlyFinances.map((monthlyFinance) => (
                                    <option key={monthlyFinance.id} value={monthlyFinance.id}>
                                        {monthlyFinance.month} 
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jumlah</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Pengeluaran</label>
                            <input
                                type="date"
                                name="expenseDate"
                                value={formData.expenseDate ? new Date(formData.expenseDate).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {expenseData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExpensesModal;