export interface StudentViolations {
    id?: number;
    name: string;
    classSchool: string;
    photo?: string;
    category: string;
    violations?: string;
    punishment?: string;
    date?: string;
    createdAt?: string;
    updatedAt?: string;
    
}

export interface StudentViolationsResponse {
    code: number;
    entity: string;
    data: StudentViolations;
}

export interface StudentsViolationsResponse {
    code: number;
    entity: string;
    data: StudentViolations[];
}
  