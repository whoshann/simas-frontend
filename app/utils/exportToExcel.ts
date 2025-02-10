// app/utils/exportToExcel.ts
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Mengatur lebar kolom
        const columnWidths = [
            { wch: 5 },  // No
            { wch: 20 }, // Nama
            { wch: 15 }, // Kategori
            { wch: 15 }, // Biaya
            { wch: 30 }, // Deskripsi
            { wch: 15 }, // Status
            { wch: 20 }, // Tanggal Perbaikan
        ];
        
        worksheet['!cols'] = columnWidths;

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
};

export const ExportConfigs = {
    inventory: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 15 },  // Kode Barang
            { wch: 25 },  // Nama Barang
            { wch: 10 },  // Stok
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Inventaris'
    },
    facility: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Fasilitas
            { wch: 10 },  // Jumlah
            { wch: 30 },  // Deskripsi
            { wch: 20 },  // Catatan
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Fasilitas'
    },
    room: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Ruang
            { wch: 15 },  // Tipe Ruang
            { wch: 10 },  // Kapasitas
            { wch: 15 },  // Status
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Ruang'
    },
    incomingGoods: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Barang
            { wch: 10 },  // Jumlah
            { wch: 20 },  // Tanggal
            { wch: 15 },  // Kondisi
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Barang Masuk'
    },
    outgoingGoods: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Peminjam
            { wch: 15 },  // Role
            { wch: 25 },  // Barang
            { wch: 10 },  // Jumlah
            { wch: 20 },  // Tanggal Peminjaman
            { wch: 20 },  // Tanggal Pengembalian
            { wch: 30 },  // Alasan
            { wch: 15 },  // Jaminan
            { wch: 15 },  // Status
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Peminjaman Barang'
    },
    expense: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 20 },  // Bulan
            { wch: 30 },  // Deskripsi
            { wch: 20 },  // Jumlah
            { wch: 20 },  // Tanggal Pengeluaran
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Pengeluaran'
    },
    income: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 20 },  // Bulan
            { wch: 20 },  // Sumber
            { wch: 30 },  // Deskripsi
            { wch: 20 },  // Jumlah
            { wch: 20 },  // Tanggal Pemasukan
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Pemasukan'
    },
    monthlyFinance: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 20 },  // Bulan dan Tahun
            { wch: 20 },  // Pemasukan
            { wch: 20 },  // Pengeluaran
            { wch: 20 },  // Sisa Keuangan
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Keuangan Bulanan'
    },
    spp: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Siswa
            { wch: 15 },  // Kelas
            { wch: 20 },  // Jumlah
            { wch: 20 },  // Bulan
            { wch: 15 },  // Status
            { wch: 20 },  // Tanggal
            
        ],
        sheetName: 'Data SPP'
    },
    budgetManagement: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 20 },  // Nama
            { wch: 15 },  // Role
            { wch: 25 },  // Judul
            { wch: 30 },  // Deskripsi
            { wch: 20 },  // Jumlah
            { wch: 15 },  // Status
            { wch: 20 },  // Tanggal
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data RAB'
    },
    itemRequest: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 20 },  // Nama
            { wch: 15 },  // Role
            { wch: 25 },  // Judul
            { wch: 30 },  // Deskripsi
            { wch: 20 },  // Jumlah
            { wch: 20 },  // Tanggal Pengajuan
            { wch: 15 },  // Status
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Pengajuan Barang'
    },
    newsInformation: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 30 },  // Judul
            { wch: 40 },  // Deskripsi
            { wch: 30 },  // Catatan
            { wch: 20 },  // Tanggal
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Informasi Berita'
    },
    studentViolations: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Siswa
            { wch: 15 },  // Kelas
            { wch: 35 },  // Pelanggaran
            { wch: 15 },  // Kategori
            { wch: 10 },  // Poin
            { wch: 30 },  // Hukuman
            { wch: 20 },  // Tanggal
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Pelanggaran Siswa'
    },
    studentAchievement: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Siswa
            { wch: 15 },  // Kelas
            { wch: 35 },  // Nama Prestasi
            { wch: 35 },  // Nama Kompetisi
            { wch: 15 },  // Kategori
            { wch: 20 },  // Tanggal
        ],
        sheetName: 'Data Prestasi Siswa'
    },
    studentAbsence: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Nama Siswa
            { wch: 15 },  // Keterangan
            { wch: 30 },  // Koordinat
            { wch: 20 },  // Tanggal
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Absensi Siswa'
    },
    majorData: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 30 },  // Nama Jurusan
            { wch: 15 },  // Kode Jurusan
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Jurusan'
    },
    schoolClassData: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 20 },  // Nama Kelas
            { wch: 15 },  // Kode Kelas
            { wch: 10 },  // Tingkat
            { wch: 25 },  // Jurusan
            { wch: 15 },  // Kode Jurusan
            { wch: 25 },  // Wali Kelas
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Kelas'
    },
    subjectData: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 30 },  // Mata Pelajaran
            { wch: 15 },  // Kode Mapel
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Mata Pelajaran'
    },
    employeeData: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 30 },  // Nama Lengkap
            { wch: 15 },  // Jenis Kelamin
            { wch: 20 },  // Tempat Lahir
            { wch: 20 },  // Tanggal Lahir
            { wch: 40 },  // Alamat
            { wch: 20 },  // Pendidikan Terakhir
            { wch: 25 },  // Jurusan
            { wch: 15 },  // Nomor Telepon
            { wch: 15 },  // Kategori
            { wch: 20 },  // Status Pernikahan
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Karyawan'
    },
    positionData: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 25 },  // Posisi Jabatan
            { wch: 30 },  // Nama Posisi Jabatan
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Posisi Jabatan Guru'
    },
    teacherData: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 30 },  // Nama Lengkap
            { wch: 15 },  // NIP
            { wch: 15 },  // Jenis Kelamin
            { wch: 20 },  // Tanggal Lahir
            { wch: 20 },  // Tempat Lahir
            { wch: 40 },  // Alamat
            { wch: 15 },  // Nomor Telepon
            { wch: 20 },  // Pendidikan Terakhir
            { wch: 25 },  // Jurusan
            { wch: 25 },  // Mata Pelajaran
            { wch: 25 },  // Posisi Jabatan
            { wch: 15 },  // Peran
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Guru'
    },
    studentData: {
        columnWidths: [
            { wch: 5 },   // No
            { wch: 30 },  // Nama Lengkap
            { wch: 15 },  // NIS
            { wch: 15 },  // NISN
            { wch: 15 },  // Kelas
            { wch: 20 },  // Jurusan
            { wch: 20 },  // Tanggal Lahir
            { wch: 20 },  // Tempat Lahir
            { wch: 15 },  // Jenis Kelamin
            { wch: 40 },  // Alamat
            { wch: 15 },  // No. Telepon
            { wch: 15 },  // No. Telepon Ortu
            { wch: 15 },  // Agama
            { wch: 25 },  // Nama Ibu
            { wch: 25 },  // Nama Ayah
            { wch: 25 },  // Nama Wali
            { wch: 15 },  // Tahun Diterima
            { wch: 20 },  // Jalur Masuk
            { wch: 20 },  // Tanggal Dibuat
            { wch: 20 },  // Terakhir Diupdate
        ],
        sheetName: 'Data Siswa'
    },
};