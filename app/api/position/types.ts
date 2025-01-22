export interface Position {
  id: number;
  position: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PositionsResponse {
  success: boolean;
  code: string;
  message: string;
  data: Position[];
}
