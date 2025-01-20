export interface Subject {
    id?: number;
    name: string;
    code: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SubjectResponse {
    code: number;
    entity: string;
    data: Subject;
}

export interface SubjectsResponse {
    code: number;
    entity: string;
    data: Subject[];
}