// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value; // Ambil nilai cookie token
    const role = request.cookies.get('role')?.value;   // Ambil nilai cookie role

    // Daftar halaman yang dilindungi berdasarkan role
    const protectedRoutes: { [key: string]: string } = {
        '/student': 'Student',
        '/teacher': 'Teacher',
        '/superadmin': 'SuperAdmin',
        // Tambahkan halaman lain sesuai kebutuhan
    };

    const { pathname } = request.nextUrl;

    // Cek apakah halaman yang diakses adalah halaman yang dilindungi
    if (protectedRoutes[pathname]) {
        // Jika token tidak ada atau role tidak sesuai, redirect ke halaman login
        if (!token || role !== protectedRoutes[pathname]) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Tentukan middleware untuk dijalankan di semua rute
export const config = {
    matcher: ['/student', '/teacher', '/superadmin'], // Tambahkan rute yang ingin dilindungi
};