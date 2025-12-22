/**
 * Fail: yasin.js
 * Deskripsi: Menguruskan data Surah Yasin menggunakan API Global & Terjemahan Basmeih
 */

let currentAyatAudio = null;
let currentActiveButton = null;
let currentFontSize = 2.2; 

async function loadYasin() {
    const yasinContainer = document.getElementById('verses-list');
    const loader = document.getElementById('loader');
    const contentDiv = document.getElementById('yasin-content');
    const fullAudio = document.getElementById('full-audio');

    // Semak Cache (Offline First) - Versi 4 untuk API baru
    const cacheKey = 'surah_yasin_global_v4';
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        displayData(JSON.parse(cachedData));
    } else {
        try {
            // Mengambil 3 data serentak: Arab, Latin, dan Melayu Basmeih
            const [resAr, resLat, resMs] = await Promise.all([
                fetch('https://api.alquran.cloud/v1/surah/36/quran-uthmani'),
                fetch('https://api.alquran.cloud/v1/surah/36/en.transliteration'),
                fetch('https://api.alquran.cloud/v1/surah/36/ms.basmeih')
            ]);

            const dataAr = (await resAr.json()).data;
            const dataLat = (await resLat.json()).data;
            const dataMs = (await resMs.json()).data;

            // Susun semula data supaya senang dibaca oleh loop display
            const formattedData = dataAr.ayahs.map((ayat, index) => ({
                nomorAyat: ayat.numberInSurah,
                teksArab: ayat.text,
                teksLatin: dataLat.ayahs[index].text,
                teksMs: dataMs.ayahs[index].text,
                audioAyat: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayat.number}.mp3`
            }));

            // Simpan dalam cache
            localStorage.setItem(cacheKey, JSON.stringify(formattedData));
            displayData(formattedData);
        } catch (error) {
            console.error("Ralat API Yasin:", error);
            yasinContainer.innerHTML = `
                <div class="text-center p-5">
                    <i class="fas fa-wifi-slash fa-3x text-muted mb-3"></i>
                    <p class="small text-muted">Gagal memuatkan data. Sila periksa internet anda.</p>
                    <button onclick="location.reload()" class="btn btn-sm btn-success rounded-pill px-4">Cuba Lagi</button>
                </div>`;
            if(loader) loader.classList.add('d-none');
        }
    }

    function displayData(ayahs) {
        // Set audio penuh (Surah 36)
        if (fullAudio) {
            fullAudio.querySelector('source').src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3`;
            fullAudio.load();
        }

        fullAudio.onplay = () => stopAnyCurrentAyat();

        yasinContainer.innerHTML = '';
        
        ayahs.forEach((item) => {
            // Buang teks Bismillah pada ayat pertama (kerana Yasin bermula dengan "Ya-Sin")
            let teksArab = item.teksArab;
            if (item.nomorAyat === 1 && teksArab.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")) {
                teksArab = teksArab.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim();
            }

            const verseHTML = `
                <div class="yasin-item animate__animated animate__fadeInUp" id="verse-${item.nomorAyat}">
                    <div class="verse-no"><span>${item.nomorAyat}</span></div>
                    
                    <div class="arabic-text" style="font-size: ${currentFontSize}rem; font-family: 'Uthman-Taha', serif;">
                        ${teksArab}
                    </div>
                    
                    <div class="latin-text text-success fw-semibold my-2" style="font-size: 0.9rem;">
                        ${item.teksLatin}
                    </div>
                    
                    <div class="translation-text text-muted" style="font-size: 0.85rem; border-left: 2px solid #1b4332; padding-left: 10px;">
                        ${item.teksMs}
                    </div>
                    
                    <div class="mt-4">
                        <button class="btn btn-sm btn-outline-success rounded-pill px-3 play-btn" 
                                onclick="handleAyatAudio('${item.audioAyat}', this, ${item.nomorAyat})">
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
    
    // Highlight Card (Tema Emerald/Gold)
    currentCard.style.borderLeft = "4px solid #d4a373"; 
    currentCard.style.backgroundColor = "#f0f7f4";

    currentAyatAudio = new Audio(url);
    currentAyatAudio.onplaying = () => {
        btn.innerHTML = '<i class="fas fa-stop me-1"></i> Berhenti';
        btn.classList.replace('btn-outline-success', 'btn-danger');
    };

    currentAyatAudio.play().catch(e => {
        console.warn("Autoplay blocked.");
        stopAnyCurrentAyat();
    });

    currentAyatAudio.onended = () => {
        stopAnyCurrentAyat();
    };
}

function stopAnyCurrentAyat() {
    if (currentAyatAudio) {
        currentAyatAudio.pause();
        currentAyatAudio = null;
    }
    document.querySelectorAll('.yasin-item').forEach(card => {
        card.style.borderLeft = "1px solid rgba(45, 106, 79, 0.05)";
        card.style.backgroundColor = "#ffffff";
    });
    if (currentActiveButton) {
        currentActiveButton.innerHTML = '<i class="fas fa-play me-1"></i> Dengar';
        currentActiveButton.className = 'btn btn-sm btn-outline-success rounded-pill px-3 play-btn';
        currentActiveButton = null;
    }
}

/**
 * Fungsi tukar saiz font
 */
window.adjustFont = function(step) {
    let change = (step > 0) ? 0.2 : -0.2;
    currentFontSize += change;
    
    if (currentFontSize < 1.6) currentFontSize = 1.6;
    if (currentFontSize > 3.5) currentFontSize = 3.5;
    
    document.querySelectorAll('.arabic-text').forEach(el => {
        el.style.fontSize = currentFontSize + 'rem';
    });
};

document.addEventListener('DOMContentLoaded', loadYasin);