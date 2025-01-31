import axios from "axios";
import Cookies from "js-cookie";
import { NewsInformationResponse } from "./types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/student-information`;

const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("token")}`,
  "Content-Type": "application/json",
});

export const newsInformationApi = {
  getAll: async (): Promise<NewsInformationResponse> => {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
