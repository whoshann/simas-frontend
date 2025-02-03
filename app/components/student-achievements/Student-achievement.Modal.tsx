import React, { useState } from 'react';
import { Facility } from '@/app/api/facilities/types';
import { reverseStatusMapping } from '@/app/utils/statusConverter';
import { StudentAchievement } from '@/app/api/student-achievements/types';

interface StudentAchievementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StudentAchievement) => void;
    studentachievementData?: StudentAchievement | null;
}

export const StudentAchievementModal: React.FC<StudentAchievementModalProps> = ({ isOpen, onClose, onSubmit, studentachievementData }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState<StudentAchievement>(studentachievementData || {
        name: '',
        classSchool: '',
        achievement: '',
        category: '',
        photoEvidence: null,
        date: '',
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
                        {studentachievementData ? 'Edit Data Ruang Sekolah' : 'Tambah Data Ruang Sekolah'}
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
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Prestasi</label>
                            <input
                                type="text"
                                name="achievement"
                                value={formData.achievement || ''}
                                onChange={handleChange}
                                className="border p-2 w-full rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kategori</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category || ''}
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
                            <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date || ''}
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
                                {studentachievementData ? 'Update' : 'Kirim'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentAchievementModal;