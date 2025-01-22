export interface DashboardData {
  incomingGoods: number;
  outgoingGoods: number;
  totalInventory: number;
  totalRooms: number;
  repairs: RepairItem[];
  latestBorrowings: ActivityItem[];
  latestRequests: ActivityItem[];
  latestProcurements: ActivityItem[];
}

export interface RepairItem {
  no: number;
  jenis: string;
  tanggal: string;
  status: string;
  type: string;
  statusColor: string;
}

export interface ActivityItem {
  name: string;
  date: string;
}
