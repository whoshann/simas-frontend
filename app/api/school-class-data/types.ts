export enum Grade {
    X = "X",
    XI = "XI",
    XII = "XII"
}

export interface SchoolClass {
    id?: number;
    name: string;
    code: string;
    grade: Grade;
    homeroomTeacherId: number;
    majorId: number;
    createdAt?: string;
    updatedAt?: string;
    homeroomTeacher?: {
        id: number;
        name: string;
        nip: string;
    };
    major?: {
        id: number;
        name: string;
        code: string;
    };
}

export interface SchoolClassResponse {
    code: number;
    status: string;
    message: string;
    data: SchoolClass;
}

export interface SchoolClassesResponse {
    code: number;
    status: string;
    message: string;
    data: SchoolClass[];
}

export interface UpdateSchoolClassDto {
    name: string;
    code: string;
    grade: Grade;
    homeroomTeacherId: number;
    majorId: number;
}