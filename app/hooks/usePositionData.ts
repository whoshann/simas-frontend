import { useState } from 'react';
import { Position } from '@/app/api/position/types';
import { positionsApi } from '@/app/api/position';

export const usePositions = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPositions = async () => {
        try {
            setLoading(true);
            const response = await positionsApi.getAll();
            setPositions(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching positions');
            console.error('Error fetching positions:', err);
        } finally {
            setLoading(false);
        }
    };

    const createPosition = async (data: Omit<Position, 'id'>) => {
        try {
            const response = await positionsApi.create(data);
            setPositions([...positions, response.data]);
            return response.data;
        } catch (err: any) {
            console.error('Error creating position:', err);
            throw err;
        }
    };

    const updatePosition = async (id: number, data: Partial<Position>) => {
        try {
            const response = await positionsApi.update(id, data);
            setPositions(positions.map(position => 
                position.id === id ? response.data : position
            ));
            return response.data;
        } catch (err: any) {
            console.error('Error updating position:', err);
            throw err;
        }
    };

    const deletePosition = async (id: number) => {
        try {
            await positionsApi.delete(id);
            setPositions(positions.filter(position => position.id !== id));
        } catch (err: any) {
            console.error('Error deleting position:', err);
            throw err;
        }
    };

    return {
        positions,
        loading,
        error,
        fetchPositions,
        createPosition,
        updatePosition,
        deletePosition
    };
};