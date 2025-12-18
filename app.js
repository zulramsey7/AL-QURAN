/**
 * Fail: app.js
 * Kemaskini: Sistem Kehadiran, Kaunter Dinamik, dan PWA Handler
 */

// 1. PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// 2. Install Button & UI Elements
let deferredPrompt;
let installButton = document.getElementById('install-button');

// Cipta butang jika tiada dalam HTML
if (!installButton) {
    const heroSection = document.querySelector('.hero-section .container');
    if (heroSection) {
        installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.className = 'btn btn-light btn-lg shadow';
        installButton.innerHTML = '<i class="fas fa-download me-2"></i> Pasang Aplikasi';
        installButton.style.display = 'none';
        heroSection.appendChild(installButton);
    }
}

// 3. PWA Install Handler
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installButton) {
        installButton.style.display = 'inline-block';
    }
    
    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                installButton.style.display = 'none';
            });
        }
    });
});

window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed.');
    if (installButton) installButton.style.display = 'none';
});

// 4. Offline Detection
window.addEventListener('offline', () => {
    const offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator bg-danger text-white p-3 text-center position-fixed w-100';
    offlineIndicator.style.top = '0';
    offlineIndicator.style.left = '0';
    offlineIndicator.style.zIndex = '9999';
    offlineIndicator.innerHTML = '<i class="fas fa-wifi-slash me-2"></i> Anda sedang offline';
    document.body.appendChild(offlineIndicator);
    
    setTimeout(() => {
        if (offlineIndicator) offlineIndicator.remove();
    }, 3000);
});

window.addEventListener('online', () => {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) indicator.remove();
});

// 5. Notification Function
function showNotification(message) {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Aplikasi Islam', {
                body: message,
                icon: 'icon.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification(message);
                }
            });
        }
    }
}

// 6. Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 7. Pengurusan Data (Kehadiran & Kaunter)
function updateAppData() {
    // A. Logik Kehadiran Harian
    const today = new Date().toLocaleDateString();
    let lastVisit = localStorage.getItem('lastVisit');
    let attendance = parseInt(localStorage.getItem('attendanceCount') || '0');

    if (lastVisit !== today) {
        // Jika sudah 30 hari, reset ke 1, jika tidak tambah 1
        attendance = (attendance >= 30) ? 1 : attendance + 1;
        localStorage.setItem('attendanceCount', attendance);
        localStorage.setItem('lastVisit', today);
    }

    // Kemaskini Paparan di UI
    const attendanceText = document.getElementById('attendance-text');
    const attendanceBar = document.getElementById('attendance-bar');
    
    if (attendanceText && attendanceBar) {
        const progressPercent = (attendance / 30) * 100;
        attendanceText.innerText = `${attendance}/30 hari`;
        attendanceBar.style.width = `${progressPercent}%`;
    }

    // B. Logik Kaunter Klik (Dinamik)
    const counts = {
        'count-doa': localStorage.getItem('count_doa') || '1,234',
        'count-yasin': localStorage.getItem('count_yasin') || '987',
        'count-tahlil': localStorage.getItem('count_tahlil') || '856'
    };

    for (const [id, value] of Object.entries(counts)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }
}

// 8. Hover Effects & Click Tracking
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hover-scale'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover-scale'));
});

document.querySelectorAll('.feature-card a').forEach(link => {
    link.addEventListener('click', (e) => {
        const titleElement = link.closest('.card').querySelector('h3');
        if (titleElement) {
            const title = titleElement.textContent;
            
            // Simpan data klik ke localStorage berdasarkan fungsi
            if (title.includes('Doa')) incrementCounter('count_doa');
            if (title.includes('Yasin')) incrementCounter('count_yasin');
            if (title.includes('Tahlil')) incrementCounter('count_tahlil');

            showNotification(`Membuka ${title}`);
        }
    });
});

function incrementCounter(key) {
    let current = parseInt(localStorage.getItem(key) || '0');
    // Jika ia data awal yang besar (string), kita tukar ke nombor
    if (isNaN(current)) {
        current = key === 'count_doa' ? 1234 : key === 'count_yasin' ? 987 : 856;
    }
    localStorage.setItem(key, current + 1);
}

// 9. Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateAppData();

    if (window.matchMedia('(display-mode: standalone)').matches) {
        if (installButton) installButton.style.display = 'none';
    }
    
    setTimeout(() => {
        showNotification('Selamat datang di Aplikasi Islam!');
    }, 2000);
});