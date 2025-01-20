export interface Major {
    id?: number;
    name: string;
    code: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MajorResponse {
    code: number;
    status: string;
    message: string;
    data: Major;
}

export interface MajorsResponse {
    code: number;
    status: string;
    message: string;
    data: Major[];
}