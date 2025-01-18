export interface NewsInformation {
    id?: number;
    photo?: string;
    title: string;
    description: string;
    date?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface NewsInformationResponse {
    code: number;
    entity: string;
    data: NewsInformation;
}

export interface NewsInformationsResponse {
    code: number;
    entity: string;
    data: NewsInformation[];
}
  