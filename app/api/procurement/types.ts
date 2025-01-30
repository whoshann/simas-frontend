export interface Procurement {
  id: number;
  role: string;
  procurementName: string;
  itemName: string;
  unitPrice: string;
  quantity: string;
  totalPrice: string;
  supplier: string;
  procurementDate: string;
  procurementStatus: string;
}

export interface ProcurementResponse {
  code: string;
  entity: string;
  data: Procurement[];
}
