/**
 * Fail: app.js
 * Kemaskini: PWA Handler, Global Font Adjuster (Persistent), Dark Mode, Share API & UI Logic
 * Versi: 2025.1.0
 */

// 1. TEMA (DARK MODE) - Serta-merta untuk elak flicker
(function() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Muat saiz font yang disimpan (jika ada)
    const savedFontSize = localStorage.getItem('preferredFontSize');
    if (savedFontSize) {
        document.documentElement.style.setProperty('--global-font-size', savedFontSize);
    }
})();

// 2. GLOBAL FONT ADJUSTER (A+ / A-) - Ditambah simpanan localStorage
function adjustFont(step) {
    const contentElements = document.querySelectorAll('.arabic-text, .translation-text, #modalContent, .card-title-text, .lead, .card-text');
    let newSize;

    contentElements.forEach(el => {
        let currentSize = parseFloat(window.getComputedStyle(el, null).getPropertyValue('font-size'));
        newSize = currentSize + (step * 2);
        
        // Hadkan saiz (12px - 50px)
        if (newSize >= 12 && newSize <= 50) {
            el.style.fontSize = newSize + 'px';
        }
    });

    // Simpan saiz terakhir untuk rujukan (menggunakan nilai elemen pertama sebagai rujukan)
    if (newSize) {
        localStorage.setItem('preferredFontSize', newSize + 'px');
    }
}

// 3. TOGGLE DARK MODE MANUAL
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 4. FUNGSI KONGSI (WEB SHARE API)
async function shareApp() {
    const shareData = {
        title: 'QuranDigital2025',
        text: 'Jom amalkan doa harian, baca Yasin dan Tahlil dalam satu aplikasi mudah.',
        url: window.location.href,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log('Perkongsian dibatalkan');
        }
    } else {
        // Fallback: Salin pautan
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Pautan telah disalin ke clipboard!");
        } catch (err) {
            alert("Gagal menyalin pautan.");
        }
    }
}

// 5. BACK TO TOP LOGIC
window.addEventListener('scroll', () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
        btn.style.display = (window.scrollY > 400) ? "block" : "none";
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. PWA SERVICE WORKER REGISTRATION
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => {
                console.log('SW Registered');
                
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification(newWorker);
                        }
                    });
                });
            })
            .catch(err => console.log('SW Registration Failed', err));
    });

    // Refresh automatik selepas 'skipWaiting' dipanggil
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

// 7. PWA INSTALL HANDLER
let deferredPrompt;
const installBtn = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-block';
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            installBtn.style.display = 'none';
        }
    });
}

// 8. PENGURUSAN DATA & UI
document.addEventListener('DOMContentLoaded', () => {
    updateAttendance();
    updateCounters();

    // Welcome Message (Sekali setiap sesi)
    if (!sessionStorage.getItem('welcomeShown')) {
        console.log('Selamat datang ke QuranDigital2025');
        sessionStorage.setItem('welcomeShown', 'true');
    }
});

// 9. LOGIK KEHADIRAN (Gamification)
function updateAttendance() {
    const today = new Date().toLocaleDateString();
    let lastVisit = localStorage.getItem('lastVisit');
    let attendance = parseInt(localStorage.getItem('attendanceCount') || '0');

    if (lastVisit !== today) {
        attendance = (attendance >= 30) ? 1 : attendance + 1;
        localStorage.setItem('attendanceCount', attendance);
        localStorage.setItem('lastVisit', today);
    }

    const attendanceText = document.getElementById('attendance-text');
    const attendanceBar = document.getElementById('attendance-bar');
    if (attendanceText && attendanceBar) {
        attendanceText.innerText = `${attendance}/30 hari`;
        attendanceBar.style.width = `${(attendance / 30) * 100}%`;
    }
}

// 10. KEMASKINI KAUNTER POPULAR
function updateCounters() {
    const counters = {
        'count-doa': 'count_doa',
        'count-yasin': 'count_yasin',
        'count-tahlil': 'count_tahlil'
    };

    for (let id in counters) {
        const el = document.getElementById(id);
        if (el) {
            // Jika tiada data, papar nilai simulasi
            const fallback = id === 'count-doa' ? '1,240' : (id === 'count-yasin' ? '950' : '810');
            el.innerText = localStorage.getItem(counters[id]) || fallback;
        }
    }
}

// 11. OFFLINE/ONLINE DETECTION (Ditambah baik)
function toggleOfflineStatus(isOffline) {
    let status = document.getElementById("offline-status");
    
    if (isOffline) {
        if (!status) {
            status = document.createElement('div');
            status.id = "offline-status";
            status.className = "animate__animated animate__fadeInDown";
            status.style = "position:fixed; top:0; width:100%; background:#e74c3c; color:white; text-align:center; padding:10px; z-index:9999; font-weight:bold; box-shadow:0 2px 10px rgba(0,0,0,0.2);";
            status.innerHTML = '<i class="fas fa-wifi-slash me-2"></i> Mod Luar Talian Aktif';
            document.body.prepend(status);
        }
    } else {
        if (status) status.remove();
    }
}

window.addEventListener('offline', () => toggleOfflineStatus(true));
window.addEventListener('online', () => toggleOfflineStatus(false));

// 12. UPDATE NOTIFICATION UI
function showUpdateNotification(worker) {
    const updateDiv = document.createElement('div');
    updateDiv.className = "animate__animated animate__fadeInUp";
    updateDiv.style = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#2c3e50; color:white; padding:15px 25px; border-radius:50px; box-shadow:0 10px 30px rgba(0,0,0,0.5); z-index:10000; display:flex; align-items:center; gap:15px; border:2px solid #f39c12;";
    updateDiv.innerHTML = `
        <span style="font-size:0.9rem;"><i class="fas fa-magic me-2"></i> Versi baru tersedia!</span>
        <button id="btn-update-now" style="background:#f39c12; border:none; color:white; padding:5px 15px; border-radius:20px; font-weight:bold; cursor:pointer;">KEMASKINI</button>
    `;
    document.body.appendChild(updateDiv);

    document.getElementById('btn-update-now').addEventListener('click', () => {
        worker.postMessage({ action: 'skipWaiting' });
    });
}
