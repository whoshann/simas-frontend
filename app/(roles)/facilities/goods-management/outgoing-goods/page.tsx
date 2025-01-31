
"use client";

import { useState, useEffect } from "react";
import { useOutgoingGoods } from "@/app/hooks/useOutgoingGoods";
import { useInventory } from "@/app/hooks/useInventory";
import LoadingSpinner from "@/app/components/loading/LoadingSpinner";
import { OutgoingGoodsHeader } from "@/app/components/outgoing-goods/OutgoingGoodHeader";
import { OutgoingGoodsActions } from "@/app/components/outgoing-goods/OutgoingGoodAction";
import { OutgoingGoodTable } from "@/app/components/outgoing-goods/OutgoingGoodTable";
import { OutgoingGoodPagination } from "@/app/components/outgoing-goods/OutgoingGoodPagination";
import { OutgoingGoodModal } from "@/app/components/outgoing-goods/OutgoingGoodModal";
import { OutgoingGoods, OutgoingGoodsRequest } from "@/app/api/outgoing-goods/types";
import { roleMiddleware } from "@/app/(auth)/middleware/middleware";

export default function OutgoingGoodsPage() {

    const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState<OutgoingGoods | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { outgoingGoods, loading, error, fetchOutgoingGoods, createOutgoingGoods, updateOutgoingGoods, deleteOutgoingGoods } = useOutgoingGoods();
    const { inventories } = useInventory();

    useEffect(() => {
        const initializePage = async () => {
            try {
                await roleMiddleware(["Facilities"]);
                setIsAuthorized(true);
                await fetchOutgoingGoods();
                console.log('Data dari fetch:', outgoingGoods); // Log data setelah fetch
            } catch (error) {
                console.error("Auth error:", error);
                setIsAuthorized(false);
            }
        };

        initializePage();
    }, []);

  // Filter dan pagination logic
  const filteredData = Array.isArray(outgoingGoods) 
    ? outgoingGoods.filter((item: OutgoingGoods) =>
        item?.inventoryId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.role?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const handleEdit = async (borrowing: OutgoingGoods) => {
    setSelectedBorrowing(borrowing);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus peminjaman ini?")) {
      try {
        await deleteOutgoingGoods(id);
        alert("Peminjaman berhasil dihapus");
      } catch (err) {
        console.error("Error deleting borrowing:", err);
        alert("Gagal menghapus peminjaman");
      }
    }
  };

  const handleModalSubmit = async (data: OutgoingGoods) => {
  try {
    // Validasi stok
    const selectedInventory = inventories.find(
      inv => inv.id === data.inventoryId
    );
    
    if (selectedInventory && data.quantity > selectedInventory.stock) {
      throw new Error(`Stok tidak mencukupi, ${selectedInventory.name} hanya tersedia sebanyak ${selectedInventory.stock}`);
    }

    // Data sudah dalam format yang benar
    if (selectedBorrowing) {
      await updateOutgoingGoods(selectedBorrowing.id!, data);
      alert("Peminjaman berhasil diperbarui");
    } else {
      await createOutgoingGoods(data);
      alert("Peminjaman berhasil diajukan");
    }
    setIsModalOpen(false);
  } catch (err: any) {
    console.error("Error submitting borrowing:", err);
    alert(err.response?.data?.message?.[0] || err.message || "Gagal menyimpan peminjaman");
  }
};

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2]">
      <OutgoingGoodsHeader
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />

      <main className="px-9 pb-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <OutgoingGoodsActions
            entriesPerPage={entriesPerPage}
            onEntriesChange={(e) => setEntriesPerPage(Number(e.target.value))}
            onAddClick={() => {
              setSelectedBorrowing(null);
              setIsModalOpen(true);
            }}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />

          <OutgoingGoodTable
            outgoingGoods={currentEntries}
            startIndex={startIndex}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <OutgoingGoodPagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            entriesPerPage={entriesPerPage}
            totalEntries={totalEntries}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <OutgoingGoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        borrowingData={selectedBorrowing}
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
