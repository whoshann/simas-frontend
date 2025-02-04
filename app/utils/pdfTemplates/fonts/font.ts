import jsPDF from 'jspdf';

// Import font
import '@fontsource/times-new-roman/400.css';  // regular
import '@fontsource/times-new-roman/700.css';  // bold

export const addTimesNewRoman = (doc: jsPDF) => {
    doc.addFont('times-new-roman', 'Times New Roman', 'normal');
    doc.addFont('times-new-roman-bold', 'Times New Roman', 'bold');
};