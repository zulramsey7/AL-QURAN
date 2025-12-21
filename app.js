/**
 * Fail: app.js (VERSI THE NOOR UI/UX)
 * Kemaskini: UI Notification & Refined Prayer Logic
 */

// 1. TEMA (DARK MODE)
(function() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    window.addEventListener('DOMContentLoaded', () => {
        const savedFontSize = localStorage.getItem('preferredFontSize');
        if (savedFontSize) {
            const contentElements = document.querySelectorAll('.arabic-text, .translation-text, #modalContent, .card-title-text, .lead, .card-text');
            contentElements.forEach(el => el.style.fontSize = savedFontSize);
        }
    });
})();

// 2. GLOBAL FONT ADJUSTER
function adjustFont(step) {
    const contentElements = document.querySelectorAll('.arabic-text, .translation-text, #modalContent, .card-title-text, .lead, .card-text');
    let finalSize;

    contentElements.forEach(el => {
        let currentSize = parseFloat(window.getComputedStyle(el, null).getPropertyValue('font-size'));
        let newSize = currentSize + (step * 2);
        if (newSize >= 12 && newSize <= 60) {
            el.style.fontSize = newSize + 'px';
            finalSize = newSize + 'px';
        }
    });

    if (finalSize) {
        localStorage.setItem('preferredFontSize', finalSize);
    }
}

// 3. TOGGLE DARK MODE
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 4. FUNGSI KONGSI
async function shareApp() {
    const shareData = {
        title: 'QuranDigital2025',
        text: 'Jom amalkan doa harian & Al-Quran dalam satu aplikasi gaya The Noor.',
        url: window.location.href,
    };

    if (navigator.share) {
        try { await navigator.share(shareData); } catch (err) {}
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Pautan disalin!");
    }
}

// 5. PWA SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => {
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification(newWorker);
                        }
                    });
                });
            });
    });

    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

// 6. PWA INSTALL HANDLER
let deferredPrompt;
const installBtn = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt = null;
            installBtn.style.display = 'none';
        }
    });
}

// 7. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    updateAttendance();
    updateCounters();
    updateHomePrayerStatus();
});

// 8. LOGIK KEHADIRAN (Matches New UI)
function updateAttendance() {
    const today = new Date().toLocaleDateString();
    let attendance = parseInt(localStorage.getItem('attendanceCount') || '0');
    let lastVisit = localStorage.getItem('lastVisit');

    if (lastVisit !== today) {
        attendance = (attendance >= 30) ? 1 : attendance + 1;
        localStorage.setItem('attendanceCount', attendance);
        localStorage.setItem('lastVisit', today);
    }

    const textEl = document.getElementById('attendance-text');
    const barEl = document.getElementById('attendance-bar');
    if (textEl && barEl) {
        textEl.innerText = `${attendance}/30`;
        barEl.style.width = `${(attendance / 30) * 100}%`;
    }
}

// 9. KEMASKINI KAUNTER
function updateCounters() {
    const counters = { 'count-doa': '1,240', 'count-yasin': '950', 'count-tahlil': '810' };
    for (let id in counters) {
        const el = document.getElementById(id);
        if (el) el.innerText = localStorage.getItem(id.replace('-', '_')) || counters[id];
    }
}

// 10. OFFLINE STATUS (The Noor Style - Gold/Dark)
function toggleOfflineStatus(isOffline) {
    let status = document.getElementById("offline-status");
    if (isOffline) {
        if (!status) {
            status = document.createElement('div');
            status.id = "offline-status";
            status.className = "animate__animated animate__fadeInDown";
            status.style = "position:fixed; top:70px; left:20px; right:20px; background:#c5a059; color:white; text-align:center; padding:8px; z-index:999; border-radius:12px; font-weight:600; font-size:0.8rem; box-shadow:0 4px 15px rgba(0,0,0,0.1);";
            status.innerHTML = '<i class="fas fa-wifi-slash me-2"></i> Mod Luar Talian Aktif';
            document.body.prepend(status);
        }
    } else {
        if (status) status.remove();
    }
}
window.addEventListener('offline', () => toggleOfflineStatus(true));
window.addEventListener('online', () => toggleOfflineStatus(false));

// 11. UPDATE NOTIFICATION (The Noor Style - Bottom Floating Card)
function showUpdateNotification(worker) {
    const updateDiv = document.createElement('div');
    updateDiv.className = "animate__animated animate__slideInUp";
    updateDiv.style = "position:fixed; bottom:100px; left:20px; right:20px; background:#1a1a1a; color:white; padding:20px; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:10000; border:1px solid #c5a059;";
    updateDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h6 class="mb-1 fw-bold" style="color:#c5a059">Versi Baru</h6>
                <p class="small mb-0 opacity-75">Kemas kini untuk ciri terbaru.</p>
            </div>
            <button id="btn-update-now" style="background:#c5a059; border:none; color:white; padding:8px 20px; border-radius:12px; font-weight:bold; font-size:0.8rem;">KEMASKINI</button>
        </div>
    `;
    document.body.appendChild(updateDiv);
    document.getElementById('btn-update-now').onclick = () => worker.postMessage({ action: 'skipWaiting' });
}

// 12. PRAYER STATUS (Updated for Next Time & Status Labels)
async function updateHomePrayerStatus() {
    const timeEl = document.getElementById('next-prayer-time');
    const statusEl = document.getElementById('current-prayer-status');
    if (!timeEl || !statusEl) return;

    try {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=11`);
            const data = await response.json();
            
            if (data.data) {
                const timings = data.data.timings;
                const now = new Date();
                const prayerOrder = [
                    { name: 'Subuh', time: timings.Fajr },
                    { name: 'Zohor', time: timings.Dhuhr },
                    { name: 'Asar', time: timings.Asr },
                    { name: 'Maghrib', time: timings.Maghrib },
                    { name: 'Isyak', time: timings.Isha }
                ];

                let next = prayerOrder.find(p => {
                    const [h, m] = p.time.split(':');
                    const pTime = new Date();
                    pTime.setHours(h, m, 0);
                    return pTime > now;
                }) || { name: 'Subuh', time: timings.Fajr };

                timeEl.innerText = next.time;
                statusEl.innerText = `Menuju ${next.name}`;
            }
        }, () => {
            statusEl.innerText = "Aktifkan Lokasi";
        });
    } catch (err) {
        statusEl.innerText = "Semak Jadual";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    
    // Semak jika pengguna sudah melihat splash screen dalam sesi ini
    if (sessionStorage.getItem('splashShown')) {
        // Jika sudah pernah keluar, hilangkan splash screen serta-merta tanpa animasi
        if (splash) {
            splash.style.display = 'none';
        }
    } else {
        // Jika ini kali pertama (pembukaan app), jalankan animasi seperti biasa
        if (splash) {
            setTimeout(() => {
                splash.classList.add('fade-out');
                
                // Set tanda dalam sessionStorage supaya ia tidak muncul lagi
                sessionStorage.setItem('splashShown', 'true');
                
                setTimeout(() => {
                    splash.style.display = 'none';
                }, 600);
            }, 2000); // Papar selama 2 saat
        }
    }
});