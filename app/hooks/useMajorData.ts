import { useState } from 'react';
import { Major } from '@/app/api/major-data/types';
import { majorsApi } from '@/app/api/major-data';

export const useMajors = () => {
    const [majors, setMajors] = useState<Major[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMajors = async () => {
        try {
            setLoading(true);
            const response = await majorsApi.getAll();
            setMajors(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching majors');
            console.error('Error fetching majors:', err);
        } finally {
            setLoading(false);
        }
    };

    const createMajor = async (data: Omit<Major, 'id'>) => {
        try {
            const response = await majorsApi.create(data);
            setMajors([...majors, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating major:', err);
            throw err;
        }
    };

    const updateMajor = async (id: number, data: Partial<Major>) => {
        try {
            const response = await majorsApi.update(id, data);
            setMajors(majors.map(major => 
                major.id === id ? response.data : major
            ));
            return response.data;
        } catch (err: any) {
            console.error('Error updating major:', err);
            throw err;
        }
    };

    const deleteMajor = async (id: number) => {
        try {
            await majorsApi.delete(id);
            setMajors(majors.filter(major => major.id !== id));
        } catch (err: any) {
            console.error('Error deleting major:', err);
            throw err;
        }
    };

    return {
        majors,
        loading,
        error,
        fetchMajors,
        createMajor,
        updateMajor,
        deleteMajor
    };
};