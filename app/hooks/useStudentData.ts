import { useState } from 'react';
import { Student } from '@/app/api/student-data/types';
import { studentsApi } from '@/app/api/student-data';

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentsApi.getAll();
            setStudents(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching students');
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const createStudent = async (data: Omit<Student, 'id'>) => {
        try {
            const response = await studentsApi.create(data);
            setStudents([...students, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating student:', err);
            throw err;
        }
    };

    const updateStudent = async (id: number, data: Partial<Student>) => {
        try {
            const response = await studentsApi.update(id, data);
            setStudents(students.map(student => 
                student.id === id ? response.data : student
            ));
            return response.data;
        } catch (err: any) {
            console.error('Error updating student:', err);
            throw err;
        }
    };

    const deleteStudent = async (id: number) => {
        try {
            await studentsApi.delete(id);
            setStudents(students.filter(student => student.id !== id));
        } catch (err: any) {
            console.error('Error deleting student:', err);
            throw err;
        }
    };

    return {
        students,
        loading,
        error,
        fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent
    };
};