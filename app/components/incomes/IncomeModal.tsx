import React, { useState, useEffect } from 'react';
import { MonthlyFinance } from '@/app/api/monthly-finances/types';
import { Income } from '@/app/api/incomes/types';

interface IncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Income) => void;
    incomeData?: Income | null;
    monthlyFinances: MonthlyFinance[];
}

export const IncomesModal: React.FC<IncomeModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    incomeData,
    monthlyFinances 
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<Income>(incomeData || {
        description: '',
        monthlyFinanceId: 0,
        amount: 0,
        incomeDate: Date.now(),
        source: '',
    });

    const [monthlyFinanceDetails, setMonthlyFinanceDetails] = useState<MonthlyFinance | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'amount' || name === 'monthlyFinanceId'
            ? parseInt(value, 10)
            : value;

        setFormData({
            ...formData,
            [name]: newValue,
        });

        // Fetch data ketika bulan dipilih
        if (name === 'monthlyFinanceId' && value) {
            fetchMonthlyFinanceDetails(parseInt(value, 10));
        }
    };

    const fetchMonthlyFinanceDetails = async (monthlyFinanceId: number) => {
        try {
            // Simulasi fetch API, sesuaikan URL sesuai kebutuhan
            const response = await fetch(`/api/monthly-finances/${monthlyFinanceId}`);
            const data: MonthlyFinance = await response.json();
            setMonthlyFinanceDetails(data);
        } catch (error) {
            console.error('Failed to fetch monthly finance details:', error);
        }
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[28rem] max-h-[80vh] overflow-hidden mx-4">
                <div className="bg-white p-4 sticky top-0 z-10">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl mb-2 font-semibold text-[var(--text-semi-bold-color)]">
                        {incomeData ? 'Edit Data Pemasukan' : 'Tambah Data Pemasukan'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Sumber</label>
                            <input
                                type="text"
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
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
                        
                        {monthlyFinanceDetails && (
                            <div className="mb-4">
                                <p className="text-[var(--text-semi-bold-color)]">
                                    Detail Bulan Terpilih:
                                </p>
                                <p>Pendapatan: {monthlyFinanceDetails.income}</p>
                                <p>Pengeluaran: {monthlyFinanceDetails.expenses}</p>
                            </div>
                        )}
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
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Pemasukan</label>
                            <input
                                type="date"
                                name="incomeDate"
                                value={formData.incomeDate ? new Date(formData.incomeDate).toISOString().split('T')[0] : ''}
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
                                {incomeData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IncomesModal;
