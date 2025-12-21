/**
 * Fail: surah.js
 * Deskripsi: Memaparkan ayat surah dengan tema Emerald Peace & Font Uthman-Taha
 */

const urlParams = new URLSearchParams(window.location.search);
const noSurat = urlParams.get('no');
let currentAudio = null;

async function getSurahDetail() {
    const loadingVerses = document.getElementById('loading-verses');
    const container = document.getElementById('verse-container');
    
    if(!noSurat) { 
        window.location.href = 'quran.html'; 
        return; 
    }

    try {
        const response = await fetch(`https://equran.id/api/v2/surat/${noSurat}`);
        const result = await response.json();
        const data = result.data;

        // 1. Update Navigation & Header
        document.getElementById('nav-surah-name').innerText = data.namaLatin;
        document.getElementById('surah-name-ar').innerText = data.nama;
        document.getElementById('surah-info').innerText = `${data.namaLatin} • ${data.arti} • ${data.jumlahAyat} Ayat`;

        // 2. Setup Full Audio (Misyari Rasyid)
        const mainAudio = document.getElementById('main-audio');
        const audioSrc = document.getElementById('audio-src');
        if(mainAudio && audioSrc) {
            audioSrc.src = data.audioFull["05"]; 
            mainAudio.load();
        }

        if(!container) return;
        container.innerHTML = '';

        // 3. Tambah Bismillah (Kecuali Al-Fatihah & At-Tawbah)
        if (noSurat != 1 && noSurat != 9) {
            container.innerHTML += `
                <div class="text-center mb-5 mt-2 animate__animated animate__fadeIn">
                    <h2 class="arabic-text" style="font-family: 'Uthman-Taha', serif; font-size: 2.2rem; color: var(--tn-green-dark);">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
                </div>
            `;
        }

        // 4. Papar Ayat-ayat
        data.ayat.forEach((ayat, index) => {
            const noAyat = ayat.nomorAyat;
            const teksArab = ayat.teksArab;
            const teksLatin = ayat.teksLatin;
            const teksIndo = ayat.teksIndonesia;
            const audioAyat = ayat.audio["05"];

            const verseHTML = `
                <div class="verse-card animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.05}s">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="verse-no">
                            ${noAyat}
                        </div>
                        <div class="audio-controls">
                            <button onclick="playAyat('${audioAyat}', this)" class="btn btn-link text-success p-0 play-btn" title="Dengar Ayat">
                                <i class="fas fa-play-circle fa-lg"></i>
                            </button>
                            <button onclick="stopAyat()" class="btn btn-link text-danger p-0 stop-btn d-none" title="Berhenti">
                                <i class="fas fa-stop-circle fa-lg"></i>
                            </button>
                        </div>
                    </div>
                    
                    <p class="arabic-text text-end mb-3" style="font-family: 'Uthman-Taha', serif !important; font-size: 2.2rem; line-height: 2.5; color: var(--tn-green-dark);">
                        ${teksArab}
                    </p>
                    
                    <p class="text-success fw-semibold mb-2" style="font-size: 0.8rem; line-height: 1.4;">${teksLatin}</p>
                    <p class="text-muted mb-0" style="font-size: 0.85rem; line-height: 1.5; border-left: 2px solid #eee; padding-left: 10px;">${teksIndo}</p>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', verseHTML);
        });

        // 5. Sembunyikan Loading
        if (loadingVerses) loadingVerses.classList.add('d-none');

    } catch (error) {
        console.error("Ralat:", error);
        if (loadingVerses) {
            loadingVerses.innerHTML = `<p class="text-danger small">Gagal memuatkan ayat. Sila periksa sambungan internet.</p>`;
        }
    }
}

/**
 * Fungsi Main Audio Control (Play/Pause Utama)
 */
function playAyat(url, btn) {
    stopAyat(); // Berhenti audio lain jika sedang dimainkan
    currentAudio = new Audio(url);
    currentAudio.play();

    const container = btn.parentElement;
    const stopBtn = container.querySelector('.stop-btn');
    
    btn.classList.add('d-none');
    stopBtn.classList.remove('d-none');

    currentAudio.onended = () => {
        btn.classList.remove('d-none');
        stopBtn.classList.add('d-none');
    };
}

function stopAyat() {
    if(currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    document.querySelectorAll('.stop-btn').forEach(b => b.classList.add('d-none'));
    document.querySelectorAll('.play-btn').forEach(b => b.classList.remove('d-none'));
}

// Jalankan fungsi apabila DOM sedia
document.addEventListener('DOMContentLoaded', getSurahDetail);