export interface Facility {
    id?: number;
    name: string;
    count: number;
    description: string;
    note?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FacilityResponse {
    code: number;
    entity: string;
    data: Facility;
}

export interface FacilitiesResponse {
    code: number;
    entity: string;
    data: Facility[];
}
  