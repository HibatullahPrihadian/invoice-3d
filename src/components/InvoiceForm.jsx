import React from 'react';
import { 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  FileCheck,
  RefreshCw,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import ItemTable from './ItemTable';
import SummarySection from './SummarySection';

export default function InvoiceForm({ invoiceData, setInvoiceData }) {

  // Update root-level invoice field
  const handleFieldChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update customer object field
  const handleCustomerChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
  };

  // Generate new random invoice number
  const generateNewInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(100 + Math.random() * 900);
    handleFieldChange('invoiceNumber', `INV/PHD/${year}${month}/${rand}`);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Information Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Informasi Dokumen</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status Tagihan:</span>
            <select
              value={invoiceData.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                invoiceData.status === 'PAID'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : invoiceData.status === 'DP'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              <option value="PENDING" className="bg-slate-900 text-white">MENUNGGU PEMBAYARAN</option>
              <option value="DP" className="bg-slate-900 text-white">UANG MUKA (DP)</option>
              <option value="PAID" className="bg-slate-900 text-white">LUNAS (PAID)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Invoice Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Nomor Invoice</span>
              <button
                type="button"
                onClick={generateNewInvoiceNumber}
                title="Acak / Buat Nomor Baru"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-normal"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto</span>
              </button>
            </label>
            <input
              type="text"
              value={invoiceData.invoiceNumber}
              onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              placeholder="INV/PHD/202609/001"
              required
            />
          </div>

          {/* Invoice Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tanggal Terbit</span>
            </label>
            <input
              type="date"
              value={invoiceData.invoiceDate}
              onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Jatuh Tempo</span>
            </label>
            <input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Customer & Shipping Details */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Data Pelanggan & Alamat Kirim</h3>
            <p className="text-[11px] text-slate-400">Informasi penerima pesanan cetak 3D</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nama Pelanggan</label>
            <input
              type="text"
              value={invoiceData.customer.name}
              onChange={(e) => handleCustomerChange('name', e.target.value)}
              placeholder="Contoh: Bpk. Hendra Wijaya"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Perusahaan / Studio (Opsional)</label>
            <input
              type="text"
              value={invoiceData.customer.company}
              onChange={(e) => handleCustomerChange('company', e.target.value)}
              placeholder="Contoh: PT Kreasi Tiga Dimensi"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>WhatsApp / No. HP</span>
            </label>
            <input
              type="text"
              value={invoiceData.customer.phone}
              onChange={(e) => handleCustomerChange('phone', e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={invoiceData.customer.email}
              onChange={(e) => handleCustomerChange('email', e.target.value)}
              placeholder="client@domain.com"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Alamat Pengiriman Lengkap</span>
            </label>
            <textarea
              rows={2}
              value={invoiceData.customer.address}
              onChange={(e) => handleCustomerChange('address', e.target.value)}
              placeholder="Nama Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Dynamic Items Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <ItemTable
          items={invoiceData.items}
          onUpdateItems={(newItems) => handleFieldChange('items', newItems)}
        />
      </div>

      {/* 4. Financial Summary & Calculations */}
      <SummarySection
        items={invoiceData.items}
        discountType={invoiceData.discountType}
        setDiscountType={(val) => handleFieldChange('discountType', val)}
        discountValue={invoiceData.discountValue}
        setDiscountValue={(val) => handleFieldChange('discountValue', val)}
        taxRate={invoiceData.taxRate}
        setTaxRate={(val) => handleFieldChange('taxRate', val)}
        amountPaid={invoiceData.amountPaid}
        setAmountPaid={(val) => handleFieldChange('amountPaid', val)}
      />

      {/* 5. Catatan & Syarat Garansi Cetak */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Catatan Tambahan & Garansi Cetak
          </h4>
        </div>

        <textarea
          rows={3}
          value={invoiceData.notes}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          placeholder="Tuliskan catatan pengerjaan, ketentuan garansi unboxing, layer height, toleransi, dsb..."
          className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

    </div>
  );
}
