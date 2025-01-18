export interface StudentViolations {
    id?: number;
    name: string;
    classSchool: string;
    photo?: string;
    category: string;
    date?: string;
    createdAt?: string;
    updatedAt?: string;
    violations?: string;
    punishment?: string;
    photoEvidence?: string | null;
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
  