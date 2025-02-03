import { useState } from 'react';
import { StudentClaimInsurance } from '@/app/api/students-claim-insurance/types';
import { studentsclaiminsuranceApi } from '@/app/api/students-claim-insurance';

export const useStudentsClaimInsurance = () => {
    const [studentsclaiminsurance, setStudentsClaimInsurance] = useState<StudentClaimInsurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudentsClaimInsurance = async () => {
        try {
            setLoading(true);
            const response = await studentsclaiminsuranceApi.getAll();
            setStudentsClaimInsurance(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching students');
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const createStudentClaimInsurance = async (data: Omit<StudentClaimInsurance, 'id'>) => {
        try {
            const response = await studentsclaiminsuranceApi.create(data);
            setStudentsClaimInsurance([...studentsclaiminsurance, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating student:', err);
            throw err;
        }
    };

    const updateStudentClaimInsurance = async (id: number, data: Partial<StudentClaimInsurance>) => {
        try {
            const response = await studentsclaiminsuranceApi.update(id, data);
            setStudentsClaimInsurance(studentsclaiminsurance.map(studentsclaiminsurance => 
                studentsclaiminsurance.id === id ? response.data : studentsclaiminsurance
            ));
            return response.data;
        } catch (err: any) {
            console.error('Error updating student:', err);
            throw err;
        }
    };

    const deleteStudentClaimInsurance = async (id: number) => {
        try {
            await studentsclaiminsuranceApi.delete(id);
            setStudentsClaimInsurance(studentsclaiminsurance.filter(studentsclaiminsurance => studentsclaiminsurance.id !== id));
        } catch (err: any) {
            console.error('Error deleting student:', err);
            throw err;
        }
    };

    return {
        studentsclaiminsurance,
        loading,
        error,
        fetchStudentsClaimInsurance,
        createStudentClaimInsurance,
        updateStudentClaimInsurance,
        deleteStudentClaimInsurance
    };
};