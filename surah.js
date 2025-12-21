/**
 * Fail: surah.js
 * Deskripsi: Memaparkan detail surah menggunakan font Uthman-Taha & API v2
 */

const urlParams = new URLSearchParams(window.location.search);
const noSurat = urlParams.get('no');
let currentAudio = null;

async function getSurahDetail() {
    if(!noSurat) { window.location.href = 'quran.html'; return; }

    try {
        const response = await fetch(`https://equran.id/api/v2/surat/${noSurat}`);
        const result = await response.json();
        const data = result.data;

        // Update Header
        if(document.getElementById('nav-surah-name')) 
            document.getElementById('nav-surah-name').innerText = data.namaLatin;
        
        if(document.getElementById('surah-name-ar')) 
            document.getElementById('surah-name-ar').innerText = data.nama;
        
        if(document.getElementById('surah-info')) 
            document.getElementById('surah-info').innerText = `${data.namaLatin} (${data.arti}) - ${data.jumlahAyat} Ayat`;
        
        // Setup Full Audio
        const mainAudio = document.getElementById('main-audio');
        const audioSrc = document.getElementById('audio-src');
        if(mainAudio && audioSrc) {
            audioSrc.src = data.audioFull["05"]; // Qari Misyari Rasyid
            mainAudio.load();
        }

        const container = document.getElementById('verse-container');
        if(!container) return;
        container.innerHTML = '';

        data.ayat.forEach(ayat => {
            // PEMBETULAN: Guna teksArab (bukan .ar) untuk elak undefined
            const teksArab = ayat.teksArab; 
            const teksLatin = ayat.teksLatin;
            const teksIndo = ayat.teksIndonesia;
            const noAyat = ayat.nomorAyat;
            const audioAyat = ayat.audio["05"];

            container.innerHTML += `
                <div class="card verse-card border-0 shadow-sm animate__animated animate__fadeInUp mb-3">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="verse-number" style="background: #198754; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                ${noAyat}
                            </div>
                            <div class="audio-controls">
                                <button onclick="playAyat('${audioAyat}', this)" class="btn btn-outline-success btn-sm rounded-pill me-2 play-btn">
                                    <i class="fas fa-play me-1"></i> Dengar
                                </button>
                                <button onclick="stopAyat()" class="btn btn-outline-danger btn-sm rounded-pill d-none stop-btn">
                                    <i class="fas fa-stop"></i> Berhenti
                                </button>
                            </div>
                        </div>
                        
                        <p class="quran-text text-end mb-4" style="font-family: 'Uthman-Taha', serif !important; font-size: 3.5rem !important; line-height: 2.8 !important; font-weight: 500;">
    ${teksArab}
</p>
                        
                        <p class="text-success small fw-bold mb-1">${teksLatin}</p>
                        <hr class="opacity-10">
                        <p class="text-muted mb-0 small" style="line-height: 1.6;">${teksIndo}</p>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Ralat:", error);
        alert("Gagal memuatkan surah. Sila cuba lagi.");
    }
}

function playAyat(url, btn) {
    stopAyat();
    currentAudio = new Audio(url);
    currentAudio.play();

    // Sembunyikan semua butang play, tunjuk butang stop pada yang diklik sahaja
    const stopBtn = btn.parentElement.querySelector('.stop-btn');
    stopBtn.classList.remove('d-none');
    btn.classList.add('d-none');

    currentAudio.onended = () => {
        stopBtn.classList.add('d-none');
        btn.classList.remove('d-none');
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

document.addEventListener('DOMContentLoaded', getSurahDetail);