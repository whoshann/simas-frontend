import React from 'react';

export default function OutgoingData({ isOpen, onClose, onSubmit, outgoingData }) {
    if (!isOpen) return null;

    const [formData, setFormData] = React.useState(outgoingData || {
        no: 0,
        name: '',
        borrower: '',
        returnDate: '',
        loanDate: '',
        reason: '',
        guarantee: '',
        quantity: 1,
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
                        {outgoingData ? 'Edit Data Barang Keluar Sekolah' : 'Tambah Data Barang Keluar Sekolah'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama Peminjam</label>
                        <input
                            type="text"
                            name="borrower"
                            value={formData.borrower}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Nama Barang</label>
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
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jumlah</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Pinjam</label>
                        <input
                            type="date"
                            name="loanDate"
                            value={formData.loanDate}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Tanggal Kembali</label>
                        <input
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Alasan</label>
                        <input
                            type="text"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Jaminan</label>
                        <input
                            type="text"
                            name="guarantee"
                            value={formData.guarantee}
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
                            {formData.no ? 'Update' : 'Kirim'}
                        </button>
                    </div>
                </form>

                </div>
            </div>
        </div>
    );
}
