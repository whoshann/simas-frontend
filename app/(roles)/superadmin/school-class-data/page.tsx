"use client";

import React, { useState, useEffect } from "react";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";
import PageHeader from "@/app/components/DataTable/TableHeader";
import DataTable from "@/app/components/DataTable/TableData";
import DynamicModal from "@/app/components/DataTable/TableModal";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { useSchoolClasses } from '@/app/hooks/useSchoolClassData';
import { useMajors } from '@/app/hooks/useMajorData';
import { useTeachers } from '@/app/hooks/useTeacher';
import { Grade, SchoolClass } from '@/app/api/school-class/types';

export default function SchoolClassPage() {
    const {
        schoolClasses,
        loading: classesLoading,
        error: classError,
        fetchSchoolClasses,
        createSchoolClass,
        updateSchoolClass,
        deleteSchoolClass
    } = useSchoolClasses();

    const { majors, loading: majorsLoading, fetchMajors } = useMajors();
    const { teachers, loading: teachersLoading, fetchTeachers } = useTeachers();

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["SuperAdmin"]);
                setIsAuthorized(true);
                await Promise.all([
                    fetchSchoolClasses(),
                    fetchMajors(),
                    fetchTeachers()
                ]);
            } catch (error) {
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, []);

    const handleEdit = (id: number) => {
        const schoolClass = schoolClasses.find(c => c.id === id);
        if (schoolClass && schoolClass.major && schoolClass.homeroomTeacher) {
            setSelectedClass({
                id: schoolClass.id,
                name: schoolClass.name,
                code: schoolClass.code,
                grade: schoolClass.grade,
                majorId: schoolClass.major.id,
                homeroomTeacherId: schoolClass.homeroomTeacher.id
            });
            setIsModalOpen(true);
        } else {
            alert('Data kelas tidak lengkap');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                await deleteSchoolClass(id);
                alert('Data berhasil dihapus');
            } catch (error) {
                alert('Gagal menghapus data');
            }
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            const classData: SchoolClass = {
                name: String(formData.name).trim(),
                code: String(formData.code).trim(),
                grade: formData.grade as Grade,
                majorId: Number(formData.majorId),
                homeroomTeacherId: Number(formData.homeroomTeacherId)
            };

            if (selectedClass?.id) {
                await updateSchoolClass(selectedClass.id, classData);
                alert('Data kelas berhasil diperbarui!');
            } else {
                await createSchoolClass(classData);
                alert('Data kelas berhasil ditambahkan!');
            }

            setIsModalOpen(false);
            setSelectedClass(null);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const classFields = [
        {
            name: 'name',
            label: 'Nama Kelas',
            type: 'text' as const,
            required: true
        },
        {
            name: 'code',
            label: 'Kode Kelas',
            type: 'text' as const,
            required: true
        },
        {
            name: 'grade',
            label: 'Tingkat',
            type: 'select' as const,
            required: true,
            options: Object.values(Grade).map(grade => ({
                value: grade,
                label: grade
            }))
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
        {
            name: 'homeroomTeacherId',
            label: 'Wali Kelas',
            type: 'select' as const,
            required: true,
            options: teachers?.map(teacher => ({
                value: String(teacher.id),
                label: teacher.name
            })) || []
        }
    ];

    if (isLoading || classesLoading || majorsLoading || teachersLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return <div>Anda tidak memiliki akses ke halaman ini</div>;
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
            <PageHeader
                title="Data Kelas"
                greeting="Kelola data kelas sekolah di sini"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <DataTable
                headers={[
                    { key: 'no', label: 'No' },
                    { key: 'name', label: 'Nama Kelas' },
                    { key: 'code', label: 'Kode Kelas' },
                    { key: 'grade', label: 'Tingkat' },
                    { key: 'majorId', label: 'Jurusan' },
                    { key: 'homeroomTeacher', label: 'Wali Kelas' }
                ]}
                data={schoolClasses.map((schoolClass, index) => {
                    // Pastikan data lengkap sebelum mapping
                    if (!schoolClass.major || !schoolClass.homeroomTeacher) {
                        console.error('Data kelas tidak lengkap:', schoolClass);
                        return {
                            no: index + 1,
                            name: schoolClass.name,
                            code: schoolClass.code,
                            grade: schoolClass.grade,
                            majorId: 'Data tidak tersedia',
                            homeroomTeacher: 'Data tidak tersedia',
                            id: schoolClass.id
                        };
                    }

                    return {
                        no: index + 1,
                        name: schoolClass.name,
                        code: schoolClass.code,
                        grade: schoolClass.grade,
                        majorId: schoolClass.major.code,
                        homeroomTeacher: schoolClass.homeroomTeacher.name,
                        id: schoolClass.id
                    };
                })}
                searchTerm={searchTerm}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedClass(null);
                    setIsModalOpen(true);
                }}
                onImport={() => console.log("Import")}
                onExport={() => console.log("Export")}
            />

            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedClass(null);
                }}
                onSubmit={handleSubmit}
                title={selectedClass ? "Edit Data Kelas" : "Tambah Data Kelas"}
                fields={classFields}
                initialData={selectedClass ? {
                    name: selectedClass.name,
                    code: selectedClass.code,
                    grade: selectedClass.grade,
                    majorId: String(selectedClass.majorId),
                    homeroomTeacherId: String(selectedClass.homeroomTeacherId)
                } : undefined}
                width="w-[40rem]"
            />
        </div>
    );
}