export interface Student {
    id?: number;
    name: string;
    classSchoolId: number; // Pastikan field ini ada
    majorId: number; // Pastikan field ini ada
    classSchool?: {
        id: number;
        name: string;
        code: string;
        grade: 'X' | 'XI' | 'XII';
    };
    major?: {
        id: number;
        name: string;
        code: string;
    };
    nis: string;
    nisn: string;
    gender: 'L' | 'P';
    birthDate: string;
    birthPlace: string;
    address: string;
    phone: string;
    parentPhone: string;
    religion: 'ISLAM' | 'CHRISTIANITY' | 'HINDUISM' | 'BUDDHISM' | 'CONFUCIANISM' | 'CATHOLICISM';
    motherName: string;
    fatherName: string;
    guardian: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentResponse {
    code: number;
    entity: string;
    data: Student;
}

export interface StudentsResponse {
    code: number;
    entity: string;
    data: Student[];
}