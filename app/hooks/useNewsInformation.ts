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
      setNewsInformation(response.data);
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
        console.error("Error creating repair:", err);
        throw err;
      }
    };
  
    const updateNewsInformation = async (id: number, data: Partial<NewsInformation>) => {
      try {
        await newsInformationApi.update(id, data);
        await fetchNewsInformation();
      } catch (err) {
        console.error("Error updating repair:", err);
        throw err;
      }
    };
  
    const deleteRepair = async (id: number) => {
      try {
        await newsInformationApi.delete(id);
        await fetchNewsInformation();
      } catch (err) {
        console.error("Error deleting repair:", err);
        throw err;
      }
    };

  return { newsInformation, createNewsInformation, updateNewsInformation, deleteRepair, loading, error, fetchNewsInformation };
};
