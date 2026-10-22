import React from 'react';
import { 
  Box, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Layers, 
  Clock, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock3
} from 'lucide-react';
import { formatRupiah, angkaTerbilang } from '../utils/currency';

const InvoicePreview = React.forwardRef(({ invoiceData, company }, ref) => {
  // Hitung subtotal
  const itemsSubtotal = (invoiceData.items || []).reduce((sum, item) => {
    return sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
  }, 0);

  // Kalkulasi diskon
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

  // Format tanggal bahasa Indonesia
  const formatDateIndo = (dateStr) => {
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
  };

  return (
    <div className="w-full flex justify-center py-2 px-1">
      {/* Lembar Invoice A4 Siap Cetak */}
      <div 
        ref={ref} 
        id="invoice-print-area"
        className="invoice-sheet text-slate-800 bg-white font-sans text-xs leading-relaxed select-text"
      >
        {/* Dekorasi Garis Atas (Solid Tricolor Bar tanpa CSS Gradient) */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="w-1/3 bg-cyan-600"></div>
          <div className="w-1/3 bg-sky-500"></div>
          <div className="w-1/3 bg-cyan-400"></div>
        </div>

        {/* 1. Header & Kop Bisnis */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-100">
          {/* Logo & Info Bisnis */}
          <div className="space-y-1.5 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shadow-md">
                <Box size={24} className="stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  {company.name || 'phd.craft'}
                </h1>
                <p className="text-[11px] font-semibold text-cyan-600 tracking-wide uppercase mt-0.5">
                  {company.tagline || '3D Printing & Custom Merchandise'}
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 space-y-0.5">
              <p className="font-semibold text-slate-700">Contact / PIC: {company.owner || 'Ibet'}</p>
              <p className="flex items-center gap-1">
                <Phone size={12} className="text-slate-400" />
                <span>{company.phone}</span>
              </p>
              <p className="flex items-center gap-1">
                <Mail size={12} className="text-slate-400" />
                <span>{company.email}</span>
              </p>
              <p className="flex items-start gap-1">
                <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{company.address}</span>
              </p>
            </div>
          </div>

          {/* Tag & Metadata Tagihan */}
          <div className="sm:text-right space-y-2">
            <div 
              className="inline-block px-4 py-1.5 rounded-lg"
              style={{ backgroundColor: '#0f172a' }}
            >
              <h2 
                className="text-xs font-bold uppercase block"
                style={{ color: '#ffffff', letterSpacing: '1.5px', margin: 0 }}
              >
                INVOICE RESMI
              </h2>
            </div>

            <div className="text-[11px] space-y-1 text-slate-600">
              <div className="flex sm:justify-end gap-2">
                <span className="text-slate-400">No. Invoice:</span>
                <span className="font-sans font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {invoiceData.invoiceNumber || '-'}
                </span>
              </div>
              <div className="flex sm:justify-end gap-2">
                <span className="text-slate-400">Tanggal Terbit:</span>
                <span className="font-semibold text-slate-800">{formatDateIndo(invoiceData.invoiceDate)}</span>
              </div>
              <div className="flex sm:justify-end gap-2">
                <span className="text-slate-400">Jatuh Tempo:</span>
                <span className="font-semibold text-slate-800">{formatDateIndo(invoiceData.dueDate)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="sm:flex sm:justify-end pt-1">
              {invoiceData.status === 'PAID' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  LUNAS / PAID
                </span>
              ) : invoiceData.status === 'DP' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock3 size={12} className="text-amber-600" />
                  UANG MUKA (DP)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  <AlertCircle size={12} className="text-rose-600" />
                  MENUNGGU PEMBAYARAN
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Informasi Kepada / Tujuan Pengiriman */}
        <div className="my-5 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Ditujukan Kepada:
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {invoiceData.customer.name || 'Pelanggan Terhormat'}
            </h3>
            {invoiceData.customer.company && (
              <p className="text-xs font-semibold text-cyan-700">{invoiceData.customer.company}</p>
            )}
            <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
              {invoiceData.customer.phone && <p>Telp / WA: {invoiceData.customer.phone}</p>}
              {invoiceData.customer.email && <p>Email: {invoiceData.customer.email}</p>}
            </div>
          </div>

          <div className="sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
              <Truck size={12} className="text-amber-600" />
              Alamat Pengiriman Paket 3D:
            </span>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              {invoiceData.customer.address || 'Ambil langsung di workshop (Self Pickup)'}
            </p>
          </div>
        </div>

        {/* 3. Tabel Rincian Pesanan */}
        <div className="my-4">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="text-[11px] uppercase">
                <th style={{ color: '#ffffff' }} className="py-2.5 px-3 text-center w-8 rounded-l-lg">No</th>
                <th style={{ color: '#ffffff' }} className="py-2.5 px-3 text-left">Nama Model / Jasa</th>
                <th style={{ color: '#ffffff' }} className="py-2.5 px-3 text-left">Filamen & Spesifikasi</th>
                <th style={{ color: '#ffffff' }} className="py-2.5 px-3 text-center w-12">Qty</th>
                <th style={{ color: '#ffffff' }} className="py-2.5 px-3 text-right w-28">Harga Satuan</th>
                <th style={{ color: '#ffffff' }} className="py-2.5 px-3 text-right w-32 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {(invoiceData.items || []).map((item, index) => {
                const itemTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);

                return (
                  <tr 
                    key={item.id || index}
                    className={`transition-colors ${
                      item.isShipping 
                        ? 'bg-amber-50/60 font-medium' 
                        : index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-sans font-semibold text-[11px]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {index + 1}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">
                        {item.name || (item.isShipping ? 'Biaya Pengiriman Ekspedisi' : 'Item Cetak 3D')}
                      </div>
                      {item.isShipping && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-700 uppercase">
                          📦 Jasa Logistik / Delivery
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {!item.isShipping ? (
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                            {item.filament || 'PLA'}
                          </span>
                          {item.spec && (
                            <div className="text-[10px] text-slate-500 font-sans">
                              {item.spec}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">
                          {item.spec || 'Aman dengan Bubble Wrap'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-slate-700" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {item.qty}
                    </td>

                    <td className="py-3 px-3 text-right font-sans font-semibold text-slate-600" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatRupiah(item.unitPrice)}
                    </td>

                    <td className="py-3 px-3 text-right font-sans font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatRupiah(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Rekapitulasi Pembayaran & Info Bank */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          
          {/* Sisi Kiri: Instruksi Pembayaran Rekening Ibet & Catatan */}
          <div className="sm:col-span-7 space-y-3">
            
            {/* Rekening Pembayaran */}
            <div className="p-3 rounded-xl bg-cyan-50/50 border border-cyan-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-1">
                <CreditCard size={12} className="text-cyan-700" />
                Informasi Pembayaran Transfer
              </span>
              
              <div className="mt-1.5 space-y-1 text-[11px] text-slate-700">
                <div className="flex justify-between items-baseline border-b border-cyan-100/60 pb-1">
                  <span className="font-semibold">{company.bankName || 'Bank Central Asia (BCA)'}:</span>
                  <span className="font-sans font-bold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
                    {company.bankAccount || '777-098-1234'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-slate-600">
                  <span>Atas Nama (A/N):</span>
                  <span className="font-semibold text-slate-900">{company.bankHolder || 'Ibet'}</span>
                </div>
                {company.secondaryBank && (
                  <div className="pt-1 text-[10px] text-slate-500 italic">
                    {company.secondaryBank} • {company.secondaryAccount}
                  </div>
                )}
              </div>
            </div>

            {/* Catatan / Garansi */}
            {invoiceData.notes && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] text-slate-600">
                <span className="font-bold text-slate-700 block mb-0.5">Catatan & Garansi:</span>
                <p className="whitespace-pre-line leading-relaxed">{invoiceData.notes}</p>
              </div>
            )}

            {/* Terbilang */}
            <div className="text-[11px] text-slate-700 italic">
              <span className="font-bold not-italic text-slate-900">Terbilang: </span>
              {angkaTerbilang(grandTotal)}
            </div>

          </div>

          {/* Sisi Kanan: Summary Total */}
          <div className="sm:col-span-5 space-y-2 text-xs">
            <div className="space-y-1.5 pb-2 border-b border-slate-200 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal Rincian:</span>
                <span className="font-sans font-semibold text-slate-800" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatRupiah(itemsSubtotal)}
                </span>
              </div>

              {calculatedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Potongan Diskon:</span>
                  <span className="font-sans font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    -{formatRupiah(calculatedDiscount)}
                  </span>
                </div>
              )}

              {calculatedTax > 0 && (
                <div className="flex justify-between">
                  <span>PPN ({invoiceData.taxRate}%):</span>
                  <span className="font-sans font-semibold text-slate-800" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    +{formatRupiah(calculatedTax)}
                  </span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div 
              className="p-3 rounded-xl flex justify-between items-baseline shadow-sm"
              style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
            >
              <span className="font-bold uppercase text-[11px]" style={{ color: '#ffffff' }}>
                Total Tagihan
              </span>
              <span 
                className="font-sans font-extrabold text-base"
                style={{ color: '#67e8f9', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatRupiah(grandTotal)}
              </span>
            </div>

            {/* DP & Balance Due jika ada */}
            {Number(invoiceData.amountPaid) > 0 && (
              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Sudah Dibayar (DP):</span>
                  <span className="font-sans font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(invoiceData.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                  <span>Sisa Pembayaran:</span>
                  <span className="font-sans font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(balanceDue)}
                  </span>
                </div>
              </div>
            )}

            {/* Tanda Tangan / Stamp Area */}
            <div className="pt-6 text-center">
              <p className="text-[10px] font-semibold text-slate-500 mb-1">
                Hormat Kami, <span className="font-bold text-slate-800">{company.name}</span>
              </p>
              <div className="flex flex-col items-center justify-center">
                <img 
                  src="/signature.jpg" 
                  alt="Tanda Tangan Owner" 
                  className="h-14 w-auto object-contain my-1"
                />
                <div className="w-32 border-b border-slate-400"></div>
                <p className="text-[11px] font-bold text-slate-800 mt-1">({company.owner || 'Ibet'})</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Owner / Founder</p>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
          <p>Terima kasih atas kerja sama Anda dengan {company.name}. Dokumen ini sah dan diterbitkan secara elektronik.</p>
        </div>

      </div>

      {/* QRIS Payment - Halaman Terpisah */}
      <div 
        className="invoice-sheet text-slate-800 bg-white font-sans text-xs leading-relaxed select-text mt-8 print:mt-0"
        style={{ pageBreakBefore: 'always' }}
      >
        <div className="flex flex-col items-center justify-center h-full text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Pembayaran via QRIS
          </span>
          <img 
            src="/qris.png" 
            alt="QRIS Prihadian Craft" 
            className="h-auto rounded-xl border border-slate-200 shadow-md"
            style={{ width: '85%' }}
          />
          <p className="mt-3 text-[11px] text-slate-500">
            Scan QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda
          </p>
        </div>
      </div>
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';
export default InvoicePreview;
