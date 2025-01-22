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

  return { newsInformation, loading, error, fetchNewsInformation };
};
