import { ProcurementStatus } from "@/app/utils/enums";
import { Inventory } from "../inventories/types";

export interface Procurement {
  id: number;
  inventoryId: number;
  inventory: Inventory;
  role: string;
  procurementName: string;
  quantity: string;
  procurementDate: string;
  documentPath: string;
  procurementStatus: ProcurementStatus;
}

export interface ProcurementResponse {
  code: string;
  entity: string;
  data: Procurement[];
}
