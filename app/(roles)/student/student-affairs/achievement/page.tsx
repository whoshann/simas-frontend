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
import TableData2 from "@/app/components/TableWithoutAction/TableData2";
import { AchievementCategory } from '@/app/utils/enums';

interface CustomJwtPayload {
  sub: number;
}

interface Student {
  id: number;
  classId: number;
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

  const [formData, setFormData] = useState({
    studentId: 0,
    classId: 0,
    typeOfAchievement: AchievementCategory.academic,
    achievementDate: new Date().toISOString().split('T')[0],
    achievementName: '',
    competitionName: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        alert('Prestasi berhasil dikirim!');

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

            // Fetch data siswa untuk mendapatkan classId
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

            // Update formData dengan studentId dan classId yang didapat
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

  const tableHeaders = [
    { key: 'name', label: 'Nama' },
    { key: 'class', label: 'Kelas' },
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
      key: 'achievementDate',
      label: 'Tanggal',
      render: (value: string) => new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
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
    }
  ];


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
                <label
                  htmlFor="achievementName"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="competitionName"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="typeOfAchievement"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="achievementDate"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
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
          {/* Tabel Riwayat */}
          <TableData2
            headers={tableHeaders}
            data={achievements}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </div>
      </main>
    </div>
  );
}