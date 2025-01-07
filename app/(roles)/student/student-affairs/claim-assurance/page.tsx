"use client"

import "@/app/styles/globals.css";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function StudentClaimAsurancePage() {
    useEffect(() => {
        // Panggil middleware untuk memeriksa role, hanya izinkan 'Student'
        roleMiddleware(["Student"]);
    }, []);
    return (
        <div>
            <p>
                Halaman klaim asuransi siswa
            </p>
        </div>
    )
}
