import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LOGO_BASE64 } from './logo/logo';

interface DispensationData {
    studentName: string;
    className: string;
    reason: string;
    startTime: string;
    endTime: string;
    date: string;
}

export const generateDispensationPDF = (data: DispensationData) => {
    // Buat instance PDF
    const doc = new jsPDF();
    
    // Set font size dan style
    doc.setFontSize(16);
    
     // Tambahkan Times New Roman font
     doc.setFont('times', 'normal');
 
     // Tambahkan logo
     doc.addImage(LOGO_BASE64, 'PNG', 20, 7, 15, 20); // Sesuaikan posisi dan ukuran
 
     // Header text dengan Times New Roman
    doc.setFontSize(10);
    doc.setFont('Times New Roman', 'bold');
     doc.text('PEMERINTAH PROVINSI JAWA TIMUR', doc.internal.pageSize.width / 2, 10, { align: 'center' });
     doc.text('DINAS PENDIDIKAN', doc.internal.pageSize.width / 2, 14, { align: 'center' });
     doc.setFontSize(12);
     doc.setFont('Times New Roman', 'bold');
     doc.text('SEKOLAH MENENGAH KEJURUAN NEGERI 4', doc.internal.pageSize.width / 2, 18.5, { align: 'center' });
     doc.text('MALANG', doc.internal.pageSize.width / 2, 23, { align: 'center' });
     
     // Alamat dan kontak
     doc.setFontSize(9);
     doc.setFont('Times New Roman', 'normal');
     doc.text('Jalan Tanimbar 22 Malang 65117 Telp. 0341 - 353798', doc.internal.pageSize.width / 2, 27, { align: 'center' });
     
     // Website dan email dengan underline
     const website = 'www.smkn4malang.sch.id';
     const email = 'mail@smkn4malang.sch.id';
     doc.setTextColor(0, 0, 255);
     doc.text(`${website}    e-mail : ${email}`, doc.internal.pageSize.width / 2, 31, { align: 'center' });
     
     // Garis pembatas ganda
     doc.setLineWidth(1);
     doc.line(20, 33, 190, 33);
     doc.setLineWidth(0.5);
    doc.line(20, 34.2, 190, 34.2);
    
     // Reset text color ke hitam
     doc.setTextColor(0);

    // Judul Surat
    doc.setFontSize(14);
    doc.text('SURAT DISPENSASI', doc.internal.pageSize.width / 2, 65, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Nomor: ${new Date().getTime()}/DISP/SMK/${new Date().getFullYear()}`, doc.internal.pageSize.width / 2, 75, { align: 'center' });

    // Isi Surat
    doc.setFontSize(11);
    doc.text('Yang bertanda tangan di bawah ini menerangkan bahwa:', 20, 90);

    // Data siswa dalam bentuk tabel
    const tableData = [
        ['Nama', ': ' + data.studentName],
        ['Kelas', ': ' + data.className],
        ['Tanggal', ': ' + new Date(data.date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })],
        ['Waktu', ': ' + `${data.startTime} - ${data.endTime} WIB`]
    ];

    (doc as any).autoTable({
        startY: 100,
        body: tableData,
        theme: 'plain',
        styles: {
            fontSize: 11,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 'auto' }
        }
    });

    // Alasan
    doc.text('Diberikan izin untuk:', 20, (doc as any).lastAutoTable.finalY + 15);
    doc.text(data.reason, 20, (doc as any).lastAutoTable.finalY + 25);

    // Tanda tangan
    const ttdY = (doc as any).lastAutoTable.finalY + 50;
    doc.text(`Surabaya, ${new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })}`, 130, ttdY);
    doc.text('Kepala Sekolah', 130, ttdY + 10);
    doc.text('Nama Kepala Sekolah', 130, ttdY + 40);
    doc.text('NIP. XXXXXXXXXXXX', 130, ttdY + 45);

    return doc;
};