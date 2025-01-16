export interface MaintenanceRecord {
  id?: number;
  category: string;
  inventoryId: string;
  roomId?: string;
  maintenanceDate: number;
  description: string;
  cost: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMaintenanceRecordDto {
  category: string;
  description: string;
  maintenanceDate: string;
  cost: number;
  status: string;
}

export interface UpdateMaintenanceRecordDto extends Partial<CreateMaintenanceRecordDto> {}

export interface MaintenanceRecordResponse {
  code: number;
  entity: string;
  data: MaintenanceRecord;
}

export interface MaintenanceRecordsResponse {
  code: number;
  entity: string;
  data: MaintenanceRecord[];
}
