/**
 * Fail: app.js
 * Kemaskini: PWA Handler, Global Font Adjuster, Dark Mode, Share API & UI Logic
 */

// 1. TEMA (DARK MODE) - Dijalankan segera untuk elak flicker
(function() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();

// 2. GLOBAL FONT ADJUSTER (A+ / A-)
function adjustFont(step) {
    const contentElements = document.querySelectorAll('.arabic-text, .translation-text, #modalContent, .card-title-text, .lead, .card-text');
    
    contentElements.forEach(el => {
        let currentSize = parseFloat(window.getComputedStyle(el, null).getPropertyValue('font-size'));
        let newSize = currentSize + (step * 2);
        
        // Hadkan saiz (12px - 50px)
        if (newSize >= 12 && newSize <= 50) {
            el.style.fontSize = newSize + 'px';
        }
    });
}

// 3. TOGGLE DARK MODE MANUAL
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 4. FUNGSI KONGSI (WEB SHARE API)
async function shareApp() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'QuranDigital2025',
                text: 'Jom amalkan doa harian, baca Yasin dan Tahlil dalam satu aplikasi mudah.',
                url: window.location.href,
            });
        } catch (err) {
            console.log('Perkongsian dibatalkan');
        }
    } else {
        // Fallback jika browser tidak sokong Share API (Contoh: Chrome Desktop)
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert("Pautan telah disalin! Sila hantar kepada rakan anda.");
    }
}

// 5. BACK TO TOP LOGIC
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

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. PWA SERVICE WORKER REGISTRATION (DIKEMASKINI DENGAN UPDATE LOGIC)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => {
                console.log('SW Registered');
                
                // Mula mengesan kemaskini versi baru
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Panggil fungsi banner jika ada fail baru dikesan
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(err => console.log('SW Registration Failed', err));
    });
}

// 7. PWA INSTALL HANDLER
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-button');
    if (installBtn) {
        installBtn.style.display = 'inline-block';
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    installBtn.style.display = 'none';
                }
                deferredPrompt = null;
            }
        });
    }
});

// 8. PENGURUSAN DATA & UI (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan logik kehadiran
    updateAttendance();
    
    // Kemaskini Kaunter Popular (Simulasi atau dari LocalStorage)
    updateCounters();

    // Notifikasi Selamat Datang (Sesi sekali sahaja)
    if (!sessionStorage.getItem('welcomeShown')) {
        setTimeout(() => {
            console.log('Selamat datang ke QuranDigital2025');
            sessionStorage.setItem('welcomeShown', 'true');
        }, 2000);
    }
});

// 9. LOGIK KEHADIRAN (Attendance Logic)
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
    const cDoa = document.getElementById('count-doa');
    const cYasin = document.getElementById('count-yasin');
    const cTahlil = document.getElementById('count-tahlil');

    if (cDoa) cDoa.innerText = localStorage.getItem('count_doa') || '1,240';
    if (cYasin) cYasin.innerText = localStorage.getItem('count_yasin') || '950';
    if (cTahlil) cTahlil.innerText = localStorage.getItem('count_tahlil') || '810';
}

// 11. OFFLINE/ONLINE DETECTION
window.addEventListener('offline', () => {
    const status = document.createElement('div');
    status.id = "offline-status";
    status.style = "position:fixed; top:0; width:100%; background:red; color:white; text-align:center; padding:10px; z-index:9999;";
    status.innerHTML = '<i class="fas fa-wifi-slash me-2"></i> Anda sedang Luar Talian (Offline)';
    document.body.prepend(status);
});

window.addEventListener('online', () => {
    const status = document.getElementById("offline-status");
    if (status) status.remove();
});

// 12. FUNGSI TAMBAHAN: UPDATE NOTIFICATION UI
function showUpdateNotification() {
    // Bina elemen banner secara dinamik
    const updateDiv = document.createElement('div');
    updateDiv.style = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#2c3e50; color:white; padding:15px 25px; border-radius:50px; box-shadow:0 10px 30px rgba(0,0,0,0.5); z-index:10000; display:flex; align-items:center; gap:15px; border:2px solid #f39c12;";
    updateDiv.className = "animate__animated animate__fadeInUp";
    updateDiv.innerHTML = `
        <span style="font-size:0.9rem;"><i class="fas fa-magic me-2"></i> Versi baru tersedia!</span>
        <button id="btn-update-now" style="background:#f39c12; border:none; color:white; padding:5px 15px; border-radius:20px; font-weight:bold; cursor:pointer;">KEMASKINI</button>
    `;
    document.body.appendChild(updateDiv);

    document.getElementById('btn-update-now').addEventListener('click', () => {
        window.location.reload();
    });
}