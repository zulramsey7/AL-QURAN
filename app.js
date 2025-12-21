/**
 * Fail: app.js (VERSI THE NOOR UI/UX - CLOCK & PRAYER UPDATED)
 * Kemaskini: Real-time Clock, Auto Location & Prayer Logic
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

// 2. JAM REAL-TIME & PENGESAN LOKASI (BARU)
function startLiveClock() {
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeDisplay = document.getElementById('current-time-display');
        if (timeDisplay) {
            timeDisplay.innerText = `${hours}:${minutes}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();
}

async function fetchUserCity(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.state_district || "Lokasi Dikesan";
        const locEl = document.getElementById('user-location');
        if (locEl) locEl.innerText = city;
    } catch (err) {
        console.log("Gagal mengesan nama bandar.");
    }
}

// 3. GLOBAL FONT ADJUSTER
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
    if (finalSize) localStorage.setItem('preferredFontSize', finalSize);
}

// 4. TOGGLE DARK MODE
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 5. FUNGSI KONGSI
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

// 6. PWA INSTALL LOGIC (VERSI BERSIH)
window.myAppPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.myAppPrompt = e;
    const banner = document.getElementById('install-banner');
    if (banner) banner.style.display = 'flex';
});

// Guna fungsi ini untuk klik butang
document.addEventListener('click', async (e) => {
    if (e.target && e.target.id === 'install-button') {
        if (window.myAppPrompt) {
            window.myAppPrompt.prompt();
            const { outcome } = await window.myAppPrompt.userChoice;
            if (outcome === 'accepted') {
                document.getElementById('install-banner').style.display = 'none';
            }
            window.myAppPrompt = null;
        }
    }
});

let deferredPrompt;
const installBtn = document.getElementById('install-button');
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'block';
});

// 7. INITIALIZATION (JAM & PRAYER DITAMBAH DI SINI)
document.addEventListener('DOMContentLoaded', () => {
    updateAttendance();
    updateCounters();
    startLiveClock(); // Jalankan Jam
    updateHomePrayerStatus(); // Jalankan API Solat & Lokasi
    
    // Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    if (sessionStorage.getItem('splashShown')) {
        if (splash) splash.style.display = 'none';
    } else {
        if (splash) {
            setTimeout(() => {
                splash.classList.add('fade-out');
                sessionStorage.setItem('splashShown', 'true');
                setTimeout(() => { splash.style.display = 'none'; }, 600);
            }, 2000);
        }
    }
});

// 8. LOGIK KEHADIRAN
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

// 10. OFFLINE STATUS & UPDATE NOTIFICATION
function toggleOfflineStatus(isOffline) {
    let status = document.getElementById("offline-status");
    if (isOffline) {
        if (!status) {
            status = document.createElement('div');
            status.id = "offline-status";
            status.style = "position:fixed; top:70px; left:20px; right:20px; background:#c5a059; color:white; text-align:center; padding:8px; z-index:999; border-radius:12px; font-weight:600; font-size:0.8rem;";
            status.innerHTML = '<i class="fas fa-wifi-slash me-2"></i> Mod Luar Talian Aktif';
            document.body.prepend(status);
        }
    } else if (status) status.remove();
}
window.addEventListener('offline', () => toggleOfflineStatus(true));
window.addEventListener('online', () => toggleOfflineStatus(false));

function showUpdateNotification(worker) {
    const updateDiv = document.createElement('div');
    updateDiv.style = "position:fixed; bottom:100px; left:20px; right:20px; background:#1a1a1a; color:white; padding:20px; border-radius:20px; z-index:10000; border:1px solid #c5a059;";
    updateDiv.innerHTML = `<div class="d-flex justify-content-between"><div><h6 style="color:#c5a059">Versi Baru</h6><p class="small mb-0">Kemas kini aplikasi.</p></div><button id="btn-update-now" style="background:#c5a059; border:none; color:white; padding:8px 20px; border-radius:12px;">KEMASKINI</button></div>`;
    document.body.appendChild(updateDiv);
    document.getElementById('btn-update-now').onclick = () => worker.postMessage({ action: 'skipWaiting' });
}

// 11. UPDATE PRAYER STATUS (REFINED WITH TIME TO AZAN)
async function updateHomePrayerStatus() {
    const nextPrayerEl = document.getElementById('next-prayer-name');
    const timeToAzanEl = document.getElementById('time-to-azan');
    const activeBadge = document.getElementById('active-prayer-name');
    
    if (!nextPrayerEl || !timeToAzanEl) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        // Dapatkan nama bandar
        fetchUserCity(lat, lon);

        try {
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=11`);
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

                // Kira baki masa
                const [nh, nm] = next.time.split(':');
                const target = new Date();
                target.setHours(nh, nm, 0);
                if (target < now) target.setDate(target.getDate() + 1);
                
                const diffMs = target - now;
                const diffHrs = Math.floor(diffMs / 3600000);
                const diffMins = Math.floor((diffMs % 3600000) / 60000);

                nextPrayerEl.innerText = next.name;
                timeToAzanEl.innerText = `${diffHrs}j ${diffMins}m`;
                if(activeBadge) activeBadge.innerText = next.name;
            }
        } catch (err) {
            timeToAzanEl.innerText = "Error API";
        }
    }, () => {
        if(timeToAzanEl) timeToAzanEl.innerText = "Sila aktif GPS";
    });
}
