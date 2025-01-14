import React from 'react';

export default function RepairsData({ isOpen, onClose, onSubmit, repairsData }) {
    if (!isOpen) return null;

    const [formData, setFormData] = React.useState(repairsData || {
        no: 0,
        category: '',
        name: '',
        date: '',
        cost: '',
        status: ''    
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg relative w-[28rem] max-h-[80vh] overflow-hidden mx-4">
                <div className="bg-white p-4 sticky top-0 z-10">
                    {/* Menggunakan ikon dari Boxicons */}
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                    <h2 className="text-xl mb-2 font-semibold text-[var(--text-semi-bold-color)]">
                        {repairsData ? 'Edit Data Perbaikan Sekolah' : 'Tambah Data Perbaikan Sekolah'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kategori</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama </label>
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
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Biaya Perbaikan</label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        >
                            <option value="">Pilih Status</option>
                            <option value="complete">Selesai</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">Sedang Diproses</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                        >
                            {repairsData ? 'Update' : 'Kirim'}
                        </button>
                    </div>
                </form>

                </div>
            </div>
        </div>
    );
}
