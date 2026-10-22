import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Truck, 
  Layers, 
  Clock, 
  Copy, 
  Boxes,
  HelpCircle
} from 'lucide-react';
import { FILAMENT_OPTIONS, COURIER_PRESETS } from '../utils/defaultData';
import { formatRupiah } from '../utils/currency';

export default function ItemTable({ items, onUpdateItems }) {
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    onUpdateItems(newItems);
  };

  const handleAddItem = (isShipping = false, presetName = '', defaultPrice = 0) => {
    const newItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: presetName || (isShipping ? 'Biaya Pengiriman (JNE / SiCepat / J&T)' : ''),
      filament: isShipping ? '-' : 'PLA - High Speed',
      spec: isShipping ? 'Termasuk Packing Aman' : '',
      qty: 1,
      unitPrice: defaultPrice || 0,
      isShipping: isShipping
    };
    onUpdateItems([...items, newItem]);
  };

  const handleDeleteItem = (index) => {
    if (items.length <= 1) {
      // Sisakan minimal 1 baris kosong
      onUpdateItems([{
        id: 'item-' + Date.now(),
        name: '',
        filament: 'PLA - High Speed',
        spec: '',
        qty: 1,
        unitPrice: 0,
        isShipping: false
      }]);
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    onUpdateItems(newItems);
  };

  const handleDuplicateItem = (index) => {
    const target = items[index];
    const duplicated = {
      ...target,
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: target.name ? `${target.name} (Copy)` : ''
    };
    const newItems = [...items];
    newItems.splice(index + 1, 0, duplicated);
    onUpdateItems(newItems);
  };

  // State menu dropdown cepat ongkir
  const [showCourierDropdown, setShowCourierDropdown] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Rincian Item 3D & Jasa</h3>
            <p className="text-[11px] text-slate-400">Model 3D, jenis filamen, berat/waktu print, dan ongkir</p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Tombol Cepat Tambah Ongkir */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCourierDropdown(!showCourierDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-lg transition-all active:scale-95"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Tambah Ongkir</span>
            </button>

            {/* Quick Courier Preset Menu */}
            {showCourierDropdown && (
              <div className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-20">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Pilih Ekspedisi / Kurir
                </div>
                {COURIER_PRESETS.map((courier, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleAddItem(true, `Biaya Pengiriman (${courier})`, courier.includes('Pickup') ? 0 : 25000);
                      setShowCourierDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 flex items-center gap-2"
                  >
                    <Truck className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{courier}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tombol Tambah Item Biasa */}
          <button
            type="button"
            onClick={() => handleAddItem(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-lg transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Item</span>
          </button>
        </div>
      </div>

      {/* Tabel Item Responsif */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const itemTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden', margin: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.isShipping
                    ? 'bg-amber-950/20 border-amber-900/50 hover:border-amber-700/60'
                    : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  
                  {/* Item Index & Status Icon */}
                  <div className="flex items-center justify-between md:justify-center md:col-span-1 pt-1">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      item.isShipping 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="md:hidden text-[11px] font-semibold text-slate-400">
                      {item.isShipping ? 'Baris Ekspedisi' : 'Baris Cetak 3D'}
                    </span>
                  </div>

                  {/* Nama Item / 3D Model / Deskripsi */}
                  <div className="md:col-span-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-slate-400">
                        {item.isShipping ? 'Rincian Pengiriman / Ekspedisi' : 'Nama Model 3D / Jasa'}
                      </label>
                      {item.isShipping && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-semibold">
                          ONGKIR
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder={item.isShipping ? 'Contoh: Ongkir SiCepat Cargo (Jakarta - Bandung)' : 'Contoh: Enclosure Casing Arduino ESP32'}
                      className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Jenis Filament (atau Keterangan jika Ongkir) */}
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      Filamen / Material
                    </label>
                    {item.isShipping ? (
                      <input
                        type="text"
                        value={item.filament === '-' ? 'Ekspedisi / Logistik' : item.filament}
                        onChange={(e) => handleItemChange(index, 'filament', e.target.value)}
                        placeholder="Info Ekspedisi"
                        className="w-full px-2.5 py-1.5 bg-slate-900/50 border border-slate-700/80 rounded-lg text-xs text-slate-400 focus:outline-none"
                      />
                    ) : (
                      <select
                        value={item.filament}
                        onChange={(e) => handleItemChange(index, 'filament', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        {FILAMENT_OPTIONS.map((fil, fIdx) => (
                          <option key={fIdx} value={fil.value} className="bg-slate-900 text-white">
                            {fil.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Durasi / Berat (Gram & Jam) */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Berat / Durasi
                    </label>
                    <input
                      type="text"
                      value={item.spec}
                      onChange={(e) => handleItemChange(index, 'spec', e.target.value)}
                      placeholder={item.isShipping ? 'Packing Kayu/Dus' : '150g • 5 Jam'}
                      className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Qty & Harga Satuan & Subtotal */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 pt-1 md:pt-0">
                    {/* Action buttons on desktop */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicateItem(index)}
                        title="Duplikat baris"
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50 rounded-lg transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        title="Hapus baris"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Row: Qty, Harga Satuan, dan Total Baris */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-700/40 grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-slate-400">Jumlah (Qty)</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full mt-0.5 px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white text-center focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase text-slate-400">Harga Satuan (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full mt-0.5 px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white text-right focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 text-right">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">Total Item</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      {formatRupiah(itemTotal)}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
