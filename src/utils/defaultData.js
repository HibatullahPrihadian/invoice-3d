export const FILAMENT_OPTIONS = [
  { value: 'PLA - High Speed', label: 'PLA (Standard / High Speed)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { value: 'PLA+ / Tough PLA', label: 'PLA+ / Tough PLA', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'PETG - Heavy Duty', label: 'PETG (Tahan Panas & Kuat)', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  { value: 'ABS / ASA', label: 'ABS / ASA (Tahan Cuaca Luar)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { value: 'TPU 95A - Flexible', label: 'TPU 95A (Fleksibel / Karet)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { value: 'Resin SLA 8K High Detail', label: 'Resin SLA / DLP (Ultra Detail)', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { value: 'Nylon / Carbon Fiber (PA-CF)', label: 'Nylon / Carbon Fiber (PA-CF)', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  { value: 'Jasa Modeling 3D / Desain CAD', label: 'Jasa Modeling 3D / Desain CAD', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { value: 'Lainnya / Kustom', label: 'Lainnya / Kustom...', color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
];

export const COURIER_PRESETS = [
  'J&T Express (Reguler)',
  'SiCepat Cargo / Best',
  'JNE Reguler / YES',
  'GoSend / GrabExpress Instant',
  'Paxel Same Day Delivery',
  'Ambil di Workshop (Pickup)',
];

export const DEFAULT_COMPANY = {
  name: 'phd.craft',
  tagline: '3D Printing & Custom Merchandise',
  owner: 'Ibet',
  phone: '+62 812-8899-0011',
  email: 'phd.craft.official@gmail.com',
  address: 'Jl. Rereng Wulung No. 42, Sukaluyu, Cibeunying Kaler, Kota Bandung 40123',
  bankName: 'Bank Central Asia (BCA)',
  bankAccount: '777-098-1234',
  bankHolder: 'Ibet',
  secondaryBank: 'Mandiri / QRIS All Payment',
  secondaryAccount: '130-00-1928374-1 a/n Ibet',
  terms: '1. Pembayaran DP minimal 50% sebelum pengerjaan dimulai.\n2. Estimasi pengerjaan dihitung sejak file 3D dan warna filamen terkonfirmasi.\n3. Garansi cetak ulang berlaku 2x24 jam setelah paket diterima jika terdapat cacat produksi.'
};

export const SAMPLE_INVOICE = {
  invoiceNumber: 'INV/PHD/202609/001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'PENDING', // 'PAID', 'PENDING', 'DP'
  paymentMethod: 'Transfer Bank BCA',
  customer: {
    name: 'Bpk. Rizky Ramadhan',
    company: 'Studio Arsitektur Dimensi',
    phone: '+62 813-8821-4590',
    email: 'rizky.dimensi@gmail.com',
    address: 'Komp. Graha Estetika Blok C-15, Banyumanik, Semarang 50269'
  },
  items: [
    {
      id: 'item-1',
      name: 'Maket Skala 1:100 Villa Tropis (Modular Roof & Wall)',
      filament: 'PLA - High Speed',
      spec: '280g • 8 Jam 30 Menit',
      qty: 1,
      unitPrice: 225000,
      isShipping: false
    },
    {
      id: 'item-2',
      name: 'Custom Mechanical Bracket Casing ESP32 (Heavy Duty)',
      filament: 'PETG - Heavy Duty',
      spec: '120g • 4 Jam (Infill 40%)',
      qty: 4,
      unitPrice: 65000,
      isShipping: false
    },
    {
      id: 'item-3',
      name: 'Dampener Kaki Drone FPV Anti-Vibration',
      filament: 'TPU 95A - Flexible',
      spec: '40g • 1 Jam 45 Menit',
      qty: 2,
      unitPrice: 40000,
      isShipping: false
    },
    {
      id: 'item-shipping',
      name: 'Biaya Pengiriman (SiCepat Cargo + Extra Bubble Wrap & Dus Tebal)',
      filament: '-',
      spec: 'Berat Paket Total ~850g',
      qty: 1,
      unitPrice: 35000,
      isShipping: true
    }
  ],
  discountType: 'fixed', // 'fixed' | 'percent'
  discountValue: 0,
  taxRate: 0, // e.g. 11% or 0
  amountPaid: 0, // for DP calculation
  notes: 'Terima kasih atas kepercayaan Anda memesan di phd.craft! Kami memproses cetakan 3D dengan kalibrasi presisi tinggi 0.16mm layer height.'
};

export const EMPTY_INVOICE = {
  invoiceNumber: `INV/PHD/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'PENDING',
  paymentMethod: 'Transfer Bank BCA',
  customer: {
    name: '',
    company: '',
    phone: '',
    email: '',
    address: ''
  },
  items: [
    {
      id: 'item-init-1',
      name: '',
      filament: 'PLA - High Speed',
      spec: '',
      qty: 1,
      unitPrice: 0,
      isShipping: false
    }
  ],
  discountType: 'fixed',
  discountValue: 0,
  taxRate: 0,
  amountPaid: 0,
  notes: 'Garansi reprint berlaku jika ada kendala layer shift / patah saat pengiriman dengan menyertakan video unboxing.'
};
