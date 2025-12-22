const tahlilContent = document.getElementById("tahlil-content");
const loader = document.getElementById("loader");

const API = "https://api.alquran.cloud/v1/ayah";

async function getAyah(surah, ayah) {
    const res = await fetch(`${API}/${surah}:${ayah}`);
    const data = await res.json();
    return data.data.text;
}

async function getAyahAudio(surah, ayah) {
    const res = await fetch(`${API}/${surah}:${ayah}/ar.alafasy`);
    const data = await res.json();
    return data.data.audio;
}

function section(title, arabic, repeat = "", audio = "") {
    return `
    <div class="prayer-card mb-3">
        <h6 class="fw-bold text-success">${title}</h6>
        <p class="arabic-text">${arabic}</p>
        ${repeat ? `<p class="text-muted small">${repeat}</p>` : ""}
        ${audio ? `<audio controls class="w-100 mt-2"><source src="${audio}" type="audio/mpeg"></audio>` : ""}
    </div>`;
}

async function loadTahlil() {
    let html = "";

    // PEMBUKAAN
    html += section("Ta'awwudz", "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ");
    html += section("Basmalah", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");

    // AL-FATIHAH
    let fatihah = "";
    for (let i = 1; i <= 7; i++) fatihah += await getAyah(1, i) + " ";
    let fatihahAudio = await getAyahAudio(1, 1);
    html += section("Al-Fatihah", fatihah, "Dibaca 1 kali", fatihahAudio);

    // SURAH PENDEK
    const surahPendek = [
        { s: 112, repeat: "3 kali", name: "Al-Ikhlas" },
        { s: 113, repeat: "1 kali", name: "Al-Falaq" },
        { s: 114, repeat: "1 kali", name: "An-Nas" }
    ];

    for (let sp of surahPendek) {
        let text = "";
        for (let i = 1; i <= (sp.s === 112 ? 4 : 5); i++) {
            text += await getAyah(sp.s, i) + " ";
        }
        let audio = await getAyahAudio(sp.s, 1);
        html += section(sp.name, text, `Dibaca ${sp.repeat}`, audio);
    }

    // TAHLIL & TAKBIR (MANUAL)
    html += section(
        "Tahlil & Takbir",
        "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ ۖ وَٱللَّٰهُ أَكْبَرُ"
    );

    // AYAT PILIHAN
    let baqarah1to5 = "";
    for (let i = 1; i <= 5; i++) baqarah1to5 += await getAyah(2, i) + " ";
    html += section("Al-Baqarah 1–5", baqarah1to5, "", await getAyahAudio(2, 1));

    html += section("Al-Baqarah 163", await getAyah(2, 163), "", await getAyahAudio(2, 163));
    html += section("Ayat Kursi", await getAyah(2, 255), "", await getAyahAudio(2, 255));

    let baqarah284 = "";
    for (let i = 284; i <= 286; i++) baqarah284 += await getAyah(2, i) + " ";
    html += section("Al-Baqarah 284–286", baqarah284, "", await getAyahAudio(2, 284));

    html += section(
        "Hud ayat 73",
        await getAyah(11, 73),
        "Diulang 3 kali",
        await getAyahAudio(11, 73)
    );

    html += section("Al-Ahzab 33", await getAyah(33, 33), "", await getAyahAudio(33, 33));
    html += section("Al-Ahzab 56", await getAyah(33, 56), "", await getAyahAudio(33, 56));

    // SELAWAT
    html += section(
        "Selawat ke atas Nabi",
        "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ",
        "3 kali"
    );

    // ISTIGHFAR & HAUQALAH
    html += section("Hauqalah", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ");
    html += section("Istighfar", "أَسْتَغْفِرُ ٱللَّٰهَ ٱلْعَظِيمَ", "3 kali");

    // TAHLIL & SYAHADAH
    html += section("Tahlil", "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", "33 atau 100 kali");
    html += section(
        "Kalimah Syahadah",
        "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ"
    );

    loader.remove();
    tahlilContent.innerHTML = html;
}

loadTahlil();