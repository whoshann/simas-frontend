"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useStudents } from "@/app/hooks/useStudentData";
import { useSchoolClasses } from "@/app/hooks/useSchoolClassData";
import { useMajors } from "@/app/hooks/useMajorData";
import { Student } from "@/app/api/student-data/types";

export default function StudentPage() {
    // State
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Hooks
    const {
        students,
        loading: studentsLoading,
        fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent
    } = useStudents();

    const {
        schoolClasses,
        loading: classesLoading,
        fetchSchoolClasses
    } = useSchoolClasses();

    const {
        majors,
        loading: majorsLoading,
        fetchMajors
    } = useMajors();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);

                // Log sebelum mengambil data
                console.log('Mulai mengambil data...');

                // Ambil data kelas dan jurusan terlebih dahulu
                const [classesResponse, majorsResponse] = await Promise.all([
                    fetchSchoolClasses(),
                    fetchMajors()
                ]);

                // Log data kelas dan jurusan
                console.log('Data Kelas:', schoolClasses);
                console.log('Data Jurusan:', majors);

                // Ambil data siswa
                await fetchStudents();

                // Log data siswa
                console.log('Data Siswa:', students);

            } catch (error) {
                console.error("Error saat inisialisasi:", error);
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    const studentFields = [
        { name: 'name', label: 'Nama Lengkap', type: 'text' as const, required: true },
        {
            name: 'classSchoolId',
            label: 'Kelas',
            type: 'select' as const,
            required: true,
            options: schoolClasses?.map(cls => ({
                value: String(cls.id),
                label: `${cls.name} (${cls.grade})`
            })) || []
        },
        {
            name: 'majorId',
            label: 'Jurusan',
            type: 'select' as const,
            required: true,
            options: majors?.map(major => ({
                value: String(major.id),
                label: `${major.name} (${major.code})`
            })) || []
        },
        { name: 'nis', label: 'NIS', type: 'text' as const, required: true },
        { name: 'nisn', label: 'NISN', type: 'text' as const, required: true },
        {
            name: 'gender',
            label: 'Jenis Kelamin',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' }
            ]
        },
        {
            name: 'birthDate',
            label: 'Tanggal Lahir',
            type: 'date' as const,
            required: true,
            valueFormat: (value: string) => value ? value.split('T')[0] : ''
        },
        { name: 'birthPlace', label: 'Tempat Lahir', type: 'text' as const, required: true },
        { name: 'address', label: 'Alamat', type: 'textarea' as const, required: true },
        { name: 'phone', label: 'Nomor Telepon', type: 'tel' as const, required: true },
        { name: 'parentPhone', label: 'Nomor Telepon Orang Tua', type: 'tel' as const, required: true },
        {
            name: 'religion',
            label: 'Agama',
            type: 'select' as const,
            required: true,
            options: [
                { value: 'ISLAM', label: 'Islam' },
                { value: 'CHRISTIANITY', label: 'Kristen' },
                { value: 'CATHOLICISM', label: 'Katolik' },
                { value: 'HINDUISM', label: 'Hindu' },
                { value: 'BUDDHISM', label: 'Buddha' },
                { value: 'CONFUCIANISM', label: 'Konghucu' }
            ]
        },
        { name: 'motherName', label: 'Nama Ibu', type: 'text' as const, required: true },
        { name: 'fatherName', label: 'Nama Ayah', type: 'text' as const, required: true },
        { name: 'guardian', label: 'Nama Wali (Opsional)', type: 'text' as const }
    ];

    const handleEdit = (id: number) => {
        const student = students.find(s => s.id === id);
        if (student) {
            setSelectedStudent({
                ...student,
                classSchoolId: student.classSchoolId, // Gunakan ID langsung
                majorId: student.majorId // Gunakan ID langsung
            });
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            console.log('Form Data Received:', formData);

            const studentData = {
                ...formData,
                classSchoolId: Number(formData.classSchoolId),
                majorId: Number(formData.majorId)
            };

            console.log('Processed Student Data:', studentData);

            if (selectedStudent?.id) {
                console.log('Updating Student:', selectedStudent.id);
                await updateStudent(selectedStudent.id, studentData);
            } else {
                console.log('Creating New Student');
                await createStudent(studentData);
            }
            setIsModalOpen(false);
            setSelectedStudent(null);
        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    };

    if (isLoading || studentsLoading || classesLoading || majorsLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title="Data Siswa"
                greeting="Kelola data siswa di sini"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={[
                    { key: 'no', label: 'No' },
                    { key: 'name', label: 'Nama' },
                    { key: 'classSchool', label: 'Kelas' },
                    { key: 'major', label: 'Jurusan' },
                    { key: 'nis', label: 'NIS' },
                    { key: 'nisn', label: 'NISN' },
                    { key: 'gender', label: 'Jenis Kelamin' },
                    { key: 'birthDate', label: 'Tanggal Lahir' },
                    { key: 'birthPlace', label: 'Tempat Lahir' },
                    { key: 'address', label: 'Alamat' },
                    { key: 'phone', label: 'Nomor Telepon' },
                    { key: 'parentPhone', label: 'Nomor Telepon Orang Tua' },
                    { key: 'religion', label: 'Agama' },
                    { key: 'motherName', label: 'Nama Ibu' },
                    { key: 'fatherName', label: 'Nama Ayah' },
                    { key: 'guardian', label: 'Nama Wali' }
                ]}
                data={students.map((student, index) => {
                    // Pastikan data relasi ada
                    const classSchoolName = student.classSchool
                        ? `${student.classSchool.name} (${student.classSchool.grade})`
                        : `Kelas ${student.classSchoolId}`; // Tampilkan ID jika data belum dimuat

                    const majorName = student.major
                        ? `${student.major.name} (${student.major.code})`
                        : `Jurusan ${student.majorId}`; // Tampilkan ID jika data belum dimuat

                    return {
                        no: index + 1,
                        name: student.name,
                        classSchool: classSchoolName,
                        major: majorName,
                        nis: student.nis,
                        nisn: student.nisn,
                        gender: student.gender === 'L' ? 'Laki-laki' : 'Perempuan',
                        birthDate: new Date(student.birthDate).toLocaleDateString('id-ID'),
                        birthPlace: student.birthPlace,
                        address: student.address,
                        phone: student.phone,
                        parentPhone: student.parentPhone,
                        religion: student.religion,
                        motherName: student.motherName,
                        fatherName: student.fatherName,
                        guardian: student.guardian || '-',
                        id: student.id
                    };
                })}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={deleteStudent}
                onAdd={() => {
                    setSelectedStudent(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={() => console.log("Export")}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudent(null);
                }}
                onSubmit={handleSubmit}
                title={selectedStudent ? "Edit Data Siswa" : "Tambah Data Siswa"}
                fields={studentFields}
                initialData={selectedStudent || undefined}
                width="w-[40rem]"
            />
        </div>
    );
}