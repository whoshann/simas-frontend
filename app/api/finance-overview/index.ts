import axios from "axios";
import Cookies from "js-cookie";
import { FinanceOverviewResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/finance-overview`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const financeOverviewApi = {
  getOverview: async (): Promise<FinanceOverviewResponse> => {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    return response.data;
  },
};