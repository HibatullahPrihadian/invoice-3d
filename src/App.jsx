import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import CompanyProfileModal from './components/CompanyProfileModal';
import { SAMPLE_INVOICE, EMPTY_INVOICE, DEFAULT_COMPANY } from './utils/defaultData';
import { generateInvoicePDF, printInvoice } from './utils/pdfGenerator';
import { Eye, FileEdit, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function App() {
  const [invoiceData, setInvoiceData] = useState(() => {
    const saved = localStorage.getItem('phd_craft_invoice_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SAMPLE_INVOICE;
  });

  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('phd_craft_company_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_COMPANY;
  });

  const [activeTab, setActiveTab] = useState('edit'); // for mobile: 'edit' | 'preview'
  const [isExporting, setIsExporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState(1); // 0.85 to 1.1

  const previewRef = useRef(null);

  // Simpan ke local storage otomatis
  useEffect(() => {
    localStorage.setItem('phd_craft_invoice_data', JSON.stringify(invoiceData));
  }, [invoiceData]);

  useEffect(() => {
    localStorage.setItem('phd_craft_company_data', JSON.stringify(company));
  }, [company]);

  const handleLoadSample = () => {
    if (window.confirm('Muat contoh invoice 3D printing realistis? Data form yang belum disimpan akan digantikan.')) {
      setInvoiceData(SAMPLE_INVOICE);
    }
  };

  const handleReset = () => {
    if (window.confirm('Kosongkan formulir untuk membuat invoice baru?')) {
      setInvoiceData(EMPTY_INVOICE);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const cleanNum = (invoiceData.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9-_]/g, '-');
      const filename = `Invoice-${company.name || 'phd-craft'}-${cleanNum}.pdf`;
      await generateInvoicePDF(invoiceData, company, filename);
    } catch (err) {
      alert('Terjadi kesalahan saat membuat file PDF: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printInvoice();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar Header */}
      <Header
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isExporting={isExporting}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Kolom Kiri: Form Input & Kontrol (Desktop: Selalu Terlihat, Mobile: Toggle) */}
          <div className={`xl:col-span-6 2xl:col-span-5 space-y-6 no-print ${
            activeTab === 'edit' ? 'block' : 'hidden xl:block'
          }`}>
            <InvoiceForm
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
            />
          </div>

          {/* Kolom Kanan: Live Preview A4 Sheet (Desktop: Sticky/Scrollable, Mobile: Toggle) */}
          <div className={`xl:col-span-6 2xl:col-span-7 ${
            activeTab === 'preview' ? 'block' : 'hidden xl:block'
          }`}>
            <div className="sticky top-20 space-y-3">
              {/* Preview Control Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/70 backdrop-blur border border-slate-800 rounded-xl text-xs text-slate-400 no-print">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-semibold text-slate-200">Live Preview A4</span>
                  <span className="hidden sm:inline text-slate-500">• Standar Cetak 210mm × 297mm</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewScale(prev => Math.max(0.7, prev - 0.05))}
                    title="Perkecil Tampilan"
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] text-slate-300 w-10 text-center">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(prev => Math.min(1.2, prev + 0.05))}
                    title="Perbesar Tampilan"
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(1)}
                    title="Reset Ukuran Normal"
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white ml-1"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Container Kertas A4 */}
              <div className="overflow-x-auto p-2 sm:p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-2xl flex justify-center">
                <div 
                  style={{ 
                    transform: `scale(${previewScale})`, 
                    transformOrigin: '50% 0',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <InvoicePreview
                    ref={previewRef}
                    invoiceData={invoiceData}
                    company={company}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Modal Pengaturan Profil Perusahaan & Rekening */}
      <CompanyProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        company={company}
        onSaveCompany={(updated) => setCompany(updated)}
      />
    </div>
  );
}
