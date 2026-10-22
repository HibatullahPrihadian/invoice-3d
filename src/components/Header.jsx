import React from 'react';
import { 
  Box, 
  FileDown, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  Settings,
  Eye,
  FileEdit,
  Layers
} from 'lucide-react';

export default function Header({ 
  onLoadSample, 
  onReset, 
  onExportPDF, 
  onPrint, 
  onOpenSettings,
  isExporting,
  activeTab,
  setActiveTab
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3.5 no-print transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40">
            <Box className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                phd.craft
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                PRO 3D STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              3D Printing & Custom Merchandise • Owner: <span className="text-slate-300 font-semibold">Ibet</span>
            </p>
          </div>
        </div>

        {/* Mobile View Switcher (Edit vs Preview) */}
        <div className="flex xl:hidden bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            Edit Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Load Sample Data */}
          <button
            type="button"
            onClick={onLoadSample}
            title="Muat contoh data invoice 3D Printing realistis"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-xl transition-all hover:border-cyan-600 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Load Sample</span>
          </button>

          {/* Reset / New Invoice */}
          <button
            type="button"
            onClick={onReset}
            title="Kosongkan form untuk buat baru"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Business & Bank Profile Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Sesuaikan Profil phd.craft & Rekening Pembayaran"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Profil & Rekening</span>
          </button>

          {/* Direct Print */}
          <button
            type="button"
            onClick={onPrint}
            title="Cetak langsung menggunakan printer / print dialog browser"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Main Action: Export to PDF */}
          <button
            type="button"
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Export to PDF</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
