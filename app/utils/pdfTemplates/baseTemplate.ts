import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LOGO_BASE64 } from './logo/logoJatim';
import { LOGO_GRF } from './logo/logoGrf';

export const addHeaderTemplate = (doc: jsPDF) => {
    // Tambahkan logo
    doc.addImage(LOGO_BASE64, 'PNG', 20, 7, 15, 20);
    doc.addImage(LOGO_GRF, 'PNG', 170, 7, 17, 22);
    
    // Header text
    doc.setFontSize(10);
    doc.setFont('Times New Roman', 'bold');
    doc.text('PEMERINTAH PROVINSI JAWA TIMUR', doc.internal.pageSize.width / 2, 10, { align: 'center' });
    doc.text('DINAS PENDIDIKAN', doc.internal.pageSize.width / 2, 14, { align: 'center' });
    doc.setFontSize(12);
    doc.text('SEKOLAH MENENGAH KEJURUAN NEGERI 4 MALANG', doc.internal.pageSize.width / 2, 18.5, { align: 'center' });
    
    // Alamat dan kontak
    doc.setFontSize(9);
    doc.setFont('Times New Roman', 'normal');
    doc.text('Jalan Tanimbar 22 Malang 65117 Telp. 0341 - 353798 Fax (0341) 363099', doc.internal.pageSize.width / 2, 23, { align: 'center' });
    doc.text('www.smkn4malang.sch.id    e-mail : mail@smkn4malang.sch.id', doc.internal.pageSize.width / 2, 26.5, { align: 'center' });
    
    // Garis pembatas
    doc.setLineWidth(1);
    doc.line(20, 31, 190, 31);
    doc.setLineWidth(0.5);
    doc.line(20, 32.2, 190, 32.2);
    
    return doc;
};