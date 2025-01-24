import { Inventory } from "../inventories/types";
import { Room } from "../rooms/types";

export interface RepairsResponse {
  code: string;
  entity: string;
  data: Repairs;
}

export interface RepairsListResponse {
  code: string;
  entity: string;
  data: Repairs[];
}

export interface Repairs {
  id?: number;
  category: "Items" | "Rooms";
  inventoryId?: number;
  roomId?: number;
  maintenanceDate: string;
  description: string;
  cost: string | number;
  status: "Completed" | "Pending" | "InProgress";
  createdAt?: string;
  updatedAt?: string;
  inventory?: Inventory;
  room?: Room;
}
