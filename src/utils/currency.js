/**
 * Format angka ke format mata uang Rupiah Indonesia (IDR)
 * @param {number|string} amount 
 * @returns {string} Contoh: "Rp 150.000"
 */
export function formatRupiah(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format angka standar dengan pemisah ribuan
 * @param {number|string} amount 
 * @returns {string} Contoh: "150.000"
 */
export function formatNumber(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Konversi angka menjadi teks terbilang bahasa Indonesia
 * @param {number} n 
 * @returns {string} Contoh: "Seratus Lima Puluh Ribu Rupiah"
 */
export function angkaTerbilang(n) {
  const bil = Math.floor(Math.abs(Number(n) || 0));
  if (bil === 0) return 'Nol Rupiah';

  const satuan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan',
    'Sepuluh', 'Sebelas'
  ];

  function convert(x) {
    if (x < 12) return satuan[x];
    if (x < 20) return convert(x - 10) + ' Belas';
    if (x < 100) return convert(Math.floor(x / 10)) + ' Puluh ' + convert(x % 10);
    if (x < 200) return 'Seratus ' + convert(x - 100);
    if (x < 1000) return convert(Math.floor(x / 100)) + ' Ratus ' + convert(x % 100);
    if (x < 2000) return 'Seribu ' + convert(x - 1000);
    if (x < 1000000) return convert(Math.floor(x / 1000)) + ' Ribu ' + convert(x % 1000);
    if (x < 1000000000) return convert(Math.floor(x / 1000000)) + ' Juta ' + convert(x % 1000000);
    if (x < 1000000000000) return convert(Math.floor(x / 1000000000)) + ' Miliar ' + convert(x % 1000000000);
    return '';
  }

  const hasil = convert(bil).replace(/\s+/g, ' ').trim();
  return hasil + ' Rupiah';
}
