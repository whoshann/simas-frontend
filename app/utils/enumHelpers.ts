import {
  Condition,
  RepairStatus,
  RepairCategory,
  GuaranteeOutgoingGoods,
  InsuranceClaimStatus,
  InsuranceClaimCategory,
} from "./enums";

export const ConditionLabel = {
  Good: "Baik",
  MinorDamage: "Rusak Ringan",
  SevereDamage: "Rusak Berat",
};

export const getConditionLabel = (condition: Condition): string => {
  return ConditionLabel[condition] || condition;
};

export const RepairCategoryLabel = {
  Items: "Barang",
  Rooms: "Ruangan",
};

export const RepairStatusLabel = {
  Completed: "Selesai",
  InProgress: "Dalam Proses",
  Pending: "Menunggu",
};

export const getRepairCategoryLabel = (category: RepairCategory): string => {
  return RepairCategoryLabel[category] || category;
};

export const getRepairStatusLabel = (status: RepairStatus): string => {
  return RepairStatusLabel[status] || status;
};

export const GuaranteeOutgoingGoodsLabel = {
  KTP: "KTP",
  StudentCard: "Kartu Pelajar",
  Handphone: "Handphone",
};

export const getGuaranteeOutgoingGoodsLabel = (
  guarantee: GuaranteeOutgoingGoods
): string => {
  return GuaranteeOutgoingGoodsLabel[guarantee] || guarantee;
};

export const InsuranceClaimStatusLabel = {
  Pending: "Menunggu",
  Approved: "Disetujui",
  Rejected: "Ditolak",
};

export const InsuranceClaimCategoryLabel = {
  Accident: "Kecelakaan",
  DeathDuetoIllness: "Meninggal Dunia Akibat Penyakit",
  DeathDuetoAccident: "Meninggal Dunia Akibat Kecelakaan",
  ParentalDeath: "Kematian Orang Tua",
  DisabilityDuetoAccident: "Cacat Akibat Kecelakaan",
};

export const getInsuranceClaimStatusLabel = (
  status: InsuranceClaimStatus
): string => {
  return InsuranceClaimStatusLabel[status] || status;
};

export const getInsuranceClaimCategoryLabel = (
  category: InsuranceClaimCategory
): string => {
  return InsuranceClaimCategoryLabel[category] || category;
};
