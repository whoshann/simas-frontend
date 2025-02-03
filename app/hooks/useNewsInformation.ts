import { useState, useCallback } from "react";
import { NewsInformation } from "../api/news-information/types";
import { newsInformationApi } from "../api/news-information";

export const useNewsInformation = () => {
  const [newsInformation, setNewsInformation] = useState<NewsInformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsInformation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsInformationApi.getAll();
      // Pastikan photo tidak null dengan memberikan nilai default ""
      const processedData = response.data.map((news: NewsInformation) => ({
        ...news,
        photo: news.photo ?? "", // Gunakan string kosong jika null
      }));

      setNewsInformation(processedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch news information");
      console.error("Error fetching news information:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewsInformation = async (
      data: Omit<NewsInformation, "id" | "createdAt" | "updatedAt">
    ) => {
      try {
        await newsInformationApi.create(data);
        await fetchNewsInformation();
      } catch (err) {
        console.error("Error creating news Information:", err);
        throw err;
      }
    };
  
    const updateNewsInformation = async (id: number, data: Partial<NewsInformation>) => {
      try {
        await newsInformationApi.update(id, data);
        await fetchNewsInformation();
      } catch (err) {
        console.error("Error updating news Information:", err);
        throw err;
      }
    };
  
    const deleteNewsInformation = async (id: number) => {
      try {
        await newsInformationApi.delete(id);
        await fetchNewsInformation();
      } catch (err) {
        console.error("Error deleting news Information:", err);
        throw err;
      }
    };

  return {
    newsInformation,
    createNewsInformation,
    updateNewsInformation,
    deleteNewsInformation,
    loading,
    error,
    fetchNewsInformation,
  };
};