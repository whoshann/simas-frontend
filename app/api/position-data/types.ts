export interface Position {
    id?: number;
    position: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PositionResponse {
    code: number;
    status: string;
    message: string;
    data: Position;
}

export interface PositionsResponse {
    code: number;
    status: string;
    message: string;
    data: Position[];
}