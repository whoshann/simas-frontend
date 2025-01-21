export interface Student {
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
    phone: string;
    parentPhone: string;
    religion: string;
    motherName: string;
    fatherName: string;
    guardian: string | null;
    createdAt?: string;  // Tambahkan jika diperlukan
    updatedAt?: string;  // Tambahkan jika diperlukan
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