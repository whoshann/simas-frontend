export interface Subject {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectsResponse {
  success: boolean;
  code: string;
  message: string;
  data: Subject[];
}
