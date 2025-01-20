import { useState, useCallback } from 'react';
import { Teacher } from '../api/teacher-data/types';
import { teachersApi } from '../api/teacher-data/index';

export const useTeachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTeachers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await teachersApi.getAll();
            setTeachers(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching teachers');
            console.error('Error fetching teachers:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTeacher = async (data: Omit<Teacher, 'id'>) => {
        try {
            setLoading(true);
            const response = await teachersApi.create(data);
            setTeachers(prev => [...prev, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating teacher:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateTeacher = async (id: number, data: Partial<Teacher>) => {
        try {
            setLoading(true);
            const response = await teachersApi.update(id, data);
            setTeachers(prev => prev.map(teacher => 
                teacher.id === id ? response.data : teacher
            ));
            return response.data;
        } catch (err: any) {
            console.error('Error updating teacher:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTeacher = async (id: number) => {
        try {
            setLoading(true);
            await teachersApi.delete(id);
            setTeachers(prev => prev.filter(teacher => teacher.id !== id));
        } catch (err: any) {
            console.error('Error deleting teacher:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        teachers,
        loading,
        error,
        fetchTeachers,
        createTeacher,
        updateTeacher,
        deleteTeacher
    };
};