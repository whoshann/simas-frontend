import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LOGO_BASE64 } from './logo/logoJatim';
import { LOGO_GRF } from './logo/logoGrf';

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
     doc.addImage(LOGO_BASE64, 'PNG', 20, 7, 15, 20); 
    doc.addImage(LOGO_GRF, 'PNG', 170, 7, 17, 22);
    
     // Header text dengan Times New Roman
    doc.setFontSize(10);
    doc.setFont('Times New Roman', 'bold');
     doc.text('PEMERINTAH PROVINSI JAWA TIMUR', doc.internal.pageSize.width / 2, 10, { align: 'center' });
     doc.text('DINAS PENDIDIKAN', doc.internal.pageSize.width / 2, 14, { align: 'center' });
     doc.setFontSize(12);
     doc.setFont('Times New Roman', 'bold');
     doc.text('SEKOLAH MENENGAH KEJURUAN NEGERI 4 MALANG', doc.internal.pageSize.width / 2, 18.5, { align: 'center' });
     
     // Alamat dan kontak
     doc.setFontSize(9);
     doc.setFont('Times New Roman', 'normal');
     doc.text('Jalan Tanimbar 22 Malang 65117 Telp. 0341 - 353798 Fax (0341) 363099', doc.internal.pageSize.width / 2, 23, { align: 'center' });
     
     // Website dan email dengan underline
     const website = 'www.smkn4malang.sch.id';
     const email = 'mail@smkn4malang.sch.id';
    doc.setTextColor(0, 0, 255);
    doc.setFont('Times New Roman');
     doc.text(`${website}    e-mail : ${email}`, doc.internal.pageSize.width / 2, 26.5, { align: 'center' });
     
     // Garis pembatas ganda
     doc.setLineWidth(1);
     doc.line(20, 31, 190, 31);
     doc.setLineWidth(0.5);
    doc.line(20, 32.2, 190, 32.2);
    
     // Reset text color ke hitam
     doc.setTextColor(0);

     const leftMargin = 20;
     const rightMargin = 20;
     const contentWidth = doc.internal.pageSize.width - (leftMargin + rightMargin);
    
    // Judul Surat
    doc.setFontSize(25);
    doc.setFont('Times New Roman', 'bold');
    doc.text('SURAT IZIN', doc.internal.pageSize.width / 2, 49, { align: 'center' });
    doc.text('MASUK / KELUAR / PULANG', doc.internal.pageSize.width / 2, 59, { align: 'center' });
    
  
  // Konten Surat
  doc.setFontSize(21.5);  // Mengubah ukuran font menjadi 21.5
  doc.setFont('Times New Roman', 'normal');
  const text = 'Yang bertanda tangan dibawah ini menerangkan bahwa :';
  doc.text(text, 20, 80);
  
  // Data siswa dengan format sesuai gambar
  const startY = 100;
  const labelX = 20;
  const dotX = 70;
  
  // Nama
  doc.text('Nama', labelX, startY);
  doc.text(':', dotX, startY);
  doc.text(data.studentName, dotX + 10, startY);
  
  // Kelas
  doc.text('Kelas', labelX, startY + 14);
  doc.text(':', dotX, startY + 14);
  doc.text(data.className, dotX + 10, startY + 14);
  
  // Jam Keluar dan Masuk
  doc.text('Jam Keluar', labelX, startY + 28);
  doc.text(':', dotX, startY + 28);
  doc.text(data.startTime, dotX + 10, startY + 28);
  doc.text('Jam Masuk', dotX + 35, startY + 28);
  doc.text(data.endTime, dotX + 75, startY + 28);
  
  // Alasan
  doc.text('Alasan', labelX, startY + 42);
  doc.text(':', dotX, startY + 42);
  doc.text(data.reason, dotX + 10, startY + 42);
  
  // Keterangan izin dengan text wrapping dan justify
  const permitY = startY + 65;
  const permitContentWidth = 170;
  const permitText = 'Mengizinkan nama tersebut di atas untuk masuk / keluar / pulang tidak mengikuti pelajaran';
  
  // Memisahkan teks menjadi beberapa baris
  const splitPermitText = doc.splitTextToSize(permitText, permitContentWidth);
  
  // Mengatur posisi teks agar rata kiri kanan
  const words = permitText.split(' ');
  let currentLine = '';
  let yOffset = 0;
  
  words.forEach((word, index) => {
      const testLine = currentLine + word + ' ';
      if (doc.getTextWidth(testLine) > permitContentWidth) {
          // Menambahkan extra spacing untuk rata kanan
          const spaces = (permitContentWidth - doc.getTextWidth(currentLine)) / (currentLine.split(' ').length - 1);
          const words = currentLine.split(' ');
          let xPos = 20;
          
          words.forEach((w, i) => {
              doc.text(w, xPos, permitY + yOffset);
              xPos += doc.getTextWidth(w) + spaces;
          });
          
          currentLine = word + ' ';
          yOffset += 14;
      } else {
          currentLine = testLine;
      }
      
      if (index === words.length - 1 && currentLine) {
          doc.text(currentLine, 20, permitY + yOffset);
      }
  });
  
    // Jam - langsung di bawah text keterangan izin
    doc.setFontSize(21.5);
    doc.text('pada jam', 20, permitY + yOffset + 14);
    doc.text(data.startTime, 65, permitY + yOffset + 14);
    doc.text('s/d', 90, permitY + yOffset + 14);
    doc.text(data.endTime, 110, permitY + yOffset + 14);
    
    // Tanggal dan tanda tangan - posisi diturunkan
    doc.setFontSize(20); 
    const dateText = `Malang, ${new Date(data.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })}`;
    doc.text(dateText, 120, permitY + yOffset + 45);  // Menambah jarak dari text jam
    
    // Tanda tangan - posisi diturunkan
    const signatureY = permitY + yOffset + 65;  // Menambah jarak dari tanggal
    doc.text('Petugas Tatib / Piket', 20, signatureY);
    doc.text('Guru Bidang Diklat', 120, signatureY);
    
    // Garis tanda tangan - posisi diturunkan
    doc.setLineWidth(0.1);
    doc.line(20, signatureY + 30, 80, signatureY + 30);
    doc.line(120, signatureY + 30, 180, signatureY + 30);

    doc.setFontSize(21.5);

    return doc;
};