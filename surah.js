/**
 * Fail: surah.js
 * Deskripsi: Memaparkan ayat surah dengan API Global & Terjemahan Bahasa Melayu (Basmeih)
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
        // Mengambil 3 data serentak: Teks Arab, Transliterasi, dan Terjemahan Melayu
        const [resAr, resLat, resMs] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${noSurat}/quran-uthmani`),
            fetch(`https://api.alquran.cloud/v1/surah/${noSurat}/en.transliteration`),
            fetch(`https://api.alquran.cloud/v1/surah/${noSurat}/ms.basmeih`)
        ]);

        const dataAr = (await resAr.json()).data;
        const dataLat = (await resLat.json()).data;
        const dataMs = (await resMs.json()).data;

        // 1. Update Navigation & Header
        document.getElementById('nav-surah-name').innerText = dataAr.englishName;
        document.getElementById('surah-name-ar').innerText = dataAr.name;
        document.getElementById('surah-info').innerText = `${dataAr.englishName} • ${dataAr.englishNameTranslation} • ${dataAr.numberOfAyahs} Ayat`;

        // 2. Setup Full Audio (Misyari Rasyid) - Menggunakan API Audio berasingan
        const mainAudio = document.getElementById('main-audio');
        const audioSrc = document.getElementById('audio-src');
        if(mainAudio && audioSrc) {
            audioSrc.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${noSurat}.mp3`;
            mainAudio.load();
        }

        if(!container) return;
        container.innerHTML = '';

        // 3. Tambah Bismillah (Kecuali Al-Fatihah & At-Tawbah)
        // API Cloud menyertakan Bismillah dalam ayat pertama bagi sesetengah surah, 
        // kita buat semakan manual untuk kecantikan paparan.
        if (noSurat != 1 && noSurat != 9) {
            container.innerHTML += `
                <div class="text-center mb-5 mt-2 animate__animated animate__fadeIn">
                    <h2 class="arabic-text" style="font-family: 'Uthman-Taha', serif; font-size: 2.2rem; color: #1b4332;">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</h2>
                </div>
            `;
        }

        // 4. Papar Ayat-ayat
        dataAr.ayahs.forEach((ayat, index) => {
            const noAyat = ayat.numberInSurah;
            let teksArab = ayat.text;
            const teksLatin = dataLat.ayahs[index].text;
            const teksMs = dataMs.ayahs[index].text;
            const audioAyat = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayat.number}.mp3`;

            // Buang teks Bismillah jika ia ada di dalam teks ayat pertama (kecuali Fatihah)
            if (noSurat != 1 && noAyat === 1 && teksArab.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَّٰنِ ٱلرَّحِيمِ")) {
                teksArab = teksArab.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَّٰنِ ٱلرَّحِيمِ", "");
            }

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
                    
                    <p class="arabic-text text-end mb-3" style="font-family: 'Uthman-Taha', serif !important; font-size: 2.2rem; line-height: 2.5; color: #1b4332;">
                        ${teksArab}
                    </p>
                    
                    <p class="text-success fw-semibold mb-2" style="font-size: 0.8rem; line-height: 1.4;">${teksLatin}</p>
                    <p class="text-muted mb-0" style="font-size: 0.85rem; line-height: 1.5; border-left: 2px solid #1b4332; padding-left: 10px;">${teksMs}</p>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', verseHTML);
        });

        // 5. Sembunyikan Loading
        if (loadingVerses) loadingVerses.classList.add('d-none');

    } catch (error) {
        console.error("Ralat Detail Surah:", error);
        if (loadingVerses) {
            loadingVerses.innerHTML = `<p class="text-danger small">Gagal memuatkan ayat. Sila periksa internet.</p>`;
        }
    }
}

/**
 * Fungsi Kawalan Audio
 */
function playAyat(url, btn) {
    stopAyat(); 
    currentAudio = new Audio(url);
    currentAudio.play();

    const parent = btn.parentElement;
    const stopBtn = parent.querySelector('.stop-btn');
    
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

document.addEventListener('DOMContentLoaded', getSurahDetail);