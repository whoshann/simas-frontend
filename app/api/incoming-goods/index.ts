import axios from "axios";
import Cookies from "js-cookie";
import {
  IncomingGoods,
  IncomingGoodsRequest,
  UpdateIncomingGoodsRequest,
  IncomingGoodsResponse,
  IncomingGoodsResponses,
} from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/incoming-item`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const incomingGoodsApi = {
  getAll: async (): Promise<IncomingGoodsResponses> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<IncomingGoodsResponse> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  create: async (
    data: IncomingGoodsRequest
  ): Promise<IncomingGoodsResponse> => {
    const response = await axios.post(API_URL, data, { headers: getHeaders() });
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateIncomingGoodsRequest
  ): Promise<IncomingGoodsResponse> => {
    // Bersihkan data yang tidak diperlukan
    const {
      id: _id,
      createdAt,
      updatedAt,
      inventory,
      ...updateData
    } = data as any;

    const response = await axios.patch(`${API_URL}/${id}`, updateData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  delete: async (id: number): Promise<IncomingGoodsResponse> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
