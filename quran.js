/**
 * Fail: quran.js
 * Deskripsi: Menguruskan senarai 114 Surah menggunakan API Al-Quran Cloud (Global)
 * Gaya: Unified Tahlil/Yasin Style
 */

let surahData = [];

async function getSurahList() {
    const loadingSpinner = document.getElementById('loading-quran');
    const surahContainer = document.getElementById('surah-container');
    const surahList = document.getElementById('surah-list');

    // Versi Cache untuk prestasi laju
    const cacheVersion = "v4.0"; 
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
            // Menggunakan API Global yang lebih stabil
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const result = await response.json();
            
            if (result.code === 200) {
                // Map data API Cloud ke format yang kita mahukan
                surahData = result.data.map(s => ({
                    nomor: s.number,
                    namaLatin: s.englishName,
                    nama: s.name,
                    jumlahAyat: s.numberOfAyahs,
                    tempatTurun: s.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah',
                    arti: s.englishNameTranslation // Terjemahan Nama Surah (English/Global)
                }));

                localStorage.setItem('quran_surah_list', JSON.stringify(surahData));
                displaySurah(surahData);
                finalizeUI();
            }
        } catch (error) {
            console.error("Ralat API Global:", error);
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
        // Bina HTML Card
        const cardHTML = `
            <div class="col-12 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.01}s">
                <a href="surah.html?no=${s.nomor}" class="surah-card text-decoration-none">
                    <div class="surah-no">
                        <span>${s.nomor}</span>
                    </div>

                    <div class="surah-info">
                        <span class="surah-name-latin fw-bold">${s.namaLatin}</span>
                        <span class="surah-subtitle text-uppercase">${s.tempatTurun} • ${s.jumlahAyat} AYAT</span>
                    </div>

                    <div class="text-end">
                        <div class="surah-name-arabic" style="font-family: 'Amiri', serif; font-size: 1.4rem;">${s.nama}</div>
                        <small class="text-muted d-block" style="font-size: 0.7rem;">${s.arti}</small>
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

document.addEventListener('DOMContentLoaded', getSurahList);