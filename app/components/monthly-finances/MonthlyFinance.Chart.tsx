import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Expense } from "@/app/api/expenses/types";
import { Income } from "@/app/api/incomes/types";

Chart.register(...registerables);

interface MonthlyFinanceChartProps {
    monthlyData: { month: string; income: number; expense: number }[];
}

export const MonthlyFinanceChart: React.FC<MonthlyFinanceChartProps> = ({ monthlyData }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const dataWithMonths = months.map((month) => {
        const found = monthlyData.find(item => item.month === month);
        return {
            month,
            income: found ? found.income : 0,
            expense: found ? found.expense : 0,
        };
    });

    const totalIncome = dataWithMonths.reduce((acc, item) => acc + item.income, 0);
    const totalExpense = dataWithMonths.reduce((acc, item) => acc + item.expense, 0);
    const remaining = totalIncome - totalExpense;

    console.log("Sisa keuangan:", remaining);

    useEffect(() => {
        const ctx = chartRef.current?.getContext("2d");
        if (ctx) {
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: dataWithMonths.map(item => item.month),
                    datasets: [
                        {
                            label: "Pendapatan (Rp)",
                            data: dataWithMonths.map(item => item.income),
                            backgroundColor: "#1F509A",
                            borderRadius: 5,
                            barThickness: 30,
                        },
                        {
                            label: "Pengeluaran (Rp)",
                            data: dataWithMonths.map(item => item.expense),
                            backgroundColor: "#FF6384",
                            borderRadius: 5,
                            barThickness: 30,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Jumlah (Rp)",
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: "Bulan",
                            },
                        },
                    },
                },
            });
        }

        return () => {
            if (ctx) {
                Chart.getChart(ctx)?.destroy();
            }
        };
    }, [dataWithMonths]);

    return <canvas ref={chartRef} className="w-full h-60" />;
};