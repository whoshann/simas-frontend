import axios from "axios";
import Cookies from "js-cookie";
import {
  OutgoingGoods,
  OutgoingGoodsRequest,
  OutgoingGoodsResponse,
} from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/borrowing`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const outgoingGoodsApi = {
  getAll: async (): Promise<OutgoingGoods[]> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },

  getById: async (id: number): Promise<OutgoingGoods> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  updateStatus: async (id: number): Promise<OutgoingGoodsResponse> => {
    const response = await axios.patch(
      `${API_URL}/${id}/return`,
      {},
      { headers: getHeaders() }
    );
    return response.data;
  },
};
