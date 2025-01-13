import React from 'react';

export default function InventoryData({ isOpen, onClose, onSubmit, inventoryData }) {
    if (!isOpen) return null;

    const [formData, setFormData] = React.useState(inventoryData || {
        no: 0,     
        code: '',        
        name: '',        
        stock: '',     
        image: null,      
        date: '',

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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file, // Menyimpan file gambar dalam state
            });
        }
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
                        {inventoryData ? 'Edit Data Inventory Sekolah' : 'Tambah Data Inventory Sekolah'}
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-[70vh] p-4">
                <form onSubmit={handleSubmit}>
                    {/* Kode Barang */}
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Kode Barang</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>

                    {/* Nama Barang */}
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

                    {/* Stok */}
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Stok</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>

                    {/* Gambar */}
                    <div className="mb-4">
                        <label className="block mb-1 text-[var(--text-semi-bold-color)]">Gambar</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border p-2 w-full rounded-lg"
                            required
                        />
                    </div>


                    {/* Tanggal */}
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

                    {/* Tombol Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[var(--main-color)] text-white px-8 py-2 rounded-lg hover:bg-[#1a4689] min-w-[8rem]"
                        >
                            {inventoryData ? 'Update' : 'Kirim'}
                        </button>
                    </div>
                </form>

                </div>
            </div>
        </div>
    );
}
