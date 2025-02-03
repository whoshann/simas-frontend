import { ConditionLabel } from "@/app/utils/enumHelpers";
import { FinanceOverviews } from "@/app/api/finance-overviews/types";
import { useEffect, useState } from 'react';
import { useFinanceOverviews } from "@/app/hooks/useFinanceOverviews";

interface FinanceOverviewTableProps {
    financeOverviews: FinanceOverviews[];
    startIndex: number;
    onEdit: (financeOverviews: FinanceOverviews) => void;
    onDelete: (id: number) => void;
}

export const FinanceOverviewTable: React.FC<FinanceOverviewTableProps> = ({ financeOverviews, onEdit, onDelete, startIndex }) => {
    const { updateFinanceOverviews } = useFinanceOverviews();
    const [remainingBalance, setRemainingBalance] = useState(0);

    const handleUpdateFinanceOverview = async () => {
        try {
            await updateFinanceOverviews(0, {
                totalBalance: remainingBalance,
                lastUpdate: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            console.error('Error updating finance overview:', error);
        }
    };

    useEffect(() => {
        if (remainingBalance !== 0) {
            handleUpdateFinanceOverview();
        }
    }, [remainingBalance]);

    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">No</th>
                    <th className="py-2 px-4 border-b">Total Keuangan</th>
                    <th className="py-2 px-4 border-b">Tanggal Terbaru</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {financeOverviews.map((financeoverview, index) => (
                    <tr key={financeoverview.id}>
                        <td className="py-2 px-4 border-b">{startIndex + index + 1}</td>
                        <td className="py-2 px-4 border-b">{financeoverview.totalBalance}</td>
                        <td className="py-2 px-4 border-b">{financeoverview.lastUpdate}</td>
                        
                        <td className="py-2 px-4 border-b">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(financeoverview)}
                                    className="w-8 h-8 rounded-full bg-[#1f509a2b] flfinanceoverviews-center justify-center text-[var(--main-color)]"
                                >
                                    <i className="bx bxs-edit text-lg"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(financeoverview.id!)}
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