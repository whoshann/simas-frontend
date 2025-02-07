export const statusMapping = {
  Available: "Tersedia",
  InUse: "Sedang Digunakan",
  UnderRepair: "Sedang Diperbaiki",
} as const;

export const reverseStatusMapping = {
  Tersedia: "Available",
  "Sedang Digunakan": "InUse",
  "Sedang Diperbaiki": "UnderRepair",
} as const;

export const getStatusInIndonesian = (status: string): string => {
  return statusMapping[status as keyof typeof statusMapping] || status;
};

export const getStatusInEnglish = (
  status: keyof typeof reverseStatusMapping
): string => {
  return reverseStatusMapping[status] || status;
};
