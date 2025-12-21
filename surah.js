/**
 * Fail: surah.js
 * Deskripsi: Memaparkan detail surah dengan saiz standard handphone
 * Font: Uthman-Taha | API: equran.id v2
 */

const urlParams = new URLSearchParams(window.location.search);
const noSurat = urlParams.get('no');
let currentAudio = null;

async function getSurahDetail() {
    // Kembali ke senarai jika no surah tiada
    if(!noSurat) { 
        window.location.href = 'quran.html'; 
        return; 
    }

    const container = document.getElementById('verse-container');
    const loading = document.getElementById('loading-ayat');

    try {
        const response = await fetch(`https://equran.id/api/v2/surat/${noSurat}`);
        const result = await response.json();
        const data = result.data;

        // 1. KEMASKINI HEADER SURAH
        if(document.getElementById('nav-surah-name')) 
            document.getElementById('nav-surah-name').innerText = data.namaLatin;
        
        if(document.getElementById('surah-name-ar')) 
            document.getElementById('surah-name-ar').innerText = data.nama;
        
        if(document.getElementById('surah-info')) 
            document.getElementById('surah-info').innerText = `${data.namaLatin} (${data.arti}) - ${data.jumlahAyat} Ayat`;
        
        // 2. SETUP AUDIO PENUH
        const mainAudio = document.getElementById('main-audio');
        const audioSrc = document.getElementById('audio-src');
        if(mainAudio && audioSrc) {
            audioSrc.src = data.audioFull["05"]; 
            mainAudio.load();
        }

        // 3. JANA SENARAI AYAT
        if(!container) return;
        container.innerHTML = '';

        data.ayat.forEach((ayat, index) => {
            container.innerHTML += `
                <div class="card verse-card border-0 animate__animated animate__fadeInUp" style="background-color: #383f45 !important; border-bottom: 1px solid #4a545c !important; border-radius: 0; margin-bottom: 0;">
                    <div class="card-body p-3">
                        <div class="d-flex">
                            <div class="me-3">
                                <div class="verse-number" style="background-color: #d81b60 !important; color: white; min-width: 28px; height: 28px; font-size: 0.7rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                    ${ayat.nomorAyat}
                                </div>
                            </div>
                            
                            <div class="flex-grow-1">
                                <div class="quran-text mb-2" style="font-family: 'Uthman-Taha', serif !important; font-size: 2.0rem !important; line-height: 1.8 !important; color: #ffffff !important; text-align: right; direction: rtl; font-weight: normal;">
                                    ${ayat.teksArab}
                                </div>
                                
                                <div class="text-latin mb-1" style="color: #cddc39 !important; font-size: 0.95rem; font-weight: 400; font-family: 'Roboto', sans-serif;">
                                    ${ayat.teksLatin}
                                </div>
                                
                                <div class="text-translation" style="color: #ffffff !important; font-size: 0.9rem; line-height: 1.5; opacity: 0.85; font-family: 'Roboto', sans-serif;">
                                    ${ayat.teksIndonesia}
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-end align-items-center mt-3">
                            <div class="audio-controls">
                                <button onclick="playAyat('${ayat.audio["05"]}', this)" class="btn text-white p-0 me-4 play-btn" style="font-size: 1.1rem; background: none; border: none; outline: none;">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button onclick="stopAyat()" class="btn text-danger p-0 me-4 d-none stop-btn" style="font-size: 1.1rem; background: none; border: none; outline: none;">
                                    <i class="fas fa-stop"></i>
                                </button>
                            </div>
                            <i class="fas fa-ellipsis-h text-white opacity-40" style="font-size: 1.1rem; cursor: pointer;"></i>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Ralat memuatkan data:", error);
        if(container) container.innerHTML = `<div class="text-center p-5 text-white">Gagal memuatkan ayat. Sila periksa internet anda.</div>`;
    } finally {
        if(loading) loading.classList.add('d-none');
    }
}

/**
 * Fungsi Mainkan Audio Ayat
 */
function playAyat(url, btn) {
    stopAyat(); // Berhenti audio sebelumnya
    currentAudio = new Audio(url);
    currentAudio.play();

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
 * Fungsi Berhenti Audio
 */
function stopAyat() {
    if(currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    // Set semula semua butang
    document.querySelectorAll('.stop-btn').forEach(b => b.classList.add('d-none'));
    document.querySelectorAll('.play-btn').forEach(b => b.classList.remove('d-none'));
}

// Jalankan fungsi apabila halaman dimuatkan
document.addEventListener('DOMContentLoaded', getSurahDetail);