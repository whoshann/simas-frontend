// constants/sidebarMenus.ts
export const sidebarMenus: Record<string, { name: string; path: string }[]> = {
    SuperAdmin: [
      { name: "Dashboard", path: "/superadmin" },
      { name: "Kelola Pengguna", path: "/superadmin/users" },
    ],
    Teacher: [
      { name: "Dashboard Guru", path: "/teacher" },
      { name: "Kelola Kelas", path: "/teacher/classes" },
    ],
    Student: [
      { name: "Dashboard Siswa", path: "/student" },
      { name: "Tugas", path: "/student/tasks" },
    ],
    StudentAffairs: [
      { name: "Dashboard Kesiswaan", path: "/student-affairs" },
      { name: "Data Siswa", path: "/student-affairs/students" },
    ],
    PublicRelations: [
      { name: "Dashboard Humas", path: "/dashboard/public-relations" },
      { name: "Laporan", path: "/dashboard/public-relations/reports" },
    ],
    Finance: [
      { name: "Dashboard Keuangan", path: "/dashboard/finance" },
      { name: "Laporan Keuangan", path: "/dashboard/finance/reports" },
    ],
    Curriculum: [
      { name: "Dashboard Kurikulum", path: "/dashboard/curriculum" },
      { name: "Data Pelajaran", path: "/dashboard/curriculum/subjects" },
    ],
    // Tambahkan role dan menu lain sesuai kebutuhan...
  };
  