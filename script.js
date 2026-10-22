/**
 * Kalkulator Tabungan Siswa Modern
 * Logika Bersih & Baku (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Set Tahun di Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    const form = document.getElementById('savingsForm');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const resultContent = document.getElementById('resultContent');
    const resultPanel = document.getElementById('resultPanel');

    form.addEventListener('submit', (e) => {
        // Mencegah reload halaman
        e.preventDefault(); 
        
        // --- 1. Ambil Input ---
        const targetName = document.getElementById('targetName').value || 'Impianmu';
        const targetAmount = parseFloat(document.getElementById('targetAmount').value) || 0;
        const initialBalance = parseFloat(document.getElementById('initialBalance').value) || 0;
        const depositAmount = parseFloat(document.getElementById('depositAmount').value) || 0;
        const frequency = document.getElementById('frequency').value;
        const extraDeposit = parseFloat(document.getElementById('extraDeposit').value) || 0;

        // Validasi Sederhana
        if (targetAmount <= 0 || depositAmount <= 0) {
            alert('Target Dana dan Setoran harus lebih dari 0 ya!');
            return;
        }

        // --- 2. Perhitungan Logika Tabungan ---
        
        // Sisa yang harus ditabung
        const remainingAmount = Math.max(0, targetAmount - initialBalance);
        
        // Jumlah periode yang dibutuhkan (Regular)
        const periodsNeeded = Math.ceil(remainingAmount / depositAmount);
        
        // Hitung estimasi tanggal (Asumsi hari dalam bulan rata-rata 30.4)
        const daysPerPeriod = getDaysPerPeriod(frequency);
        const totalDaysNeeded = Math.ceil(periodsNeeded * daysPerPeriod);
        const estimatedDate = addDaysToDate(new Date(), totalDaysNeeded);

        // Hitung Progres (Persentase Tabungan Awal)
        const progressPercent = Math.min(100, Math.round((initialBalance / targetAmount) * 100));

        // --- 3. Perhitungan Fitur Ekstra Hemat ---
        const totalDepositWithExtra = depositAmount + extraDeposit;
        const extraResultBox = document.getElementById('extraResultBox');
        
        if (extraDeposit > 0 && remainingAmount > 0) {
            const periodsWithExtra = Math.ceil(remainingAmount / totalDepositWithExtra);
            const daysWithExtra = Math.ceil(periodsWithExtra * daysPerPeriod);
            const daysSaved = totalDaysNeeded - daysWithExtra;

            if (daysSaved > 0) {
                document.getElementById('resExtraAmount').textContent = formatRupiah(extraDeposit);
                document.getElementById('resDaysSaved').textContent = formatDuration(daysSaved);
                extraResultBox.classList.remove('hidden');
            } else {
                extraResultBox.classList.add('hidden');
            }
        } else {
            extraResultBox.classList.add('hidden');
        }

        // --- 4. Update UI ---
        
        // Ganti Placeholder ke Konten Hasil
        resultPlaceholder.classList.add('hidden');
        resultContent.classList.remove('hidden');
        // Ratakan konten ke atas (sebelumnya center)
        resultPanel.style.justifyContent = 'flex-start'; 

        // Update Progres Visual
        document.getElementById('progressLabel').textContent = `Progres untuk ${targetName}`;
        document.getElementById('progressPercent').textContent = `${progressPercent}%`;
        document.getElementById('progressBarFill').style.width = `${progressPercent}%`;

        // Update Kartu Summary
        document.getElementById('resTargetAmount').textContent = formatRupiah(targetAmount);
        document.getElementById('resTimeNeeded').textContent = `${periodsNeeded} ${getFrequencyLabel(frequency)}`;
        document.getElementById('resTargetDate').textContent = formatDateIndo(estimatedDate);
    });
});

/* ==========================================
   FUNGSI HELPER (UTILITIES) - Baku & Bersih
   ========================================== */

/** Format angka ke Rupiah */
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

/** Hitung hari berdasarkan frekuensi */
function getDaysPerPeriod(freq) {
    switch (freq) {
        case 'daily': return 1;
        case 'weekly': return 7;
        case 'monthly': return 30.41; // Rata-rata hari dalam sebulan setahun
        default: return 1;
    }
}

/** Label frekuensi untuk UI */
function getFrequencyLabel(freq) {
    switch (freq) {
        case 'daily': return 'Hari';
        case 'weekly': return 'Minggu';
        case 'monthly': return 'Bulan';
        default: return '';
    }
}

/** Tambah hari ke tanggal hari ini */
function addDaysToDate(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/** Format Tanggal ke Bahasa Indonesia (Baku) */
function formatDateIndo(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

/** Format durasi hari ke teks readable (Hari/Bulan) */
function formatDuration(totalDays) {
    if (totalDays < 30) {
        return `${totalDays} Hari`;
    } else {
        const months = Math.floor(totalDays / 30.41);
        const remainingDays = Math.round(totalDays % 30.41);
        let text = `${months} Bulan`;
        if (remainingDays > 0) text += ` ${remainingDays} Hari`;
        return text;
    }
}
