"use client";
import "@/app/styles/globals.css";
import { useEffect, useState } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import React from "react";
import { SchoolClass } from "@/app/api/school-class/types";
import { AchievementCategory } from '@/app/utils/enums';
import Image from 'next/image';

interface CustomJwtPayload {
  sub: number;
}

interface Student {
  id: number;
  classId: number;
  name: string;
}

export interface Achievements {
  id: number;
  photo: string;
  achievementName: string;
  competitionName: string;
  typeOfAchievement: AchievementCategory;
  achievementDate: string;
  studentId: number;
  class: SchoolClass;
  student: Student;
}

export default function StudentAchievementPage() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [achievements, setAchievements] = useState<Achievements[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    studentId: 0,
    classId: 0,
    typeOfAchievement: AchievementCategory.academic,
    achievementDate: new Date().toISOString().split('T')[0],
    achievementName: '',
    competitionName: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const tableHeaders = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'class',
      label: 'Kelas',
    },
    { key: 'achievementName', label: 'Nama Prestasi' },
    { key: 'competitionName', label: 'Nama Kompetisi' },
    {
      key: 'typeOfAchievement',
      label: 'Status',
      render: (value: AchievementCategory) => {
        const statusStyles = {
          [AchievementCategory.academic]: 'bg-[#e88e1f29] text-[var(--second-color)]',
          [AchievementCategory.Non_Academic]: 'bg-[#0a97b022] text-[var(--third-color)]',
        };
        const statusText = value === AchievementCategory.academic ? 'Akademik' : 'Non Akademik';
        const style = statusStyles[value] || '';

        return (
          <span className={`px-3 py-1 rounded-full ${style}`}>
            {statusText}
          </span>
        );
      }
    },
    {
      key: 'photo',
      label: 'Gambar',
      render: (value: string) => (
        <div className="w-16 h-16 overflow-hidden rounded">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/achievement/${value}`}
            alt="Bukti Prestasi"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      key: 'achievementDate',
      label: 'Tanggal',
      render: (value: string) => new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentData) {
      toast.error("Data siswa tidak ditemukan");
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('studentId', studentData.id.toString());
    submitFormData.append('classId', studentData.classId.toString());
    submitFormData.append('typeOfAchievement', formData.typeOfAchievement);
    submitFormData.append('achievementDate', formData.achievementDate);
    submitFormData.append('achievementName', formData.achievementName);
    submitFormData.append('competitionName', formData.competitionName);

    if (selectedFile) {
      submitFormData.append('photo', selectedFile);
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/achievement`,
        submitFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data && response.data.data) {
        setAchievements(prev => [...prev, response.data.data]);
        toast.success('Prestasi berhasil dikirim!');

        setFormData(prev => ({
          ...prev,
          typeOfAchievement: AchievementCategory.academic,
          achievementDate: new Date().toISOString().split('T')[0],
          achievementName: '',
          competitionName: ''
        }));
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error submitting achievement:', error);
      toast.error('Gagal mengirim prestasi. Silakan coba lagi.');
    }
  };

  const fetchAchievements = async (studentId: number) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/achievement/student/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.data) {
        setAchievements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Gagal mengambil data prestasi');
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        await roleMiddleware(["Student", "SuperAdmin"]);
        setIsAuthorized(true);

        const token = Cookies.get("token");
        if (token) {
          try {
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            const studentId = decodedToken.sub;
            setStudentId(studentId);

            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/student/${studentId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );

            const student = response.data.data;
            setStudentData(student);

            await fetchAchievements(studentId);

            setFormData(prev => ({
              ...prev,
              studentId: studentId,
              classId: student.classId
            }));

          } catch (error) {
            console.error("Error fetching student data:", error);
            toast.error("Gagal mendapatkan data siswa");
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  // Filter dan pagination logic
  const filteredData = achievements.filter((item) =>
    tableHeaders.some(header => {
      const value = item[header.key as keyof Achievements];
      return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <header className="py-6 px-9">
        <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">Prestasi</h1>
        <p className="text-sm text-gray-600">Halo, selamat datang di halaman Prestasi</p>
      </header>

      <main className="px-9 pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-[var(--text-semi-bold-color)] mb-4 flex items-center">
              <i className="bx bx-box text-2xl text-orange-600 mr-2"></i>
              <span className="ml-2">Form Prestasi</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="achievementName" className="block text-sm font-medium text-gray-700">
                  Masukkan Nama Prestasi
                </label>
                <input
                  type="text"
                  id="achievementName"
                  name="achievementName"
                  value={formData.achievementName}
                  onChange={handleChange}
                  placeholder="Juara 1 Lomba Debat"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="competitionName" className="block text-sm font-medium text-gray-700">
                  Masukkan Nama Kompetisi
                </label>
                <input
                  type="text"
                  id="competitionName"
                  name="competitionName"
                  value={formData.competitionName}
                  onChange={handleChange}
                  placeholder="Lomba Debat Nasional 2025"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="typeOfAchievement" className="block text-sm font-medium text-gray-700">
                  Pilih Kategori Prestasi
                </label>
                <select
                  id="typeOfAchievement"
                  name="typeOfAchievement"
                  value={formData.typeOfAchievement}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="academic">Akademik</option>
                  <option value="Non_Academic">Non Akademik</option>
                </select>
              </div>

              <div>
                <label htmlFor="achievementDate" className="block text-sm font-medium text-gray-700">
                  Masukkan Tanggal Prestasi
                </label>
                <input
                  type="date"
                  id="achievementDate"
                  name="achievementDate"
                  value={formData.achievementDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 text-gray-700 bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                  Upload Bukti Foto
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                  className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1F509A] hover:file:bg-blue-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--main-color)] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[var(--main-color)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:ring-offset-2"
              >
                Kirim
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Table Actions */}
            <div className="mb-4 flex justify-between flex-wrap sm:flex-nowrap">
              <div className="text-xs sm:text-base">
                <label className="mr-2">Tampilkan</label>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-1 text-xs sm:text-sm w-12 sm:w-16"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <label className="ml-2">Entri</label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <i className='bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {tableHeaders.map((header) => (
                      <th
                        key={header.key}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b"
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b">{item.student?.name || '-'}</td>
                      <td className="px-4 py-3 border-b">{item.class?.name || '-'}</td>
                      <td className="px-4 py-3 border-b">{item.achievementName}</td>
                      <td className="px-4 py-3 border-b">{item.competitionName}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`inline-block px-3 py-1 rounded-full ${item.typeOfAchievement === 'Non_Academic'
                          ? 'bg-[#0a97b028] text-[var(--third-color)]'
                          : 'bg-[#e88e1f29] text-[var(--second-color)]'
                          }`}>
                          {item.typeOfAchievement === 'Non_Academic' ? 'Non_Akademik' : item.typeOfAchievement === 'academic' ? 'Akademik' : ''}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b">
                        <div className="w-16 h-16 overflow-hidden rounded">
                          {item.photo ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/achievement/${item.photo.split('/').pop()}`}
                              alt="Bukti Prestasi"
                              className="w-full h-full object-cover"
                              width={256}
                              height={256}
                            />
                          ) : (
                            '-'
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b">
                        {new Date(item.achievementDate).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-5">
              <span className="text-xs sm:text-sm">
                Menampilkan {startIndex + 1} hingga {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
              </span>

              <div className="flex items-center">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-[var(--main-color)]"
                >
                  &lt;
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-md px-3 py-1 ${currentPage === page
                        ? 'bg-[var(--main-color)] text-white'
                        : 'text-[var(--main-color)]'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-[var(--main-color)]"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}