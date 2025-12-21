/**
 * Fail: quran.js
 * Deskripsi: Menguruskan senarai 114 Surah dengan tema Emerald Peace
 */

let surahData = [];

async function getSurahList() {
    const loadingSpinner = document.getElementById('loading-quran');
    const surahContainer = document.getElementById('surah-container');
    const surahList = document.getElementById('surah-list');

    // --- FORCE CACHE REFRESH ---
    const cacheVersion = "v2.5"; // Versi Emerald
    if (localStorage.getItem('quran_version') !== cacheVersion) {
        localStorage.clear();
        localStorage.setItem('quran_version', cacheVersion);
    }

    const cachedSurah = localStorage.getItem('quran_surah_list');

    if (cachedSurah) {
        surahData = JSON.parse(cachedSurah);
        displaySurah(surahData);
        finalizeUI();
    } else {
        try {
            const response = await fetch('https://equran.id/api/v2/surat');
            const result = await response.json();
            
            if (result.data) {
                surahData = result.data;
                localStorage.setItem('quran_surah_list', JSON.stringify(surahData));
                displaySurah(surahData);
                finalizeUI();
            }
        } catch (error) {
            console.error("Ralat API:", error);
            if (loadingSpinner) {
                loadingSpinner.innerHTML = `<p class="text-danger small">Gagal memuatkan data. Sila periksa internet.</p>`;
            }
        }
    }

    function finalizeUI() {
        if (loadingSpinner) loadingSpinner.classList.add('d-none');
        if (surahContainer) surahContainer.classList.remove('d-none');
        if (surahList) surahList.classList.remove('d-none');
    }
}

function displaySurah(data) {
    const list = document.getElementById('surah-list');
    if (!list) return;
    list.innerHTML = '';

    if (data.length === 0) {
        document.getElementById('no-surah')?.classList.remove('d-none');
        return;
    } else {
        document.getElementById('no-surah')?.classList.add('d-none');
    }

    data.forEach((s, index) => {
        const place = s.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyyah';
        
        // Membina HTML yang sepadan dengan quran.css
        const cardHTML = `
            <div class="col-12 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.02}s">
                <a href="surah.html?no=${s.nomor}" class="surah-card">
                    <div class="surah-no">
                        <span>${s.nomor}</span>
                    </div>

                    <div class="surah-info">
                        <span class="surah-name-latin">${s.namaLatin}</span>
                        <div class="d-flex align-items-center">
                            <span class="type-badge">${place}</span>
                            <span class="surah-meta ms-2">• ${s.jumlahAyat} Ayat</span>
                        </div>
                    </div>

                    <div class="text-end">
                        <div class="arabic-name">${s.nama}</div>
                        <small class="text-muted" style="font-size: 0.65rem;">${s.arti}</small>
                    </div>
                </a>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', cardHTML);
    });
}

/**
 * Fungsi Carian Real-time
 */
const searchInput = document.getElementById('search-surah');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        const filtered = surahData.filter(s => 
            s.namaLatin.toLowerCase().includes(term) || 
            s.arti.toLowerCase().includes(term) ||
            s.nomor.toString() === term
        );
        
        displaySurah(filtered);
    });
}

// Jalankan fungsi apabila DOM sedia
document.addEventListener('DOMContentLoaded', getSurahList);