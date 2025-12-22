document.addEventListener('DOMContentLoaded', () => {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const resetBtn = document.getElementById('resetData');
    const fontSelect = document.querySelector('.custom-select');

    // --- 1. PENGURUSAN DARK MODE ---

    // Fungsi untuk kemaskini tema pada body
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark'); // Untuk CSS vars
            document.body.classList.add('dark-mode');
            if (darkModeSwitch) darkModeSwitch.checked = true;
            
            // Mengubah warna status bar (untuk sesetengah mobile browser)
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1b4332');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
            if (darkModeSwitch) darkModeSwitch.checked = false;
            
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f8fbf9');
        }
    };

    // Semak tema tersimpan semasa aplikasi dibuka
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Event Listener untuk suis Dark Mode
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', () => {
            const newTheme = darkModeSwitch.checked ? 'dark' : 'light';
            
            // Tambah transisi halus pada body
            document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            console.log(`🌙 Tema ditukar ke: ${newTheme}`);
        });
    }

    // --- 2. PENGURUSAN SAIZ TULISAN ---

    if (fontSelect) {
        // Set semula nilai select mengikut memori sebaik halaman dibuka
        const savedFontSize = localStorage.getItem('quranFontSize');
        if (savedFontSize) fontSelect.value = savedFontSize;

        fontSelect.addEventListener('change', (e) => {
            const selectedSize = e.target.value;
            localStorage.setItem('quranFontSize', selectedSize);
            
            // Feedback visual kecil (Toast simple)
            showSimpleToast(`Saiz tulisan: ${selectedSize}`);
        });
    }

    // --- 3. RESET DATA (DENGAN PENGESAHAN LEBIH CANTIK) ---

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Kita gunakan confirm standard tapi dengan teks yang lebih profesional
            const confirmReset = confirm('⚠ PERHATIAN: Semua data anda (rekod kehadiran, penanda buku, dan tetapan) akan dipadamkan secara kekal. Teruskan?');
            
            if (confirmReset) {
                // Efek fade out sebelum refresh
                document.querySelector('.app-wrapper').style.opacity = '0.5';
                
                // Hapus semua data berkaitan
                const itemsToRemove = [
                    'attendanceCount', 
                    'lastVisit', 
                    'theme', 
                    'quranFontSize', 
                    'lastReadSurah',
                    'bookmarks'
                ];
                
                itemsToRemove.forEach(item => localStorage.removeItem(item));
                
                alert('Semua data telah berjaya dibersihkan. Aplikasi akan dimuat semula.');
                window.location.href = 'index.html'; 
            }
        });
    }

    // --- 4. FUNGSI TAMBAHAN (UI FEEDBACK) ---

    function showSimpleToast(message) {
        // Cipta elemen toast jika belum ada
        let toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-size: 0.8rem;
            z-index: 9999;
            pointer-events: none;
            animate__animated animate__fadeInUp
        `;
        toast.className = 'animate__animated animate__fadeInUp';
        toast.innerText = message;
        document.body.appendChild(toast);

        // Buang selepas 2 saat
        setTimeout(() => {
            toast.classList.replace('animate__fadeInUp', 'animate__fadeOutDown');
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }
});