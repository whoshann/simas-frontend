import type { Metadata } from "next";
import "@/app/styles/globals.css";
import Sidebar from "@/app/components/sidebar/Sidebar";

export const metadata: Metadata = {
    title: "Simas",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
