"use client";

import "@/app/styles/globals.css";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import axios from "axios";
import Cookies from "js-cookie";

const StudentPage = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  // console.log("Token:", token);

  const fetchData = async () => {
    try {
      // Set default Authorization header dengan Bearer token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch data user dari endpoint API
      const response = await axios.get("http://localhost:3333/student");
      setUser(response.data); // Simpan data user ke dalam state
    } catch (err: any) {
      console.error("Error saat fetching data:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false); // Set loading selesai
    }
  };

  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Student'
    roleMiddleware(["student", "SuperAdmin"]);

    // Panggil fungsi fetch data
    fetchData();
  }, []);

  if (loading) {
    return <p>Memuat data...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Halaman Student</h1>
      <div className="mt-4">
        <p>
          Halaman student
        </p>
      </div>
    </div>
  );
};

export default StudentPage;