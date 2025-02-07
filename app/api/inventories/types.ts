export interface Inventory {
  id?: number;
  code: string;
  name: string;
  photo?: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryDto {
  code: string;
  name: string;
  photo?: string;
  stock: number;
}

export interface UpdateInventoryDto extends Partial<CreateInventoryDto> {}

export interface InventoryResponse {
  code: number;
  entity: string;
  data: Inventory;
}

export interface InventoriesResponse {
  code: number;
  entity: string;
  data: Inventory[];
}
