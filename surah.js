/**
 * Fail: surah.js
 * Deskripsi: Memaparkan detail surah dengan gaya visual "The Noor"
 * Font: Uthman-Taha | API: equran.id v2
 */

const urlParams = new URLSearchParams(window.location.search);
const noSurat = urlParams.get('no');
let currentAudio = null;

async function getSurahDetail() {
    // Kembali ke senarai surah jika parameter 'no' tiada
    if(!noSurat) { window.location.href = 'quran.html'; return; }

    const container = document.getElementById('verse-container');
    const loading = document.getElementById('loading-ayat');

    try {
        const response = await fetch(`https://equran.id/api/v2/surat/${noSurat}`);
        const result = await response.json();
        const data = result.data;

        // 1. KEMASKINI HEADER (Navigasi & Tajuk)
        if(document.getElementById('nav-surah-name')) 
            document.getElementById('nav-surah-name').innerText = data.namaLatin;
        
        if(document.getElementById('surah-name-ar')) 
            document.getElementById('surah-name-ar').innerText = data.nama;
        
        if(document.getElementById('surah-info')) 
            document.getElementById('surah-info').innerText = `${data.namaLatin} (${data.arti}) - ${data.jumlahAyat} Ayat`;
        
        // 2. SETUP AUDIO FULL (Main Player)
        const mainAudio = document.getElementById('main-audio');
        const audioSrc = document.getElementById('audio-src');
        if(mainAudio && audioSrc) {
            audioSrc.src = data.audioFull["05"]; // Qari Misyari Rasyid
            mainAudio.load();
        }

        // 3. JANA SENARAI AYAT
        if(!container) return;
        container.innerHTML = '';

        data.ayat.forEach((ayat, index) => {
            const teksArab = ayat.teksArab; 
            const teksLatin = ayat.teksLatin;
            const teksIndo = ayat.teksIndonesia;
            const noAyat = ayat.nomorAyat;
            const audioAyat = ayat.audio["05"];

            container.innerHTML += `
                <div class="card verse-card border-0 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.05}s">
                    <div class="card-body p-4">
                        <div class="d-flex">
                            <div class="me-3">
                                <div class="verse-number" style="background-color: #d81b60 !important; color: white; min-width: 32px; height: 32px; font-size: 0.75rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                    ${noAyat}
                                </div>
                            </div>
                            
                            <div class="flex-grow-1">
                                <div class="quran-text mb-3" style="font-family: 'Uthman-Taha', serif !important; font-size: 2.8rem !important; line-height: 2.2 !important; color: #ffffff !important; text-align: right; direction: rtl;">
                                    ${teksArab}
                                </div>
                                
                                <div class="text-latin mb-2" style="color: #cddc39 !important; font-size: 1.1rem; font-style: normal;">
                                    ${teksLatin}
                                </div>
                                
                                <div class="text-translation" style="color: #ffffff !important; font-size: 1rem; line-height: 1.6; opacity: 0.9;">
                                    ${teksIndo}
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-end align-items-center mt-3 pt-2">
                            <div class="audio-controls">
                                <button onclick="playAyat('${audioAyat}', this)" class="btn text-white p-0 me-4 play-btn" style="font-size: 1.2rem; background: none; border: none;">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button onclick="stopAyat()" class="btn text-danger p-0 me-4 d-none stop-btn" style="font-size: 1.2rem; background: none; border: none;">
                                    <i class="fas fa-stop"></i>
                                </button>
                            </div>
                            <i class="fas fa-ellipsis-h text-white opacity-50" style="font-size: 1.2rem; cursor: pointer;"></i>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Ralat memuatkan surah:", error);
        if(container) container.innerHTML = `<div class="alert alert-danger mx-3 mt-3">Gagal memuatkan ayat. Sila periksa sambungan internet.</div>`;
    } finally {
        if(loading) loading.classList.add('d-none');
    }
}

/**
 * Fungsi Mainkan Audio per Ayat
 */
function playAyat(url, btn) {
    stopAyat(); // Berhenti sebarang audio yang sedang dimainkan
    currentAudio = new Audio(url);
    currentAudio.play();

    // Tukar ikon butang
    const parent = btn.parentElement;
    const stopBtn = parent.querySelector('.stop-btn');
    
    if(stopBtn) {
        btn.classList.add('d-none');
        stopBtn.classList.remove('d-none');
    }

    currentAudio.onended = () => {
        stopAyat();
    };
}

/**
 * Fungsi Hentikan Audio
 */
function stopAyat() {
    if(currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    // Reset semua butang ke keadaan asal
    document.querySelectorAll('.stop-btn').forEach(b => b.classList.add('d-none'));
    document.querySelectorAll('.play-btn').forEach(b => b.classList.remove('d-none'));
}

// Jalankan fungsi setelah DOM siap dimuatkan
document.addEventListener('DOMContentLoaded', getSurahDetail);