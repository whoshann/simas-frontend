export interface Teacher {
    id: number;
    picture?: string;
    nip: string;
    name: string;
    gender: string;
    placeOfBirth: string;
    birthDate: Date;
    address: string;
    phone: string;
    lastEducation: string;
    lastEducationMajor: string;
    subjectId: number;
    positionId: number;
    role: string;
    subject: {
        id: number;
        name: string;
        code: string; // Tambahkan code
    };
    position: {
        id: number;
        name: string;
        position: string; // Tambahkan position
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface TeacherResponse {
    code: number;
    status: string;
    message: string;
    data: Teacher;
}

export interface TeachersResponse {
    code: number;
    status: string;
    message: string;
    data: Teacher[];
}