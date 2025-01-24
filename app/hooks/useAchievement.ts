import { useState } from "react";
import { Achievements } from "@/app/api/achievement/types";
import { achievementsApi } from "@/app/api/achievement";

export const useAchievements = () => {
    const [achievements, setAchievements] = useState<Achievements[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const response = await achievementsApi.getAll();
            setAchievements(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Error fetching achievements");
          console.error("Error fetching achievements:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        achievements,
        loading,
        error,
        fetchAchievements,
    };
};