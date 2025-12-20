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
        document.getElementById('nav-surah-name').innerText = data.namaLatin;
        document.getElementById('surah-name-ar').innerText = data.nama;
        document.getElementById('surah-info').innerText = `${data.namaLatin} (${data.arti}) - ${data.jumlahAyat} Ayat`;
        
        // Setup Full Audio
        const mainAudio = document.getElementById('main-audio');
        document.getElementById('audio-src').src = data.audioFull["05"]; // Qari Misyari Rasyid
        mainAudio.load();

        const container = document.getElementById('verse-container');
        container.innerHTML = '';

        data.ayat.forEach(ayat => {
            container.innerHTML += `
                <div class="card verse-card border-0 shadow-sm animate__animated animate__fadeInUp mb-3">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="verse-number">${ayat.nomorAyat}</div>
                            <div class="audio-controls">
                                <button onclick="playAyat('${ayat.audio["05"]}', this)" class="btn btn-outline-success btn-sm rounded-pill me-2">
                                    <i class="fas fa-play me-1"></i> Dengar
                                </button>
                                <button onclick="stopAyat()" class="btn btn-outline-danger btn-sm rounded-pill d-none stop-btn">
                                    <i class="fas fa-stop"></i>
                                </button>
                            </div>
                        </div>
                        
                        <p class="quran-text text-end mb-4">${ayat.ar}</p>
                        
                        <p class="text-success small fw-bold">${ayat.teksLatin}</p>
                        <hr>
                        <p class="text-muted mb-0 small">${ayat.teksIndonesia}</p>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Gagal memuatkan surah.");
    }
}

function playAyat(url, btn) {
    stopAyat();
    currentAudio = new Audio(url);
    currentAudio.play();

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
        document.querySelectorAll('.stop-btn').forEach(b => b.classList.add('d-none'));
        document.querySelectorAll('.btn-outline-success').forEach(b => b.classList.remove('d-none'));
    }
}

document.addEventListener('DOMContentLoaded', getSurahDetail);
