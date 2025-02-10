import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addHeaderTemplate } from '../baseTemplate';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const generateViolationReport = (violationData: any[]): jsPDF => {
    const doc = new jsPDF();
    
    // Tambahkan kop surat
    addHeaderTemplate(doc);
    
    // Tambahkan judul
    doc.setFontSize(16);
    doc.setFont('Times New Roman', 'bold');
    doc.text('LAPORAN DATA PELANGGARAN SISWA', doc.internal.pageSize.width / 2, 45, { align: 'center' });
    
    // Siapkan data untuk tabel langsung dari data yang ditampilkan
    const tableData = violationData.map((item, index) => [
        index + 1,
        item.student.name,
        item.student.class.name,
        item.name,
        item.violationPoint.name,
        item.punishment,
        item.violationPoint.points,
        format(new Date(item.date), 'dd MMMM yyyy', { locale: id })
    ]);

    // Buat tabel
    doc.autoTable({
        startY: 55,
        head: [['No', 'Nama Siswa', 'Kelas', 'Pelanggaran', 'Kategori', 'Hukuman', 'Poin', 'Tanggal']],
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
        margin: { left: 20, right: 20 }
    });
    
    return doc;
};