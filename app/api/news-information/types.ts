export interface NewsInformation {
  id?: number;
  activity: string;
  description: string;
  photo?: string | null;
  date: string;
  note: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsInformationResponse {
  success: boolean;
  code: string;
  message: string;
  data: NewsInformation[];
}