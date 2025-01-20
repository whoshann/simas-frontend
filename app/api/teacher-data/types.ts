export interface Teacher {
    id?: number;
    name: string;
    nip: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    address: string;
    phone: string;
    email: string;
    position: string;
    subject: string;
    religion: string;
    education: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeacherResponse {
    code: number;
    entity: string;
    data: Teacher;
}

export interface TeachersResponse {
    code: number;
    entity: string;
    data: Teacher[];
}