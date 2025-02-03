import React, { useState } from 'react';
import { FinanceOverviews } from '@/app/api/finance-overviews/types';
import { MonthlyFinance } from '@/app/api/monthly-finances/types';


interface FinanceOverviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FinanceOverviews) => void;
    financeOverviewsData?: FinanceOverviews | null;
    monthlyFinances: MonthlyFinance[];
}

export const FinanceOverviewsModal: React.FC<FinanceOverviewsModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    financeOverviewsData,
    monthlyFinances 
}) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<FinanceOverviews>(financeOverviewsData || {
        monthlyFinanceId: 0,
        totalBalance: 0,
        lastUpdate: new Date().toISOString().split('T')[0],
 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'quantity' || name === 'monthlyFinancesId' 
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
            monthlyFinance,
            ...submitData 
        } = formData;
        
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
                        {financeOverviewsData ? 'Edit Data Keuangan Utama' : 'Tambah Data Keuangan Utama'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Total Balance</label>
                            <input
                                type="number"
                                name="totalBalance"
                                value={formData.totalBalance}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Last Update</label>
                            <input
                                type="date"
                                name="lastUpdate"
                                value={formData.lastUpdate}
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
                                {financeOverviewsData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverviewsModal;