/**
 * Fail: doa.js
 * Deskripsi: Menguruskan data Doa Harian dengan fungsi carian masa-nyata & Cache Offline
 * Penyelarasan: Emerald Unified Style 2025
 */

let allDoa = [];

async function loadDoa() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const doaContent = document.getElementById('doa-content');

    // 1. Semak LocalStorage (Pantas untuk pengguna berulang)
    const cachedDoa = localStorage.getItem('doa_harian_data');

    if (cachedDoa) {
        allDoa = JSON.parse(cachedDoa);
        displayDoa(allDoa);
        finalizeUI();
        
        // Cuba kemaskini data di latar belakang
        updateDataInBackground();
    } else {
        await fetchFreshData();
    }

    function finalizeUI() {
        if (loadingSpinner) loadingSpinner.classList.add('d-none');
        if (doaContent) {
            doaContent.classList.remove('d-none');
            doaContent.classList.add('animate__animated', 'animate__fadeIn');
        }
    }
}

// Fungsi ambil data dari API
async function fetchFreshData() {
    try {
        const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian');
        const result = await response.json();
        
        allDoa = result.data || result;

        // Simpan untuk kegunaan offline
        localStorage.setItem('doa_harian_data', JSON.stringify(allDoa));
        displayDoa(allDoa);
        
        const loadingSpinner = document.getElementById('loading-spinner');
        const doaContent = document.getElementById('doa-content');
        if (loadingSpinner) loadingSpinner.classList.add('d-none');
        if (doaContent) doaContent.classList.remove('d-none');

    } catch (error) {
        console.error("Ralat API Doa:", error);
        showErrorUI();
    }
}

// Fungsi kemaskini senyap (Background Update)
async function updateDataInBackground() {
    try {
        const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian');
        const result = await response.json();
        const newData = result.data || result;
        
        if (JSON.stringify(newData) !== JSON.stringify(allDoa)) {
            allDoa = newData;
            localStorage.setItem('doa_harian_data', JSON.stringify(allDoa));
            console.log("Data doa telah dikemaskini di latar belakang.");
        }
    } catch (e) { /* Abaikan ralat latar belakang */ }
}

/**
 * Memaparkan senarai doa ke dalam grid
 */
function displayDoa(data) {
    const list = document.getElementById('doa-list');
    const noResults = document.getElementById('no-results');
    
    if (!list) return;
    list.innerHTML = '';

    if (!data || data.length === 0) {
        if (noResults) noResults.classList.remove('d-none');
        return;
    } else {
        if (noResults) noResults.classList.add('d-none');
    }

    const fragment = document.createDocumentFragment();

    data.forEach((doa, index) => {
        const col = document.createElement('div');
        col.className = `col-12 col-md-6 col-lg-4 animate__animated animate__fadeInUp`;
        col.style.animationDelay = `${Math.min(index * 0.05, 1)}s`;

        col.innerHTML = `
            <div class="doa-card h-100">
                <span class="type-badge">Doa Harian</span>
                <h5 class="doa-title-latin">${doa.title}</h5>
                
                <div class="arabic-text">
                    ${doa.arabic}
                </div>
                
                <div class="latin-text">
                    ${doa.latin}
                </div>
                
                <div class="translation-text mt-auto">
                    <strong class="d-block mb-1 text-success small" style="font-size: 0.7rem; letter-spacing: 0.5px;">MAKSUD:</strong>
                    ${doa.translation}
                </div>
            </div>
        `;
        fragment.appendChild(col);
    });

    list.appendChild(fragment);
}

/**
 * Logik Fungsi Carian Masa-Nyata (Debounced)
 */
let searchTimeout;
const searchInput = document.getElementById('search-doa');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const keyword = e.target.value.toLowerCase().trim();

        searchTimeout = setTimeout(() => {
            const filtered = allDoa.filter(doa => 
                doa.title.toLowerCase().includes(keyword) || 
                doa.translation.toLowerCase().includes(keyword)
            );
            displayDoa(filtered);
        }, 300);
    });
}

function showErrorUI() {
    const doaList = document.getElementById('doa-list');
    if (!doaList) return;
    
    doaList.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="card border-0 shadow-sm rounded-4 p-5 bg-white">
                <i class="fas fa-wifi-slash mb-3 fa-3x text-warning opacity-50"></i>
                <h6 class="fw-bold">Sambungan Gagal</h6>
                <p class="small text-muted">Data tidak dapat dimuatkan. Sila semak internet anda.</p>
                <div class="d-flex justify-content-center gap-2 mt-3">
                    <button onclick="location.reload()" class="btn btn-success rounded-pill px-4 shadow-sm">Cuba Lagi</button>
                </div>
            </div>
        </div>`;
}

// Jalankan fungsi utama
document.addEventListener('DOMContentLoaded', loadDoa);