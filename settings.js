document.addEventListener('DOMContentLoaded', () => {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const resetBtn = document.getElementById('resetData');
    const fontSelect = document.querySelector('.custom-select');

    // --- 1. PENGURUSAN DARK MODE ---

    // Fungsi untuk kemaskini tema pada body
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            // Jika kita di halaman tetapan, pastikan switch terbuka
            if (darkModeSwitch) darkModeSwitch.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeSwitch) darkModeSwitch.checked = false;
        }
    };

    // Semak tema tersimpan semasa aplikasi dibuka
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Event Listener untuk suis Dark Mode (Hanya jika elemen wujud)
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', () => {
            const newTheme = darkModeSwitch.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Memberi sedikit haptic/feedback visual
            console.log(`Tema ditukar ke: ${newTheme}`);
        });
    }

    // --- 2. PENGURUSAN SAIZ TULISAN ---

    if (fontSelect) {
        // Simpan saiz tulisan pilihan
        fontSelect.addEventListener('change', (e) => {
            const selectedSize = e.target.value;
            localStorage.setItem('quranFontSize', selectedSize);
            alert(`Saiz tulisan ditukar ke: ${selectedSize}`);
        });

        // Set semula nilai select mengikut memori
        const savedFontSize = localStorage.getItem('quranFontSize');
        if (savedFontSize) fontSelect.value = savedFontSize;
    }

    // --- 3. RESET DATA (KEHADIRAN & MEMORI) ---

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Gunakan gaya alert yang lebih kemas
            const pengesahan = confirm('Adakah anda pasti mahu set semula semua data aplikasi? Ini termasuk rekod kehadiran dan tetapan tema.');
            
            if (pengesahan) {
                // Hapus data spesifik
                localStorage.removeItem('attendanceCount');
                localStorage.removeItem('lastVisit');
                localStorage.removeItem('theme');
                localStorage.removeItem('quranFontSize');
                
                alert('Semua data telah dibersihkan.');
                window.location.href = 'index.html'; // Kembali ke utama
            }
        });
    }
});