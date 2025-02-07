import { useState } from "react";
import { Achievements } from "@/app/api/achievement/types";
import { achievementsApi } from "@/app/api/achievement";

export const useAchievements = (studentId?: number) => {
    const [achievements, setAchievements] = useState<Achievements[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const response = await achievementsApi.getAll();
            // Filter berdasarkan studentId jika ada
            const filteredData = studentId 
                ? response.data.filter(achievement => achievement.studentId === studentId)
                : response.data;
            setAchievements(filteredData);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Error fetching achievements");
            console.error("Error fetching achievements:", err);
        } finally {
            setLoading(false);
        }
  };

  const createAchievement = async (formData: FormData) => {
    try {
        const response = await achievementsApi.create(formData);
        await fetchAchievements(); // Refresh data setelah create
        return { success: true, message: "Prestasi berhasil ditambahkan" };
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Error menambahkan prestasi";
        return { success: false, message: errorMessage };
    }
};
  
    const deleteAchievement = async (id: number) => {
        try {
            await achievementsApi.delete(id);
            await fetchAchievements(); // Refresh data setelah delete
            return { success: true, message: "Prestasi berhasil dihapus" };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error deleting achievement";
            return { success: false, message: errorMessage };
        }
    };

    return {
        achievements,
        loading,
        error,
        fetchAchievements,
        createAchievement,
        deleteAchievement
    };
};