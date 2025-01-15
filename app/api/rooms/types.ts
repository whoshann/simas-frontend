export interface Room {
  id?: number;
  name: string;
  type: string;
  capacity: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomResponse {
  code: number;
  entity: string;
  data: Room;
}

export interface RoomsResponse {
  code: number;
  entity: string;
  data: Room[];
}
