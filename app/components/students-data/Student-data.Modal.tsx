import React, { useState } from 'react';
import { reverseStatusMapping } from '@/app/utils/statusConverter';
import { StudentData } from '@/app/api/students-data/types';

interface StudentDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StudentData) => void;
    studentdataData?: StudentData | null;
}

export const StudentDataModal: React.FC<StudentDataModalProps> = ({ isOpen, onClose, onSubmit, studentdataData }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<StudentData>(studentdataData || {
        name: '',
        classSchool: '',
        major: '',
        nis: '',
        nisn: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        address: '',
        phone: 0,
        parentPhone: 0,
        religion: '',
        motherName: '',
        fatherName: '',
        guardian: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'capacity' ? parseInt(value, 10) : value;

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[28rem] max-h-[80vh] overflow-hidden mx-4">
                <div className="bg-white p-4 sticky top-0 z-10">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl mb-2 font-semibold text-[var(--text-semi-bold-color)]">
                        {studentdataData ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kelas</label>
                            <input
                                type="text"
                                name="classSchool"
                                value={formData.classSchool}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Bukti Foto</label>
                            <input
                                type="file"
                                name="photoEvidence"
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jurusan</label>
                            <input
                                type="text"
                                name="major"
                                value={formData.major || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">NIS</label>
                            <input
                                type="text"
                                name="nis"
                                value={formData.nis || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">NISN</label>
                            <input
                                type="text"
                                name="nisn"
                                value={formData.nisn || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jenis Kelamin</label>
                            <select
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Lahir</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tempat Lahir</label>
                            <input
                                type="text"
                                name="birthPlace"
                                value={formData.birthPlace || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Alamat</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Telepon</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Telepon Orang Tua</label>
                            <input
                                type="text"
                                name="parentPhone"
                                value={formData.parentPhone || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Agama</label>
                            <input
                                type="text"
                                name="religion"
                                value={formData.religion || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama Ibu</label>
                            <input
                                type="text"
                                name="motherName"
                                value={formData.motherName || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama Ayah</label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Wali</label>
                            <input
                                type="text"
                                name="guardian"
                                value={formData.guardian || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                            >
                                {studentdataData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentDataModal;