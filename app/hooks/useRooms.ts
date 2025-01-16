import { useState, useCallback } from "react";
<<<<<<< HEAD
import { Room } from "../(auth)/api/rooms/types";
import { roomsApi } from "../(auth)/api/rooms";
=======
import { Room } from "../api/rooms/types";
import { roomsApi } from "../api/rooms";
>>>>>>> 8c1250a108172c784d86ee593e24d6fb64f55b27

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await roomsApi.getAll();
      setRooms(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = async (data: Omit<Room, "id">) => {
    try {
      await roomsApi.create(data);
      await fetchRooms();
    } catch (err) {
      console.error("Error creating room:", err);
      throw err;
    }
  };

  const updateRoom = async (id: number, data: Partial<Room>) => {
    try {
      await roomsApi.update(id, data);
      await fetchRooms();
    } catch (err) {
      console.error("Error updating room:", err);
      throw err;
    }
  };

  const deleteRoom = async (id: number) => {
    try {
      await roomsApi.delete(id);
      await fetchRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
      throw err;
    }
  };

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
