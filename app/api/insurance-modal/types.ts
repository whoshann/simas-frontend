import { InsuranceClaimCategory } from "@/app/utils/enums";
import { InsuranceClaimStatus } from "@/app/utils/enums";
export type StatusInsurance = "Pending" | "Disetujui" | "Ditolak";

export interface ClaimData {
  id: number;
  studentId: number;
  student?: {
    name?: string;
    nis?: string;
    class?: {
      name?: string;
    };
  };
  category: InsuranceClaimCategory;
  claimDate: string;
  fatherName: string;
  motherName: string;
  reason: string;
  photo: string;
  statusInsurance: InsuranceClaimStatus;
}
