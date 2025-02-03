import { useState } from 'react';
import { StudentViolations, StudentViolationsResponse } from '@/app/api/students-violations/types';
import { studentsviolationsApi } from '@/app/api/students-violations';

export const useStudentsViolations = () => {
    const [studentsviolations, setStudentsViolations] = useState<StudentViolations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudentsViolations = async () => {
        try {
            setLoading(true);
            const response = await studentsviolationsApi.getAll();
            setStudentsViolations(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching students');
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const createStudentViolations = async (data: Omit<StudentViolations, 'id'>) => {
        try {
            const response = await studentsviolationsApi.create(data);
            setStudentsViolations([...studentsviolations, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating student:', err);
            throw err;
        }
    };

    const updateStudentViolations = async (id: number, data: Partial<StudentViolations>) => {
        try {
            const response = await studentsviolationsApi.update(id, data);
            setStudentsViolations(studentsviolations.map(studentviolations => 
                studentviolations.id === id ? response.data : studentviolations
            ));
            return response.data;
        } catch (err: any) {
            console.error('Error updating student:', err);
            throw err;
        }
    };

    const deleteStudentViolations = async (id: number) => {
        try {
            await studentsviolationsApi.delete(id);
            setStudentsViolations(studentsviolations.filter(studentviolations => studentviolations.id !== id));
        } catch (err: any) {
            console.error('Error deleting student:', err);
            throw err;
        }
    };

    return {
        studentsviolations,
        loading,
        error,
        fetchStudentsViolations,
        createStudentViolations,
        updateStudentViolations,
        deleteStudentViolations
    };
};