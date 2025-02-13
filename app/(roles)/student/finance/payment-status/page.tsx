
"use client";
import React, { useState, useEffect } from "react";
import "@/app/styles/globals.css";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PaymentSppModal from "@/app/components/PaymentSppModal.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
interface CustomJwtPayload {
  sub: number;
}

interface Student {
  id: number;
  classId: number;
  name: string;
}

interface SchoolPayment {
  studentName: string;
  className: string;
  amount: string;
  month: number;
  status: string;
  date: string;
}

export default function StudentPaymentStatusPage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [payments, setPayments] = useState<SchoolPayment[]>([]);
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('Januari');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchStudentData = async (studentId: number) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/student/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setStudentData(response.data.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    // Panggil middleware untuk memeriksa role, hanya izinkan 'Student' dan 'SuperAdmin'
    roleMiddleware(["Student", "SuperAdmin"]);

    fetchData();

    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        const studentId = decodedToken.sub;
        setStudentId(studentId.toString());

        fetchStudentData(studentId);

        // Fetch data dari backend
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/school-payment/${studentId}`)
          .then((response) => {
            if (Array.isArray(response.data.data)) {
              setPayments(response.data.data);
            } else {
              console.error('Data pembayaran bukan array');
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });

      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const filteredData = payments.filter(item =>
    item.month <= months.indexOf(selectedMonth) + 1 ||
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
    setIsModalOpen(true);
  };

  const token = Cookies.get("token");

  const fetchData = async () => {
    try {
      // Set default Authorization header dengan Bearer token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch data user dari endpoint API
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student`);
      setUser(response.data); // Simpan data user ke dalam state
    } catch (err: any) {
      console.error("Error saat fetching data:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }


  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Pembayaran SPP</h1>
          <p className="text-sm text-gray-600">Halo {studentData?.name}, selamat datang kembali</p>
        </div>
      </header>
      <main className="px-9 pb-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg overflow-hidden">
              <thead className="text-[var(--text-semi-bold-color)]">
                <tr>
                  <th className="py-2 px-4 border-b text-left">No</th>
                  <th className="py-2 px-4 border-b text-left">Nama</th>
                  <th className="py-2 px-4 border-b text-left">Kelas</th>
                  <th className="py-2 px-4 border-b text-left">Jumlah</th>
                  <th className="py-2 px-4 border-b text-left">Bulan</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Tanggal</th>
                  <th className="py-2 px-4 border-b text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{item.studentName}</td>
                    <td className="py-2 px-4 border-b">{item.className}</td>
                    <td className="py-2 px-4 border-b">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(item.amount))}
                    </td>
                    <td className="py-2 px-4 border-b">{item.month}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-6 py-1 rounded-full text-sm font-medium whitespace-nowrap ${item.status === "Lunas"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        timeZone: 'Asia/Jakarta',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleDetailClick(item)}
                        className="bg-[var(--main-color)] text-white px-4 py-2 rounded-lg text-sm block mx-auto max-w-full sm:max-w-fit"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <PaymentSppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentData={selectedDetail}
      />
    </div>
  );
}
