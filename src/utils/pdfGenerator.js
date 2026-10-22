import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import { formatRupiah, angkaTerbilang } from './currency';

/**
 * Load image from URL and convert to base64 data URL for jsPDF embedding
 */
function loadImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Format tanggal ke ejaan bahasa Indonesia
 */
function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Generate dan unduh invoice sebagai file PDF Vector A4 profesional
 * Menggunakan jsPDF + jspdf-autotable murni (100% Vector, teks tajam, anti-overlap, anti-hilang)
 * @param {object} invoiceData - Data invoice lengkap
 * @param {object} company - Data profil bisnis phd.craft & rekening Ibet
 * @param {string} filename - Nama file output PDF
 */
export async function generateInvoicePDF(invoiceData, company, filename = 'Invoice-phd.craft.pdf') {
  // Efek konfeti visual saat ekspor
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#38bdf8', '#0284c7', '#f43f5e']
    });
  } catch (e) {
    // Abaikan jika confetti gagal
  }

  // Inisialisasi dokumen jsPDF mode Portrait, satuan mm, kertas A4 (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14; // Margin kiri & kanan
  const contentWidth = pageWidth - (margin * 2); // 182mm

  // ==========================================
  // 1. DEKORASI GARIS ATAS (TRICOLOR BAR)
  // ==========================================
  doc.setFillColor(8, 145, 178); // Cyan-600
  doc.rect(0, 0, 70, 3, 'F');
  doc.setFillColor(14, 165, 233); // Sky-500
  doc.rect(70, 0, 70, 3, 'F');
  doc.setFillColor(34, 211, 238); // Cyan-400
  doc.rect(140, 0, 70, 3, 'F');

  // ==========================================
  // 2. HEADER BISNIS PHD.CRAFT (SISI KIRI)
  // ==========================================
  // Logo Icon Box Studio 3D
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.roundedRect(margin, 10, 11, 11, 2, 2, 'F');
  doc.setFillColor(6, 182, 212); // Cyan-500
  doc.roundedRect(margin + 2.5, 12.5, 6, 6, 1, 1, 'F');

  // Nama Bisnis
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(company.name || 'phd.craft', margin + 14, 16);

  // Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(8, 145, 178);
  doc.text((company.tagline || '3D PRINTING & CUSTOM MERCHANDISE').toUpperCase(), margin + 14, 20);

  // Detail Kontak & Workshop
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Contact / PIC: ${company.owner || 'Ibet'}`, margin, 27);
  doc.text(`WhatsApp: ${company.phone || '-'}   •   Email: ${company.email || '-'}`, margin, 31.5);
  
  // Alamat workshop (wrap teks jika panjang)
  const addressLines = doc.splitTextToSize(`Workshop: ${company.address || '-'}`, 105);
  doc.text(addressLines, margin, 36);

  // ==========================================
  // 3. TAG INVOICE & METADATA (SISI KANAN)
  // ==========================================
  const rightX = pageWidth - margin;

  // Badge "INVOICE RESMI" (Kotak Hitam dengan teks Putih Murni Presisi)
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(rightX - 42, 10, 42, 7.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE RESMI', rightX - 21, 15, { align: 'center' });

  // Nomor Invoice & Tanggal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('No. Invoice:', rightX - 52, 23);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(invoiceData.invoiceNumber || '-', rightX, 23, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Tanggal Terbit:', rightX - 52, 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDateIndo(invoiceData.invoiceDate), rightX, 28, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Jatuh Tempo:', rightX - 52, 33);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDateIndo(invoiceData.dueDate), rightX, 33, { align: 'right' });

  // Status Pembayaran Badge
  if (invoiceData.status === 'PAID') {
    doc.setFillColor(209, 250, 229);
    doc.setDrawColor(110, 231, 183);
    doc.roundedRect(rightX - 38, 36.5, 38, 5.5, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(6, 95, 70);
    doc.text('LUNAS / PAID', rightX - 19, 40.5, { align: 'center' });
  } else if (invoiceData.status === 'DP') {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(252, 211, 77);
    doc.roundedRect(rightX - 38, 36.5, 38, 5.5, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14);
    doc.text('UANG MUKA (DP)', rightX - 19, 40.5, { align: 'center' });
  } else {
    doc.setFillColor(255, 228, 230);
    doc.setDrawColor(253, 164, 175);
    doc.roundedRect(rightX - 46, 36.5, 46, 5.5, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(159, 18, 57);
    doc.text('MENUNGGU PEMBAYARAN', rightX - 23, 40.5, { align: 'center' });
  }

  // Garis Pemisah Tipis
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, 45, rightX, 45);

  // ==========================================
  // 4. KOTAK CUSTOMER & ALAMAT PENGIRIMAN
  // ==========================================
  const boxY = 48;
  const boxHeight = 22;
  const box1Width = 88;
  const box2X = margin + box1Width + 6;
  const box2Width = contentWidth - box1Width - 6;

  // Box 1: Ditujukan Kepada
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, boxY, box1Width, boxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('DITUJUKAN KEPADA:', margin + 3, boxY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(invoiceData.customer.name || 'Pelanggan Terhormat', margin + 3, boxY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  let curY = boxY + 14;
  if (invoiceData.customer.company) {
    doc.text(invoiceData.customer.company, margin + 3, curY);
    curY += 4;
  }
  doc.text(`Telp/WA: ${invoiceData.customer.phone || '-'}`, margin + 3, curY);

  // Box 2: Alamat Pengiriman Paket 3D
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(box2X, boxY, box2Width, boxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('ALAMAT PENGIRIMAN PAKET 3D:', box2X + 3, boxY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const shipLines = doc.splitTextToSize(
    invoiceData.customer.address || 'Ambil langsung di workshop (Self Pickup)',
    box2Width - 6
  );
  doc.text(shipLines, box2X + 3, boxY + 9.5);

  // ==========================================
  // 5. TABEL RINCIAN ITEM 3D (JSPDF-AUTOTABLE)
  // ==========================================
  const tableData = (invoiceData.items || []).map((item, idx) => {
    const itemTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);

    const nameCol = item.isShipping 
      ? `${item.name || 'Biaya Pengiriman'}\n[JASA LOGISTIK / DELIVERY]` 
      : (item.name || 'Item Cetak 3D');

    const specCol = item.isShipping 
      ? (item.spec || 'Packing Aman') 
      : `${item.filament || 'PLA'}${item.spec ? '\n' + item.spec : ''}`;

    return [
      idx + 1,
      nameCol,
      specCol,
      item.qty,
      formatRupiah(item.unitPrice),
      formatRupiah(itemTotal)
    ];
  });

  autoTable(doc, {
    startY: boxY + boxHeight + 4,
    margin: { left: margin, right: margin },
    head: [['NO', 'NAMA MODEL / JASA', 'FILAMEN & SPESIFIKASI', 'QTY', 'HARGA SATUAN', 'TOTAL']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'left',
      cellPadding: 2.5
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
      lineColor: [241, 245, 249],
      lineWidth: 0.2
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 9, textColor: [148, 163, 184] },
      1: { halign: 'left', cellWidth: 'auto', fontStyle: 'bold' },
      2: { halign: 'left', cellWidth: 48 },
      3: { halign: 'center', cellWidth: 12, fontStyle: 'bold' },
      4: { halign: 'right', cellWidth: 28 },
      5: { halign: 'right', cellWidth: 32, fontStyle: 'bold', textColor: [15, 23, 42] }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data) => {
      // Highlight baris ongkir
      const rowIndex = data.row.index;
      if (invoiceData.items && invoiceData.items[rowIndex] && invoiceData.items[rowIndex].isShipping) {
        if (data.section === 'body') {
          data.cell.styles.fillColor = [254, 243, 199]; // Amber-100 lembut
        }
      }
      // Khusus header kolom No & Qty rata tengah, harga rata kanan
      if (data.section === 'head') {
        if (data.column.index === 0 || data.column.index === 3) data.cell.styles.halign = 'center';
        if (data.column.index === 4 || data.column.index === 5) data.cell.styles.halign = 'right';
      }
    }
  });

  // ==========================================
  // 6. RINGKASAN BIAYA & INSTRUKSI REKENING
  // ==========================================
  let finalY = doc.lastAutoTable.finalY + 6;

  // Jika tabel sangat panjang dan hampir mentok bawah, buat halaman baru
  if (finalY > 230) {
    doc.addPage();
    finalY = 20;
  }

  const itemsSubtotal = (invoiceData.items || []).reduce((sum, item) => {
    return sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
  }, 0);

  let calculatedDiscount = 0;
  if (invoiceData.discountType === 'percent') {
    calculatedDiscount = (itemsSubtotal * (Number(invoiceData.discountValue) || 0)) / 100;
  } else {
    calculatedDiscount = Number(invoiceData.discountValue) || 0;
  }
  calculatedDiscount = Math.min(calculatedDiscount, itemsSubtotal);

  const afterDiscount = Math.max(0, itemsSubtotal - calculatedDiscount);
  const calculatedTax = (afterDiscount * (Number(invoiceData.taxRate) || 0)) / 100;
  const grandTotal = Math.round(afterDiscount + calculatedTax);
  const balanceDue = Math.max(0, grandTotal - (Number(invoiceData.amountPaid) || 0));

  // --- SISI KIRI: INFORMASI PEMBAYARAN & CATATAN ---
  const leftColWidth = 100;

  // Box Rekening Transfer Bank
  doc.setFillColor(236, 254, 255);
  doc.setDrawColor(165, 243, 252);
  doc.roundedRect(margin, finalY, leftColWidth, 19, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(14, 116, 144);
  doc.text('INFORMASI PEMBAYARAN TRANSFER:', margin + 3, finalY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${company.bankName || 'BCA'}:`, margin + 3, finalY + 9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(company.bankAccount || '777-098-1234', margin + 45, finalY + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.text('Atas Nama (A/N):', margin + 3, finalY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(company.bankHolder || 'Ibet', margin + 45, finalY + 14);

  let leftY = finalY + 23;

  // Catatan & Garansi
  if (invoiceData.notes) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const noteLines = doc.splitTextToSize(invoiceData.notes, leftColWidth - 6);
    const noteBoxHeight = (noteLines.length * 3.5) + 8;
    doc.roundedRect(margin, leftY, leftColWidth, noteBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('CATATAN & GARANSI:', margin + 3, leftY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(noteLines, margin + 3, leftY + 9);

    leftY += noteBoxHeight + 4;
  }

  // Terbilang
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Terbilang:', margin, leftY);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(15, 23, 42);
  const terbilangLines = doc.splitTextToSize(angkaTerbilang(grandTotal), leftColWidth);
  doc.text(terbilangLines, margin, leftY + 4);

  // --- SISI KANAN: FINANCIAL SUMMARY & TOTAL ---
  const summaryX = pageWidth - margin;
  let rightY = finalY;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal Rincian:', rightX - 70, rightY + 3);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatRupiah(itemsSubtotal), summaryX, rightY + 3, { align: 'right' });
  rightY += 6;

  // Diskon
  if (calculatedDiscount > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text(`Potongan Diskon:`, rightX - 70, rightY + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(`-${formatRupiah(calculatedDiscount)}`, summaryX, rightY + 3, { align: 'right' });
    rightY += 6;
  }

  // Pajak / PPN
  if (calculatedTax > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`PPN (${invoiceData.taxRate}%):`, rightX - 70, rightY + 3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`+${formatRupiah(calculatedTax)}`, summaryX, rightY + 3, { align: 'right' });
    rightY += 6;
  }

  // Kotak Grand Total (Dark Slate)
  rightY += 2;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(rightX - 72, rightY, 72, 10.5, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL TAGIHAN', rightX - 68, rightY + 6.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(103, 232, 249); // Cyan-300
  doc.text(formatRupiah(grandTotal), summaryX - 3, rightY + 7.2, { align: 'right' });
  rightY += 13;

  // DP & Sisa Pembayaran jika ada
  if (Number(invoiceData.amountPaid) > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129);
    doc.text('Sudah Dibayar (DP):', rightX - 70, rightY + 3);
    doc.setFont('helvetica', 'bold');
    doc.text(formatRupiah(invoiceData.amountPaid), summaryX, rightY + 3, { align: 'right' });
    rightY += 5.5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('Sisa Pembayaran:', rightX - 70, rightY + 3);
    doc.text(formatRupiah(balanceDue), summaryX, rightY + 3, { align: 'right' });
    rightY += 8;
  }

  // Tanda Tangan
  rightY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Hormat Kami,`, rightX - 25, rightY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(company.name || 'phd.craft', rightX - 25, rightY + 4, { align: 'center' });

  // Gambar Tanda Tangan
  try {
    const sigImg = await loadImageAsBase64('/signature.jpg');
    doc.addImage(sigImg, 'JPEG', rightX - 38, rightY + 5, 26, 13);
  } catch (e) {
    // Fallback space if image loading fails
  }

  // Garis Tanda Tangan
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(rightX - 42, rightY + 19, rightX - 8, rightY + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`(${company.owner || 'Ibet'})`, rightX - 25, rightY + 23, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Owner / Founder', rightX - 25, rightY + 26.5, { align: 'center' });

  // ==========================================
  // 7. FOOTER RESMI (Halaman Invoice)
  // ==========================================
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.3);
  doc.line(margin, 285, rightX, 285);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Terima kasih atas kerja sama Anda dengan ${company.name || 'phd.craft'}. Dokumen ini sah dan diterbitkan secara elektronik.`,
    pageWidth / 2,
    289,
    { align: 'center' }
  );

  // ==========================================
  // 8. QRIS PAYMENT - HALAMAN TERPISAH (85% A4)
  // ==========================================
  doc.addPage();

  const qrisImageWidth = 178.5; // 85% of 210mm
  const qrisImageHeight = 252; // proportional height (~85% of 297mm)
  const qrisX = (pageWidth - qrisImageWidth) / 2;
  const qrisY = 12;

  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('PEMBAYARAN VIA QRIS', pageWidth / 2, 9, { align: 'center' });

  // QRIS Image centered on page
  try {
    const qrisImg = await loadImageAsBase64('/qris.png');
    doc.addImage(qrisImg, 'PNG', qrisX, qrisY, qrisImageWidth, qrisImageHeight);
  } catch (e) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('(Gambar QRIS tidak tersedia)', pageWidth / 2, 140, { align: 'center' });
  }

  // Caption
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda',
    pageWidth / 2,
    qrisY + qrisImageHeight + 5,
    { align: 'center' }
  );

  // Simpan dan unduh file PDF
  doc.save(filename);
  return true;
}

/**
 * Trigger dialog print browser langsung (vector printing)
 */
export function printInvoice() {
  window.print();
}
