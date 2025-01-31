export interface Major {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface MajorsResponse {
  success: boolean;
  code: string;
  message: string;
  data: Major[];
}
