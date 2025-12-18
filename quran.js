let surahData = [];

async function getSurahList() {
    try {
        const response = await fetch('https://equran.id/api/v2/surat');
        const result = await response.json();
        surahData = result.data;
        displaySurah(surahData);
        document.getElementById('loading-quran').classList.add('d-none');
        document.getElementById('surah-list').classList.remove('d-none');
    } catch (error) {
        console.error("Gagal ambil senarai surah");
    }
}

function displaySurah(data) {
    const list = document.getElementById('surah-list');
    list.innerHTML = '';

    data.forEach(s => {
        list.innerHTML += `
            <div class="col-md-6 col-lg-4 animate__animated animate__fadeIn">
                <a href="surah.html?no=${s.nomor}" class="surah-card p-3 h-100">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <div class="surah-no me-3">${s.nomor}</div>
                            <div>
                                <h6 class="fw-bold mb-0">${s.namaLatin}</h6>
                                <small class="text-muted">${s.arti} • ${s.jumlahAyat} Ayat</small>
                            </div>
                        </div>
                        <div class="arabic-name">${s.nama}</div>
                    </div>
                </a>
            </div>
        `;
    });
}

document.getElementById('search-surah').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = surahData.filter(s => s.namaLatin.toLowerCase().includes(term));
    displaySurah(filtered);
});

document.addEventListener('DOMContentLoaded', getSurahList);