import axios, { AxiosError } from "axios"; 
import Cookies from "js-cookie";
import { Achievements, AchievementsResponse} from "./types";

const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("token")}`,
    "Content-Type": "application/json",
});

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/achievement`;

export const achievementsApi = {
    getAll: async (): Promise<AchievementsResponse> => {
        const response = await axios.get(`${API_URL}`, { headers: getHeaders() });
        console.log("Achievements data:", response.data); // Untuk debugging
        return response.data;
    },
    
    create: async (formData: FormData): Promise<AchievementsResponse> => {
        try {
            // Debug: Log data sebelum dikirim
            console.log('Form Data yang akan dikirim:', {
                studentId: formData.get('studentId'),
                classId: formData.get('classId'),
                achievementName: formData.get('achievementName'),
                competitionName: formData.get('competitionName'),
                typeOfAchievement: formData.get('typeOfAchievement'),
                achievementDate: formData.get('achievementDate'),
                photo: formData.get('photo')
            });

            const response = await axios.post(`${API_URL}`, formData, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle Axios error dengan tipe yang benar
                const axiosError = error as AxiosError;
                console.error('Error detail:', axiosError.response?.data);
                throw axiosError;
            } else {
                // Handle error umum
                console.error('Unexpected error:', error);
                throw new Error('An unexpected error occurred');
            }
        }
    },
    delete: async (id: number): Promise<AchievementsResponse> => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getHeaders(),
        });
        return response.data;
    },
};