import { useState, useCallback } from "react";
import { NewsInformation } from "../api/news-informations/types";
import { newsinformationsApi } from "../api/news-informations";

export const useNewsInformations = () => {
  const [newsinformations, setNewsInformations] = useState<NewsInformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsInformations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsinformationsApi.getAll();
      setNewsInformations(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch news information");
      console.error("Error fetching news information:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewsInformation = async (data: Omit<NewsInformation, "id">) => {
    try {
      await newsinformationsApi.create(data);
      await fetchNewsInformations();
    } catch (err) {
      console.error("Error creating room:", err);
      throw err;
    }
  };

  const updateNewsInformation = async (id: number, data: Partial<NewsInformation>) => {
    try {
      await newsinformationsApi.update(id, data);
      await fetchNewsInformations();
    } catch (err) {
      console.error("Error updating room:", err);
      throw err;
    }
  };

  const deleteNewsInformation = async (id: number) => {
    try {
      await newsinformationsApi.delete(id);
      await fetchNewsInformations();
    } catch (err) {
      console.error("Error deleting room:", err);
      throw err;
    }
  };

  return {
    newsinformations,
    loading,
    error,
    fetchNewsInformations,
    createNewsInformation,
    updateNewsInformation,
    deleteNewsInformation,
  };
};
