/**
 * Fail: quran.js
 * Deskripsi: Menguruskan senarai 114 Surah dengan gaya Unified Tahlil/Yasin
 */

let surahData = [];

async function getSurahList() {
    const loadingSpinner = document.getElementById('loading-quran');
    const surahContainer = document.getElementById('surah-container');
    const surahList = document.getElementById('surah-list');

    // Versi Cache untuk memastikan data sentiasa segar
    const cacheVersion = "v3.0"; 
    if (localStorage.getItem('quran_version') !== cacheVersion) {
        localStorage.removeItem('quran_surah_list');
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
        if (surahContainer) {
            surahContainer.classList.remove('d-none');
            surahContainer.classList.add('animate__animated', 'animate__fadeIn');
        }
    }
}

function displaySurah(data) {
    const list = document.getElementById('surah-list');
    if (!list) return;
    list.innerHTML = '';

    const noSurahEl = document.getElementById('no-surah');

    if (data.length === 0) {
        noSurahEl?.classList.remove('d-none');
        return;
    } else {
        noSurahEl?.classList.add('d-none');
    }

    data.forEach((s, index) => {
        const place = s.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyyah';
        
        // Membina HTML yang sepadan dengan gaya Tahlil/Yasin
        const cardHTML = `
            <div class="col-12 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.01}s">
                <a href="surah.html?no=${s.nomor}" class="surah-card">
                    <div class="surah-no">
                        <span>${s.nomor}</span>
                    </div>

                    <div class="surah-info">
                        <span class="surah-name-latin">${s.namaLatin}</span>
                        <span class="surah-subtitle">${place} • ${s.jumlahAyat} AYAT</span>
                    </div>

                    <div class="text-end">
                        <div class="surah-name-arabic">${s.nama}</div>
                        <small class="text-muted" style="font-size: 0.65rem; display: block; margin-top: -5px;">${s.arti}</small>
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

// Jalankan apabila halaman dibuka
document.addEventListener('DOMContentLoaded', getSurahList);