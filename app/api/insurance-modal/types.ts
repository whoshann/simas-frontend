export type StatusInsurance = "Pending" | "Disetujui" | "Ditolak";

export interface ClaimData {
    id: number;
    name: string;
    date: string;
    statusInsurance: StatusInsurance;
    class?: string;
    nis?: string;
    insuranceType?: string;
    incidentDate?: string;
    fatherName?: string;
    motherName?: string;
    reason?: string;
    supportingImage?: string;
}