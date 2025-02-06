import { GuaranteeOutgoingGoods } from "@/app/utils/enums";
import { Inventory } from "../inventories/types";

export type OutgoingGoods = {
  id?: number;
  role: string;
  inventoryId: Inventory;
  inventory: Inventory;
  borrowerName: string;
  borrowDate: string;
  returnDate: string;
  quantity: number;
  reason: string;
  guarantee: GuaranteeOutgoingGoods;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface OutgoingGoodsListResponse {
  code: string;
  entity: string;
  data: OutgoingGoods[];
}

export interface OutgoingGoodsRequest {
  role: string;
  inventoryId: number;
  borrowerName: string;
  borrowDate: string;
  returnDate: string;
  quantity: number;
  reason: string;
  guarantee: GuaranteeOutgoingGoods;
  status: string;
}

export interface OutgoingGoodsResponse {
  id: number;
  role: string;
  inventoryId: number;
  borrowerName: string;
  borrowDate: string;
  returnDate: string;
  quantity: number;
  reason: string;
  guarantee: GuaranteeOutgoingGoods;
  status: string;
  createdAt: string;
  updatedAt: string;
}
