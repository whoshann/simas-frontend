"use client"

import "@/app/styles/globals.css";
import Cookies from "js-cookie";
import { useEffect } from "react";

const checkAuth = () => {
    const token = Cookies.get("token");

    // Jika token tidak ditemukan, redirect ke halaman login
    if (!token) {
        window.location.href = "/login";
    } else {
        console.log("Token ditemukan:", token);
    }
};

export default function teacherPage() {
    useEffect(() => {
        checkAuth(); 
    }, []);

    return (
        <div>
            <p>
                Halaman guru
            </p>
        </div>
    )

}