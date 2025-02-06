import axios from "axios";
import Cookies from "js-cookie";
import { PaymentSppResponse } from "./types";

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/school-payment`;

export const schoolPaymentApi = {
  getAll: async (): Promise<PaymentSppResponse> => {
    const response = await axios.get(API_URL, { 
      headers: getHeaders() 
    });
    return response.data;
  },
};