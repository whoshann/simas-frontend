import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addHeaderTemplate } from '../baseTemplate';
import { Absence } from '@/app/api/absence/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getAbsenceStatusLabel } from '@/app/utils/enumHelpers';
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: UserOptions) => jsPDF;
    }
}

export const generateAbsenceReport = (absenceData: Absence[]): jsPDF => {
    const doc = new jsPDF();
    
    // Tambahkan kop surat
    addHeaderTemplate(doc);
    
    // Tambahkan judul
    doc.setFontSize(16);
    doc.setFont('Times New Roman', 'bold');
    doc.text('LAPORAN DATA ABSENSI SISWA', doc.internal.pageSize.width / 2, 45, { align: 'center' });
    
    // Kelompokkan data berdasarkan kelas
    const groupedData = absenceData.reduce((acc, item) => {
        const className = item.Student?.class.name || 'Tidak Ada Kelas';
        if (!acc[className]) {
            acc[className] = [];
        }
        acc[className].push(item);
        return acc;
    }, {} as Record<string, Absence[]>);

    // Fungsi untuk mendapatkan tingkat kelas (X, XI, XII)
    const getGradeLevel = (className: string): string => {
        if (className.startsWith('X ')) return 'X';
        if (className.startsWith('XI ')) return 'XI';
        if (className.startsWith('XII ')) return 'XII';
        return '';
    };

    // Fungsi untuk mendapatkan jurusan
    const getMajor = (className: string): string => {
        const parts = className.split(' ');
        return parts.slice(1).join(' ');
    };

    // Kelompokkan kelas berdasarkan tingkat
    const groupedByGrade: Record<string, string[]> = {
        'X': [],
        'XI': [],
        'XII': []
    };

    Object.keys(groupedData).forEach(className => {
        const grade = getGradeLevel(className);
        if (grade && groupedByGrade[grade]) {
            groupedByGrade[grade].push(className);
        }
    });

    // Urutkan kelas dalam setiap tingkat
    Object.keys(groupedByGrade).forEach(grade => {
        groupedByGrade[grade].sort((a, b) => {
            const majorA = getMajor(a);
            const majorB = getMajor(b);
            return majorA.localeCompare(majorB);
        });
    });

    let startY = 55;
    const grades = ['X', 'XI', 'XII'];

    // Iterasi melalui setiap tingkat
    grades.forEach(grade => {
        const classesInGrade = groupedByGrade[grade];
        
        if (classesInGrade.length > 0) {
            // Tambahkan header tingkat
            doc.setFontSize(14);
            doc.setFont('Times New Roman', 'bold');
            doc.text(`Tingkat ${grade}`, 20, startY);
            startY += 10;

            // Iterasi melalui setiap kelas dalam tingkat
            classesInGrade.forEach((className, idx) => {
                const classData = groupedData[className];
                
                // Tambahkan header kelas
                doc.setFontSize(12);
                doc.setFont('Times New Roman', 'bold');
                doc.text(`Kelas: ${className}`, 20, startY);
                
                // Siapkan data untuk tabel
                const tableData = classData.map((item, index) => [
                    index + 1,
                    item.Student?.name || '',
                    getAbsenceStatusLabel(item.status),
                    format(new Date(item.date), 'dd MMMM yyyy', { locale: id }),
                    item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : '-'
                ]);

                // Buat tabel untuk kelas ini
                doc.autoTable({
                    startY: startY + 5,
                    head: [['No', 'Nama Siswa','Kelas', 'Status', 'Tanggal', 'Koordinat']],
                    body: tableData,
                    styles: {
                        font: 'Times New Roman',
                        fontSize: 10
                    },
                    headStyles: {
                        fillColor: [29, 82, 155],
                        textColor: 255,
                        fontStyle: 'bold'
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    },
                    margin: { left: 20, right: 20 },
                    didDrawPage: (data) => {
                        // Reset startY untuk halaman baru
                        if (data.pageCount > 1) {
                            startY = 20; // Mulai dari atas untuk halaman berikutnya
                        }
                    }
                });

                // Update startY untuk tabel berikutnya
                startY = (doc as any).lastAutoTable.finalY + 10;
            });
        }
    });
    
    return doc;
};