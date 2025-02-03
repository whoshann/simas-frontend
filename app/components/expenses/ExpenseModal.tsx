import React, { useState } from 'react';
import { MonthlyFinance } from '@/app/api/monthly-finances/types';
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
        expenseDate: new Date().toISOString(),
    });

    const [displayAmount, setDisplayAmount] = useState(
        formatRupiah(expenseData?.amount || 0)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'amount') {
            const numericValue = parseRupiah(value);
            setDisplayAmount(formatRupiah(numericValue));
            setFormData(prev => ({
                ...prev,
                amount: numericValue
            }));
            return;
        }

        if (name === 'monthlyFinanceId') {
            setFormData(prev => ({
                ...prev,
                monthlyFinanceId: parseInt(value, 10)
            }));
            return;
        }

        if (name === 'expenseDate') {
            setFormData(prev => ({
                ...prev,
                expenseDate: new Date(value).toISOString()
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            description: formData.description,
            monthlyFinanceId: formData.monthlyFinanceId,
            amount: formData.amount,
            expenseDate: formData.expenseDate
        };
        
        onSubmit(submitData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[28rem] max-h-[80vh] overflow-hidden mx-4">
                <div className="bg-white p-4 sticky top-0 z-10">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl mb-2 font-semibold text-[var(--text-semi-bold-color)]">
                        {expenseData ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
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
                                {monthlyFinances.map((finance) => (
                                    <option key={finance.id} value={finance.id}>
                                        {new Date(finance.month).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long'
                                        })}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jumlah</label>
                            <input
                                type="text"
                                name="amount"
                                value={displayAmount}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                placeholder="Rp 0"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Pengeluaran</label>
                            <input
                                type="date"
                                name="expenseDate"
                                value={new Date(formData.expenseDate).toISOString().split('T')[0]}
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
                                {expenseData ? 'Update' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const formatRupiah = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const parseRupiah = (value: string): number => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return parseInt(numericValue, 10) || 0;
};

export default ExpensesModal;