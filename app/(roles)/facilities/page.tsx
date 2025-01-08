"use client"

import "@/app/styles/globals.css";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function TeacherDashboardPage() {
    useEffect(() => {
        roleMiddleware(["Facilities"]);
    }, []);

    return (
        <div>
            <p>
                Halaman Keuangan
            </p>
        </div>
    )

}