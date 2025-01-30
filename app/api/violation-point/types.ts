export interface ViolationPoint {
    id: number;
    name: string;
    points: number;
    createdAt: string;
    updatedAt: string;
}

export interface ViolationPointResponse {
    success: boolean;
    code: string;
    message: string;
    data: ViolationPoint[];
}