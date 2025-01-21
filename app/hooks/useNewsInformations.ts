import { useState } from 'react';
import { NewsInformation } from '@/app/api/news-informations/types';
import { newsinformationsApi } from '@/app/api/news-informations';

export const useNewsInformations = () => {
    const [newsinformations, setNewsInformations] = useState<NewsInformation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNewsInformations = async () => {
        try {
            setLoading(true);
            const response = await newsinformationsApi.getAll();
            setNewsInformations(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching students');
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const createNewsInformation = async (data: Omit<NewsInformation, 'id'>) => {
        try {
            const response = await newsinformationsApi.create(data);
            setNewsInformations([...newsinformations, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating student:', err);
            throw err;
        }
    };

    const updateNewsInformation = async (id: number, data: Partial<NewsInformation>) => {
        try {
            const response = await newsinformationsApi.update(id, data);
            const updatedData = Array.isArray(response.data) ? response.data[0] : response.data;
            setNewsInformations(
                newsinformations.map((newsinformation): NewsInformation => 
                    newsinformation.id === id ? updatedData : newsinformation
                )
            );
            return updatedData;
        } catch (err: any) {
            console.error('Error updating student:', err);
            throw err;
        }
    };

    const deleteNewsInformation = async (id: number) => {
        try {
            await newsinformationsApi.delete(id);
            setNewsInformations(newsinformations.filter(newsinformation => newsinformation.id !== id));
        } catch (err: any) {
            console.error('Error deleting student:', err);
            throw err;
        }
    };

    return {
        newsinformations,
        loading,
        error,
        fetchNewsInformations,
        createNewsInformation,
        updateNewsInformation,
        deleteNewsInformation
    };
};