/**
 * Fail: yasin.js
 * Deskripsi: Menguruskan pengambilan data Surah Yasin (36) dari API equran.id v2
 */

// Pembolehubah global untuk mengawal audio
let currentAyatAudio = null;
let currentActiveButton = null;

/**
 * Fungsi utama untuk memuatkan data Surah Yasin
 */
async function loadYasin() {
    const yasinContainer = document.getElementById('verses-list');
    const loadingSpinner = document.getElementById('loading-spinner');
    const contentDiv = document.getElementById('yasin-content');
    const fullAudio = document.getElementById('full-audio');
    const audioSource = document.getElementById('audio-source');

    // 1. SEMAK DATA DALAM STORAN (OFFLINE FIRST)
    const cachedData = localStorage.getItem('surah_yasin_36');

    if (cachedData) {
        console.log("Memuatkan Surah Yasin dari cache...");
        const data = JSON.parse(cachedData);
        displayData(data);
    } else {
        console.log("Mengambil data Yasin baru dari API...");
        try {
            // Menggunakan API v2 equran.id (Surah 36: Yasin)
            const response = await fetch('https://equran.id/api/v2/surat/36');
            if (!response.ok) throw new Error('Respon API gagal');
            
            const result = await response.json();
            const data = result.data;
            
            // Simpan ke LocalStorage untuk kegunaan offline
            localStorage.setItem('surah_yasin_36', JSON.stringify(data));
            displayData(data);
        } catch (error) {
            console.error("Ralat:", error);
            yasinContainer.innerHTML = `
                <div class="alert alert-danger text-center shadow-sm border-0 rounded-4 p-4 animate__animated animate__shakeX">
                    <i class="fas fa-wifi-slash mb-3 fa-3x"></i><br>
                    <h5 class="fw-bold">Sambungan Gagal</h5>
                    <p class="small mb-0">Sila pastikan internet anda aktif untuk muat turun pertama kali.</p>
                    <button onclick="location.reload()" class="btn btn-sm btn-danger mt-3 rounded-pill px-4">Cuba Lagi</button>
                </div>`;
            loadingSpinner.classList.add('d-none');
        }
    }

    function displayData(data) {
        // Set audio penuh (Guna audio dari Mishary Rashid - ID 05)
        if (data.audioFull && data.audioFull["05"]) {
            audioSource.src = data.audioFull["05"];
            fullAudio.load();
        }

        // Hentikan sebarang audio ayat jika audio penuh dimainkan
        fullAudio.onplay = () => stopAnyCurrentAyat();

        yasinContainer.innerHTML = '';
        
        // Loop setiap ayat
        data.ayat.forEach((item, index) => {
            const verseHTML = `
                <div class="card verse-card border-0 animate__animated animate__fadeInUp" id="verse-${item.nomorAyat}" style="animation-delay: ${index * 0.05}s">
                    <div class="card-body p-4 p-md-5">
                        <div class="d-flex justify-content-between align-items-start mb-4">
                            <div class="verse-number shadow-sm">${item.nomorAyat}</div>
                            <p class="arabic-text text-end mb-0 w-100">
                                ${item.teksArab}
                            </p>
                        </div>
                        <div class="ps-md-5">
                            <p class="latin-text small mb-2">${item.teksLatin}</p>
                            <div class="translation-box">
                                <p class="meaning-text mb-4">
                                    ${item.teksIndonesia}
                                </p>
                            </div>
                            
                            <button class="btn btn-sm btn-outline-success rounded-pill px-4 shadow-sm fw-bold play-btn" 
                                    onclick="handleAyatAudio('${item.audio['05']}', this, ${item.nomorAyat})">
                                <i class="fas fa-play me-2"></i> Dengar Ayat
                            </button>
                        </div>
                    </div>
                </div>
            `;
            yasinContainer.innerHTML += verseHTML;
        });

        loadingSpinner.classList.add('d-none');
        contentDiv.classList.remove('d-none');
    }
}

/**
 * Mengendalikan audio bagi setiap ayat & highlight
 */
function handleAyatAudio(url, btn, verseId) {
    const fullAudio = document.getElementById('full-audio');
    const currentCard = document.getElementById(`verse-${verseId}`);

    if (currentActiveButton === btn && currentAyatAudio) {
        stopAnyCurrentAyat();
        return;
    }

    stopAnyCurrentAyat();

    if (!fullAudio.paused) {
        fullAudio.pause();
    }

    currentActiveButton = btn;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Memuatkan...';
    btn.classList.replace('btn-outline-success', 'btn-warning');
    
    // Highlight Kad
    currentCard.style.backgroundColor = "#f0fff4";
    currentCard.style.borderLeft = "5px solid #27ae60"; 
    currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    currentAyatAudio = new Audio(url);
    
    currentAyatAudio.onplaying = () => {
        btn.innerHTML = '<i class="fas fa-stop me-2"></i> Berhenti';
        btn.classList.replace('btn-warning', 'btn-danger');
    };

    currentAyatAudio.play().catch(e => {
        console.error("Audio play error:", e);
        resetButton(btn);
        removeHighlight(currentCard);
    });

    currentAyatAudio.onended = () => {
        resetButton(btn);
        removeHighlight(currentCard);
        currentAyatAudio = null;
        currentActiveButton = null;
    };

    currentAyatAudio.onerror = () => {
        resetButton(btn);
        removeHighlight(currentCard);
        alert("Gagal memuatkan audio ayat.");
    };
}

function stopAnyCurrentAyat() {
    if (currentAyatAudio) {
        currentAyatAudio.pause();
        currentAyatAudio = null;
    }
    document.querySelectorAll('.verse-card').forEach(card => removeHighlight(card));
    
    if (currentActiveButton) {
        resetButton(currentActiveButton);
        currentActiveButton = null;
    }
}

function removeHighlight(card) {
    card.style.backgroundColor = "#ffffff";
    card.style.borderLeft = "none";
}

function resetButton(btn) {
    btn.innerHTML = '<i class="fas fa-play me-2"></i> Dengar Ayat';
    btn.className = 'btn btn-sm btn-outline-success rounded-pill px-4 shadow-sm fw-bold play-btn';
}

// Jalankan fungsi apabila DOM sedia
document.addEventListener('DOMContentLoaded', loadYasin);