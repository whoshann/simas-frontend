import { useState, useEffect } from 'react';
import { User } from '@/app/api/user/types';
import { authApi } from '@/app/api/auth';
import { getUserIdFromToken } from '../utils/tokenHelper';

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userId = getUserIdFromToken();
            if (userId) {
                const response = await authApi.getUserLogin(Number(userId));
                setUser(response.data);
                setError(null);
            }
        } catch (err: any) {
            setError(err.message || 'Error fetching user data');
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return { user, loading, error, refetch: fetchUserData };
};