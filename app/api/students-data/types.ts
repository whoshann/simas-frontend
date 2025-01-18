export interface StudentData{
    id?: number;
    name: string;
    classSchool: string;
    major: string;
    nis: string;
    nisn: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    address: string;
    phone: number;
    parentPhone: number;
    religion: string;
    motherName: string;
    fatherName: string;
    guardian: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentDataResponse {
    code: number;
    entity: string;
    data: StudentData
}

export interface StudentsDataResponse {
    code: number;
    entity: string;
    data: StudentData[];
}
  