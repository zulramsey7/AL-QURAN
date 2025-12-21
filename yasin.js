/**
 * Fail: yasin.js
 * Deskripsi: Menguruskan data Surah Yasin (Guna 100% gaya tahlil.css)
 */

let currentAyatAudio = null;
let currentActiveButton = null;
let currentFontSize = 2.2; 

async function loadYasin() {
    const yasinContainer = document.getElementById('verses-list');
    const loader = document.getElementById('loader');
    const contentDiv = document.getElementById('yasin-content');
    const fullAudio = document.getElementById('full-audio');

    // Semak Cache (Offline First)
    const cachedData = localStorage.getItem('surah_yasin_36');

    if (cachedData) {
        displayData(JSON.parse(cachedData));
    } else {
        try {
            const response = await fetch('https://equran.id/api/v2/surat/36');
            if (!response.ok) throw new Error('Respon API gagal');
            
            const result = await response.json();
            const data = result.data;
            localStorage.setItem('surah_yasin_36', JSON.stringify(data));
            displayData(data);
        } catch (error) {
            console.error("Ralat:", error);
            yasinContainer.innerHTML = `
                <div class="text-center p-4">
                    <p class="small text-muted">Gagal memuatkan data. Sila periksa internet anda.</p>
                    <button onclick="location.reload()" class="btn btn-sm btn-success rounded-pill px-4">Cuba Lagi</button>
                </div>`;
            if(loader) loader.classList.add('d-none');
        }
    }

    function displayData(data) {
        // Set audio penuh
        if (data.audioFull && data.audioFull["05"]) {
            fullAudio.querySelector('source').src = data.audioFull["05"];
            fullAudio.load();
        }

        fullAudio.onplay = () => stopAnyCurrentAyat();

        yasinContainer.innerHTML = '';
        
        data.ayat.forEach((item) => {
            const verseHTML = `
                <div class="tahlil-item animate__animated animate__fadeInUp" id="verse-${item.nomorAyat}">
                    <div class="tahlil-badge">AYAT ${item.nomorAyat}</div>
                    
                    <div class="arabic-text" style="font-size: ${currentFontSize}rem;">
                        ${item.teksArab}
                    </div>
                    
                    <div class="latin-text">
                        ${item.teksLatin}
                    </div>
                    
                    <div class="translation-text">
                        ${item.teksIndonesia}
                    </div>
                    
                    <div class="mt-3">
                        <button class="btn btn-sm btn-outline-success rounded-pill px-3 play-btn" 
                                onclick="handleAyatAudio('${item.audio['05']}', this, ${item.nomorAyat})">
                            <i class="fas fa-play me-1"></i> Dengar
                        </button>
                    </div>
                </div>
            `;
            yasinContainer.innerHTML += verseHTML;
        });

        if(loader) loader.classList.add('d-none');
        if(contentDiv) contentDiv.classList.remove('d-none');
    }
}

/**
 * Mengendalikan audio bagi setiap ayat
 */
function handleAyatAudio(url, btn, verseId) {
    const fullAudio = document.getElementById('full-audio');
    const currentCard = document.getElementById(`verse-${verseId}`);

    if (currentActiveButton === btn && currentAyatAudio) {
        stopAnyCurrentAyat();
        return;
    }

    stopAnyCurrentAyat();
    if (!fullAudio.paused) fullAudio.pause();

    currentActiveButton = btn;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Highlight Card
    currentCard.style.borderLeft = "4px solid #d4a373"; 
    currentCard.style.backgroundColor = "#fdfbf7";

    currentAyatAudio = new Audio(url);
    currentAyatAudio.onplaying = () => {
        btn.innerHTML = '<i class="fas fa-stop me-1"></i> Berhenti';
        btn.classList.replace('btn-outline-success', 'btn-danger');
    };

    currentAyatAudio.play().catch(e => stopAnyCurrentAyat());

    currentAyatAudio.onended = () => {
        stopAnyCurrentAyat();
    };
}

function stopAnyCurrentAyat() {
    if (currentAyatAudio) {
        currentAyatAudio.pause();
        currentAyatAudio = null;
    }
    document.querySelectorAll('.tahlil-item').forEach(card => {
        card.style.borderLeft = "none";
        card.style.backgroundColor = "#ffffff";
    });
    if (currentActiveButton) {
        currentActiveButton.innerHTML = '<i class="fas fa-play me-1"></i> Dengar';
        currentActiveButton.className = 'btn btn-sm btn-outline-success rounded-pill px-3 play-btn';
        currentActiveButton = null;
    }
}

/**
 * Fungsi tukar saiz font (Hanya untuk tulisan Arab)
 */
window.adjustFont = function(step) {
    let change = (step > 0) ? 0.2 : -0.2;
    currentFontSize += change;
    
    if (currentFontSize < 1.5) currentFontSize = 1.5;
    if (currentFontSize > 3.5) currentFontSize = 3.5;
    
    document.querySelectorAll('.arabic-text').forEach(el => {
        el.style.fontSize = currentFontSize + 'rem';
    });
};

document.addEventListener('DOMContentLoaded', loadYasin);