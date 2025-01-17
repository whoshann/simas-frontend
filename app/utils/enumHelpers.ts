import { Condition, RepairStatus, RepairCategory } from "./enums";

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
