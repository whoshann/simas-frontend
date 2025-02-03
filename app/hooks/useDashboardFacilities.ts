import { useState, useEffect, useCallback } from "react";
import { facilitiesApi } from "@/app/api/facilities";
import { incomingGoodsApi } from "@/app/api/incoming-goods";
import { outgoingGoodsApi } from "@/app/api/outgoing-goods";
import { repairsApi } from "@/app/api/repairs";
import { inventoryApi } from "@/app/api/inventories";
import { roomsApi } from "@/app/api/rooms";
import { procurementsApi } from "@/app/api/procurement";
import { ProcurementStatus } from "../utils/enums";

interface DashboardData {
  incomingGoods: Array<{ formattedDate: string; [key: string]: any }>;
  outgoingGoods: Array<{ formattedDate: string; [key: string]: any }>;
  totalInventory: Array<{ formattedDate: string; [key: string]: any }>;
  totalRooms: Array<{ formattedDate: string; [key: string]: any }>;
  repairs: Array<{
    category: string;
    type: string;
    date: string;
    status: string;
    statusColor: string;
  }>;
  latestBorrowings: Array<{
    name: string;
    date: string;
  }>;
  latestRequests: Array<{
    name: string;
    date: string;
  }>;
  latestProcurements: Array<{
    inventory: {
      name: string;
    };
    date: string;
    quantity: string;
    procurementStatus: ProcurementStatus;
  }>;
}

export const useDashboardFacilities = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    incomingGoods: [],
    outgoingGoods: [],
    totalInventory: [],
    totalRooms: [],
    repairs: [],
    latestBorrowings: [],
    latestRequests: [],
    latestProcurements: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "inprogress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        incomingRes,
        outgoingRes,
        inventoriesRes,
        roomsRes,
        repairsRes,
        procurementsRes,
      ] = await Promise.all([
        incomingGoodsApi.getAll(),
        outgoingGoodsApi.getAll(),
        inventoryApi.getAll(),
        roomsApi.getAll(),
        repairsApi.getAll(),
        procurementsApi.getAll(),
      ]);

      const formatDateIncomingGoods = incomingRes.data.map((item) => ({
        ...item,
        formattedDate: formatDate(item.date),
      }));

      const formatDateOutgoingGoods = outgoingRes.data.map((item) => ({
        ...item,
        formattedDate: formatDate(item.borrowDate),
      }));

      const formatDateRooms = roomsRes.data.map((item) => ({
        ...item,
        formattedDate: formatDate(item.createdAt || new Date().toISOString()),
      }));

      const formatDateInventory = inventoriesRes.data.map((item) => ({
        ...item,
        formattedDate: formatDate(item.createdAt || new Date().toISOString()),
      }));

      setDashboardData({
        incomingGoods: formatDateIncomingGoods,
        outgoingGoods: formatDateOutgoingGoods,
        totalInventory: formatDateInventory,
        totalRooms: formatDateRooms,
        repairs: repairsRes.data.map((repair) => ({
          category:
            repair.inventory?.name || repair.room?.name || "Tidak diketahui",
          type: repair.inventory
            ? "Inventaris"
            : repair.room
            ? "Ruangan"
            : "Tidak diketahui",
          date: formatDate(repair.maintenanceDate),
          status: repair.status,
          statusColor: getStatusColor(repair.status),
        })),
        latestBorrowings:
          outgoingRes.data?.slice(0, 5).map((item) => ({
            name: item.inventory?.name || "",
            date: formatDate(item.borrowDate),
          })) || [],
        latestRequests:
          incomingRes.data?.slice(0, 5).map((item) => ({
            name: item.inventory?.name || "",
            date: formatDate(item.date),
          })) || [],
        latestProcurements:
          procurementsRes.data?.slice(0, 5).map((item) => ({
            inventory: {
              name: item.inventory?.name || "",
            },
            date: formatDate(item.procurementDate),
            quantity: item.quantity,
            procurementStatus: item.procurementStatus as ProcurementStatus,
          })) || [],
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, [formatDate, getStatusColor]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { dashboardData, loading, error, refreshData: fetchDashboardData };
};
