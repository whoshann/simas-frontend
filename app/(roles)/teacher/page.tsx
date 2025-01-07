"use client"

import "@/app/styles/globals.css";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function TeacherPage() {
    useEffect(() => {
        roleMiddleware(["Teacher"]);
    }, []);

    return (
        <div>
            <p>
                Halaman guru
            </p>
        </div>
    )

}