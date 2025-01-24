import { Inventory } from "../inventories/types";
import { Condition } from "../../utils/enums";

export interface IncomingGoods {
  id?: number;
  inventoryId: number;
  quantity: number;
  date: string;
  condition: Condition;
  inventory?: Inventory;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomingGoodsRequest {
  inventoryId: number;
  quantity: number;
  date: string;
  condition: Condition;
}

export interface UpdateIncomingGoodsRequest {
  inventoryId?: number;
  quantity?: number;
  date?: string;
  condition?: Condition;
}

export interface IncomingGoodsResponse {
  code: number;
  entity: string;
  data: IncomingGoods;
}

export interface IncomingGoodsResponses {
  code: number;
  entity: string;
  data: IncomingGoods[];
}
