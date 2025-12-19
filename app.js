/**
 * Fail: app.js
 * Kemaskini: PWA Handler, Global Font Adjuster, Dark Mode & UI Logic
 */

// 1. Fungsi Tema (Dark Mode) - Dijalankan serta-merta untuk elak "flicker"
(function() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();

// 2. Global Font Adjuster (A+ / A-)
// Fungsi ini dipanggil oleh butang di Navbar setiap modul
function adjustFont(step) {
    // Kita sasar elemen utama pembacaan (seperti teks surah, doa, atau kandungan modal)
    const contentElements = document.querySelectorAll('.arabic-text, .translation-text, #modalContent, .card-title-text, .lead');
    
    contentElements.forEach(el => {
        // Ambil saiz semasa, jika tiada mulakan dengan 1rem (16px)
        let currentSize = parseFloat(window.getComputedStyle(el, null).getPropertyValue('font-size'));
        
        // Hadkan saiz (minimum 12px, maksimum 40px)
        let newSize = currentSize + (step * 2);
        if (newSize >= 12 && newSize <= 40) {
            el.style.fontSize = newSize + 'px';
        }
    });

    // Simpan pilihan user jika perlu (Opsional)
    localStorage.setItem('preferredFontSize', step);
}

// 3. Toggle Dark Mode Manual
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 4. Back To Top Logic
window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    }
});

// 5. PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Registration Failed', err));
    });
}

// 6. PWA Install Handler
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-button');
    if (installBtn) installBtn.style.display = 'inline-block';
});

// 7. Pengurusan Data (Kehadiran & Kaunter) - Dijalankan selepas DOM sedia
document.addEventListener('DOMContentLoaded', () => {
    updateAppData();
    
    // Inisialisasi butang install jika ada
    const installBtn = document.getElementById('install-button');
    if (installBtn && deferredPrompt) {
        installBtn.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') installBtn.style.display = 'none';
            deferredPrompt = null;
        });
    }

    // Tunjuk notifikasi selamat datang (hanya jika belum ditunjuk sesi ini)
    if (!sessionStorage.getItem('welcomeShown')) {
        setTimeout(() => {
            showNotification('Selamat datang ke Aplikasi Islam Digital!');
            sessionStorage.setItem('welcomeShown', 'true');
        }, 2000);
    }
});

// 8. Logik Kehadiran & Kaunter Klik
function updateAppData() {
    const today = new Date().toLocaleDateString();
    let lastVisit = localStorage.getItem('lastVisit');
    let attendance = parseInt(localStorage.getItem('attendanceCount') || '0');

    if (lastVisit !== today) {
        attendance = (attendance >= 30) ? 1 : attendance + 1;
        localStorage.setItem('attendanceCount', attendance);
        localStorage.setItem('lastVisit', today);
    }

    // Kemaskini UI jika elemen wujud
    const attendanceText = document.getElementById('attendance-text');
    const attendanceBar = document.getElementById('attendance-bar');
    if (attendanceText && attendanceBar) {
        attendanceText.innerText = `${attendance}/30 hari`;
        attendanceBar.style.width = `${(attendance / 30) * 100}%`;
    }
}

// 9. Offline/Online Detection
window.addEventListener('offline', () => {
    const status = document.createElement('div');
    status.id = "offline-status";
    status.className = 'bg-danger text-white text-center p-2 fixed-top animate__animated animate__slideInDown';
    status.innerHTML = '<i class="fas fa-wifi-slash me-2"></i> Mode Luar Talian (Offline)';
    document.body.appendChild(status);
});

window.addEventListener('online', () => {
    const status = document.getElementById("offline-status");
    if (status) status.remove();
});

// 10. Notification Helper
function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Aplikasi Islam', { body: message, icon: 'icon.png' });
    }
}