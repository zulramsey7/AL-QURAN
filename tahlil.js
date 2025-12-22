const tahlilContent = document.getElementById("tahlil-content");
const loader = document.getElementById("loader");

const API = "https://api.alquran.cloud/v1/ayah";

// Fungsi untuk mendapatkan data lengkap (Arab, Latin, Terjemahan)
async function getAyahData(surah, ayah) {
    try {
        const [resAr, resLat, resMs] = await Promise.all([
            fetch(`${API}/${surah}:${ayah}`),
            fetch(`${API}/${surah}:${ayah}/en.transliteration`),
            fetch(`${API}/${surah}:${ayah}/ms.translation`)
        ]);
        
        const [dataAr, dataLat, dataMs] = await Promise.all([
            resAr.json(),
            resLat.json(),
            resMs.json()
        ]);

        return {
            ar: dataAr.data.text,
            lat: dataLat.data.text,
            ms: dataMs.data.text
        };
    } catch (error) {
        console.error("Ralat memuatkan ayat:", error);
        return { ar: "", lat: "", ms: "" };
    }
}

async function getAyahAudio(surah, ayah) {
    const res = await fetch(`${API}/${surah}:${ayah}/ar.alafasy`);
    const data = await res.json();
    return data.data.audio;
}

// Fungsi paparan yang seragam
function section(title, arabic, latin = "", translation = "", repeat = "", audio = "") {
    return `
    <div class="prayer-card mb-3 animate__animated animate__fadeIn">
        <h6 class="fw-bold text-success" style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">${title}</h6>
        <p class="arabic-text" style="font-size: 1.6rem; line-height: 2.8rem; margin-bottom: 15px;">${arabic}</p>
        ${latin ? `<p class="text-muted small italic mb-1"><em>${latin}</em></p>` : ""}
        ${translation ? `<p class="small text-dark opacity-75 mb-2" style="font-size: 0.8rem; border-top: 1px solid rgba(0,0,0,0.05); pt-2">"${translation}"</p>` : ""}
        ${repeat ? `<span class="badge bg-success bg-opacity-10 text-success mb-2" style="font-size: 0.7rem;">${repeat}</span>` : ""}
        ${audio ? `<audio controls class="w-100 mt-2" style="height: 35px;"><source src="${audio}" type="audio/mpeg"></audio>` : ""}
    </div>`;
}

async function loadTahlil() {
    let html = "";

    // 1. PEMBUKAAN (Manual)
    html += section("Ta'awwudz", "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", "A'udhu billahi minash-shaitanir-rajim", "Aku berlindung kepada Allah dari syaitan yang direjam.");
    html += section("Basmalah", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "Bismillahir-rahmanir-rahim", "Dengan nama Allah Yang Maha Pemurah lagi Maha Mengasihani.");

    // 2. AL-FATIHAH
    let fAr = "", fLat = "", fMs = "";
    for (let i = 1; i <= 7; i++) {
        let d = await getAyahData(1, i);
        fAr += d.ar + " "; fLat += d.lat + " "; fMs += d.ms + " ";
    }
    html += section("Al-Fatihah", fAr, fLat, fMs, "Dibaca 1 kali", await getAyahAudio(1, 1));

    // 3. SURAH PENDEK
    const surahPendek = [
        { s: 112, repeat: "3 kali", name: "Al-Ikhlas", count: 4 },
        { s: 113, repeat: "1 kali", name: "Al-Falaq", count: 5 },
        { s: 114, repeat: "1 kali", name: "An-Nas", count: 6 }
    ];

    for (let sp of surahPendek) {
        let ar = "", lat = "", ms = "";
        for (let i = 1; i <= sp.count; i++) {
            let d = await getAyahData(sp.s, i);
            ar += d.ar + " "; lat += d.lat + " "; ms += d.ms + " ";
        }
        html += section(sp.name, ar, lat, ms, `Dibaca ${sp.repeat}`, await getAyahAudio(sp.s, 1));
    }

    // 4. TAHLIL & TAKBIR (MANUAL)
    html += section("Tahlil & Takbir", "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ ۖ وَٱللَّٰهُ أَكْبَرُ", "La ilaha illallahu wallahu akbar", "Tiada Tuhan melainkan Allah, dan Allah Maha Besar.");

    // 5. AYAT PILIHAN
    // Al-Baqarah 1-5
    let bAr = "", bLat = "", bMs = "";
    for (let i = 1; i <= 5; i++) {
        let d = await getAyahData(2, i);
        bAr += d.ar + " "; bLat += d.lat + " "; bMs += d.ms + " ";
    }
    html += section("Al-Baqarah 1–5", bAr, bLat, bMs, "", await getAyahAudio(2, 1));

    // Al-Baqarah 163
    let b163 = await getAyahData(2, 163);
    html += section("Al-Baqarah 163", b163.ar, b163.lat, b163.ms, "", await getAyahAudio(2, 163));

    // Ayat Kursi
    let kursi = await getAyahData(2, 255);
    html += section("Ayat Kursi", kursi.ar, kursi.lat, kursi.ms, "", await getAyahAudio(2, 255));

    // Al-Baqarah 284-286
    let bEndAr = "", bEndLat = "", bEndMs = "";
    for (let i = 284; i <= 286; i++) {
        let d = await getAyahData(2, i);
        bEndAr += d.ar + " "; bEndLat += d.lat + " "; bEndMs += d.ms + " ";
    }
    html += section("Al-Baqarah 284–286", bEndAr, bEndLat, bEndMs, "", await getAyahAudio(2, 284));

    // Hud 73
    let hud = await getAyahData(11, 73);
    html += section("Hud ayat 73", hud.ar, hud.lat, hud.ms, "Diulang 3 kali", await getAyahAudio(11, 73));

    // Al-Ahzab 33
    let ahz33 = await getAyahData(33, 33);
    html += section("Al-Ahzab 33", ahz33.ar, ahz33.lat, ahz33.ms, "", await getAyahAudio(33, 33));

    // Al-Ahzab 56
    let ahz56 = await getAyahData(33, 56);
    html += section("Al-Ahzab 56", ahz56.ar, ahz56.lat, ahz56.ms, "", await getAyahAudio(33, 56));

    // 6. SELAWAT, ISTIGHFAR & TAHLIL (MANUAL)
    html += section("Selawat ke atas Nabi", "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ", "Allahumma salli 'ala sayyidina Muhammad", "Ya Allah, limpahkanlah selawat ke atas penghulu kami Nabi Muhammad.", "3 kali");
    html += section("Hauqalah", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", "La hawla wala quwwata illa billah", "Tiada daya dan kekuatan melainkan dengan pertolongan Allah.");
    html += section("Istighfar", "أَسْتَغْفِرُ ٱللَّٰهَ ٱLْعَظِيمَ", "Astaghfirullahal 'azim", "Aku memohon ampun kepada Allah Yang Maha Agung.", "3 kali");
    html += section("Tahlil", "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", "La ilaha illallah", "Tiada Tuhan melainkan Allah", "33 atau 100 kali");
    html += section("Kalimah Syahadah", "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ", "Ashhadu alla ilaha illallah wa ashhadu anna Muhammadan rasulullah", "Aku bersaksi bahawa tiada Tuhan melainkan Allah dan aku bersaksi bahawa Nabi Muhammad itu utusan Allah.");

    loader.remove();
    tahlilContent.innerHTML = html;
}

loadTahlil();