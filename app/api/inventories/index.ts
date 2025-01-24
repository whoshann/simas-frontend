import axios from "axios";
import Cookies from "js-cookie";
import {
  InventoryResponse,
  InventoriesResponse,
  UpdateInventoryDto,
  CreateInventoryDto,
} from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/inventory`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const inventoryApi = {
  getAll: async (): Promise<InventoriesResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  create: async (formData: FormData): Promise<InventoryResponse> => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (
    id: number,
    formData: FormData
  ): Promise<InventoryResponse> => {
    const response = await axios.patch(`${API_URL}/${id}`, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<InventoryResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getById: async (id: number): Promise<InventoryResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
