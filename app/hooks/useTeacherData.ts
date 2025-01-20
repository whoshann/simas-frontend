import { useState } from 'react';
import { Teacher } from '@/app/api/teacher-data/types';
import { teachersApi } from '@/app/api/teacher-data';

export const useTeachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeachers = async () => {
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
    };

    const createTeacher = async (formData: FormData) => {
        try {
            const response = await teachersApi.create(formData);
            setTeachers([...teachers, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating teacher:', err);
            throw err;
        }
    };

    const updateTeacher = async (id: number, formData: FormData) => {
        try {
            const response = await teachersApi.update(id, formData);
            setTeachers(teachers.map(teacher => 
                teacher.id === id ? response.data : teacher
            ));
            return response.data;
        } catch (err: any) {
            console.error('Error updating teacher:', err);
            throw err;
        }
    };

    const deleteTeacher = async (id: number) => {
        try {
            await teachersApi.delete(id);
            setTeachers(teachers.filter(teacher => teacher.id !== id));
        } catch (err: any) {
            console.error('Error deleting teacher:', err);
            throw err;
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