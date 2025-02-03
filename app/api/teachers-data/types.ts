export interface TeacherData{
    id?: number;
    photo?: string;    
    name: string;
    nip: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    address: string;
    phone: number;
    lastEducation: string;
    majorLastEducation: string;
    subject: string;
    position: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeacherDataResponse {
    code: number;
    entity: string;
    data: TeacherData
}

export interface TeachersDataResponse {
    code: number;
    entity: string;
    data: TeacherData[];
}
  