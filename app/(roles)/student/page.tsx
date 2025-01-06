"use client"

import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

const StudentPage = () => {
  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Student'
    roleMiddleware(["Student"]);
  }, []);

  return (
    <div>
      <p>Halaman Student</p>
    </div>
  );
};

export default StudentPage;
