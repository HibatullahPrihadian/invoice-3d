import React from 'react';
import { Percent, DollarSign, Calculator, Receipt, ShieldCheck } from 'lucide-react';
import { formatRupiah, angkaTerbilang } from '../utils/currency';

export default function SummarySection({
  items,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  taxRate,
  setTaxRate,
  amountPaid,
  setAmountPaid,
}) {
  // Hitung subtotal produk 3D dan pengiriman
  const itemsSubtotal = items.reduce((sum, item) => {
    return sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
  }, 0);

  const printItemsSubtotal = items
    .filter(i => !i.isShipping)
    .reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0), 0);

  const shippingSubtotal = items
    .filter(i => i.isShipping)
    .reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0), 0);

  // Kalkulasi diskon
  let calculatedDiscount = 0;
  if (discountType === 'percent') {
    calculatedDiscount = (itemsSubtotal * (Number(discountValue) || 0)) / 100;
  } else {
    calculatedDiscount = Number(discountValue) || 0;
  }
  calculatedDiscount = Math.min(calculatedDiscount, itemsSubtotal);

  const afterDiscount = Math.max(0, itemsSubtotal - calculatedDiscount);

  // Kalkulasi Pajak / PPN
  const calculatedTax = (afterDiscount * (Number(taxRate) || 0)) / 100;

  // Grand Total
  const grandTotal = Math.round(afterDiscount + calculatedTax);

  // Sisa Tagihan setelah DP
  const balanceDue = Math.max(0, grandTotal - (Number(amountPaid) || 0));

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-700/60 pb-2.5">
        <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
          <Calculator className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Kalkulasi & Ringkasan Biaya
        </h4>
      </div>

      {/* Diskon & Pajak Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Diskon */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Potongan / Diskon
          </label>
          <div className="flex gap-1">
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="fixed">Rp</option>
              <option value="percent">%</option>
            </select>
            <input
              type="number"
              min="0"
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white text-right focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Pajak / PPN */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            PPN / Pajak (%)
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTaxRate(taxRate === 11 ? 0 : 11)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                taxRate === 11 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              11%
            </button>
            <input
              type="number"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              placeholder="0%"
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white text-right focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Uang Muka / DP */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Uang Muka / DP (Rp)
          </label>
          <input
            type="number"
            min="0"
            value={amountPaid}
            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white text-right focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Rincian Angka */}
      <div className="pt-2 border-t border-slate-700/60 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal Cetak 3D & Jasa</span>
          <span className="font-mono text-slate-200">{formatRupiah(printItemsSubtotal)}</span>
        </div>

        {shippingSubtotal > 0 && (
          <div className="flex justify-between text-amber-300/80">
            <span>Total Ongkos Kirim (Logistik)</span>
            <span className="font-mono text-amber-300">+{formatRupiah(shippingSubtotal)}</span>
          </div>
        )}

        {calculatedDiscount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Diskon {discountType === 'percent' ? `(${discountValue}%)` : ''}</span>
            <span className="font-mono">-{formatRupiah(calculatedDiscount)}</span>
          </div>
        )}

        {calculatedTax > 0 && (
          <div className="flex justify-between text-slate-400">
            <span>PPN ({taxRate}%)</span>
            <span className="font-mono text-slate-200">+{formatRupiah(calculatedTax)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-700 flex justify-between items-baseline">
          <span className="text-sm font-bold text-white">Grand Total</span>
          <span className="text-lg font-extrabold text-cyan-400 font-mono">
            {formatRupiah(grandTotal)}
          </span>
        </div>

        {Number(amountPaid) > 0 && (
          <div className="flex justify-between text-xs pt-1 border-t border-dashed border-slate-700">
            <span className="text-slate-400">Telah Dibayar / DP:</span>
            <span className="font-mono text-emerald-400">{formatRupiah(amountPaid)}</span>
          </div>
        )}

        {Number(amountPaid) > 0 && (
          <div className="flex justify-between text-xs font-bold">
            <span className="text-amber-400">Sisa Tagihan (Balance Due):</span>
            <span className="font-mono text-amber-400">{formatRupiah(balanceDue)}</span>
          </div>
        )}

        {/* Terbilang */}
        <div className="pt-2 text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <span className="font-semibold text-slate-300 not-italic">Terbilang: </span>
          {angkaTerbilang(grandTotal)}
        </div>
      </div>
    </div>
  );
}
