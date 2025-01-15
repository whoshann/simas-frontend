import axios from "axios";
import Cookies from "js-cookie";
import { Room, RoomResponse, RoomsResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/room`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const roomsApi = {
  getAll: async (): Promise<RoomsResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<RoomResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (data: Omit<Room, "id">): Promise<RoomResponse> => {
    const response = await axios.post(API_URL, data, { headers: getHeaders() });
    return response.data;
  },

  update: async (id: number, data: Partial<Room>): Promise<RoomResponse> => {
    const { id: _, createdAt, updatedAt, ...updateData } = data;
    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<RoomResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
