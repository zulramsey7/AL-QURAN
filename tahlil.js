/**
 * Tahlil.js - QuranDigital2025
 * Status: Updated with High Stability Translation API
 */

const tahlilContent = document.getElementById("tahlil-content");
const loader = document.getElementById("loader");
const API = "https://api.alquran.cloud/v1/ayah";

// --- 1. FUNGSI PENGAMBILAN DATA (DENGAN STABILITI TINGGI) ---

async function getAyahData(surah, ayah) {
    try {
        // Menggunakan ms.basmeih kerana ia edisi terjemahan Malaysia paling stabil di API ini
        const [resAr, resLat, resMs] = await Promise.all([
            fetch(`${API}/${surah}:${ayah}`),
            fetch(`${API}/${surah}:${ayah}/en.transliteration`),
            fetch(`${API}/${surah}:${ayah}/ms.basmeih`) 
        ]);
        
        const dataAr = await resAr.json();
        const dataLat = await resLat.json();
        const dataMs = await resMs.json();

        // Jika API terjemahan gagal atau memulangkan teks Arab semula
        let translation = dataMs.data.text;
        if (!translation || translation.includes("Allah") && translation.length < 10 && dataAr.data.text.length > 20) {
             translation = "Terjemahan sedang dimuatkan...";
        }

        return { 
            ar: dataAr.data.text, 
            lat: dataLat.data.text, 
            // Membersihkan teks daripada nombor ayat (1), (2) dsb
            ms: translation.replace(/^\(\d+\)\s*/, '') 
        };
    } catch (error) {
        console.error("Gagal ambil data untuk", surah, ayah, error);
        return { ar: "", lat: "", ms: "Sila periksa sambungan internet untuk terjemahan." };
    }
}

async function getAyahAudio(surah, ayah) {
    try {
        const res = await fetch(`${API}/${surah}:${ayah}/ar.alafasy`);
        const data = await res.json();
        return data.data.audio;
    } catch (e) { return ""; }
}

// --- 2. FUNGSI RENDER UI ---

function section(title, arabic, latin = "", translation = "", repeat = "", audio = "") {
    return `
    <div class="prayer-card mb-4 animate__animated animate__fadeInUp">
        <h6 class="text-success fw-bold">${title}</h6>
        <p class="arabic-text">${arabic}</p>
        ${latin ? `<p class="italic">${latin}</p>` : ""}
        ${translation ? `<p class="small text-dark">"${translation}"</p>` : ""}
        ${repeat ? `<span class="badge bg-success bg-opacity-10 text-success mb-2">${repeat}</span>` : ""}
        ${audio ? `<audio controls class="w-100 mt-2 shadow-sm"><source src="${audio}" type="audio/mpeg"></audio>` : ""}
    </div>`;
}

// --- 3. PROSES PENYUSUNAN TAHLIL ---

async function loadTahlil() {
    let html = "";

    try {
        // --- 1. AL-FATIHAH ---
        let f = { ar: [], lat: [], ms: [] };
        for (let i = 1; i <= 7; i++) {
            let d = await getAyahData(1, i);
            f.ar.push(d.ar); f.lat.push(d.lat); f.ms.push(d.ms);
        }
        html += section("Al-Fatihah", f.ar.join(" "), f.lat.join(" "), f.ms.join(" "), "Dibaca 1 kali", await getAyahAudio(1, 1));

        // --- 2. BACAAN SURAH PENDEK ---
        const surahs = [
            { id: 112, name: "Surah Al-Ikhlas", rep: "3 kali", count: 4 },
            { id: 113, name: "Surah Al-Falaq", rep: "1 kali", count: 5 },
            { id: 114, name: "Surah An-Nas", rep: "1 kali", count: 6 }
        ];

        for (let s of surahs) {
            let sa = { ar: [], lat: [], ms: [] };
            for (let i = 1; i <= s.count; i++) {
                let d = await getAyahData(s.id, i);
                sa.ar.push(d.ar); sa.lat.push(d.lat); sa.ms.push(d.ms);
            }
            html += section(s.name, sa.ar.join(" "), sa.lat.join(" "), sa.ms.join(" "), s.rep, await getAyahAudio(s.id, 1));
        }

        // --- 3. TAHLIL & TAKBIR ---
        html += section("Tahlil & Takbir", "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ ۖ وَٱللَّٰهُ أَكْبَرُ", "La ilaha illallahu wallahu akbar", "Tiada Tuhan melainkan Allah, dan Allah Maha Besar.");

        // --- 4. AYAT PILIHAN ---
        // Al-Baqarah 1-5
        let b15 = { ar: [], lat: [], ms: [] };
        for (let i = 1; i <= 5; i++) {
            let d = await getAyahData(2, i);
            b15.ar.push(d.ar); b15.lat.push(d.lat); b15.ms.push(d.ms);
        }
        html += section("Al-Baqarah 1–5", b15.ar.join(" "), b15.lat.join(" "), b15.ms.join(" "), "", await getAyahAudio(2, 1));

        // Ayat Kursi & Al-Baqarah Lain
        let b163 = await getAyahData(2, 163);
        html += section("Al-Baqarah 163", b163.ar, b163.lat, b163.ms, "", await getAyahAudio(2, 163));

        let kursi = await getAyahData(2, 255);
        html += section("Ayat Kursi", kursi.ar, kursi.lat, kursi.ms, "", await getAyahAudio(2, 255));

        let bEnd = { ar: [], lat: [], ms: [] };
        for (let i = 284; i <= 286; i++) {
            let d = await getAyahData(2, i);
            bEnd.ar.push(d.ar); bEnd.lat.push(d.lat); bEnd.ms.push(d.ms);
        }
        html += section("Al-Baqarah 284–286", bEnd.ar.join(" "), bEnd.lat.join(" "), bEnd.ms.join(" "), "", await getAyahAudio(2, 284));

        // Hud & Ahzab
        let hud = await getAyahData(11, 73);
        html += section("Surah Hud Ayat 73", hud.ar, hud.lat, hud.ms, "Ya Arhamar Rahimin - Ulang 3 kali", await getAyahAudio(11, 73));

        let ahz33 = await getAyahData(33, 33);
        html += section("Surah Al-Ahzab Ayat 33", ahz33.ar, ahz33.lat, ahz33.ms, "", await getAyahAudio(33, 33));

        let ahz56 = await getAyahData(33, 56);
        html += section("Surah Al-Ahzab Ayat 56", ahz56.ar, ahz56.lat, ahz56.ms, "", await getAyahAudio(33, 56));

        // --- 5. SELAWAT, ZIKIR & SYAHADAH ---
        html += section("Selawat Nabi", "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ", "Allahumma salli 'ala sayyidina Muhammad", "Ya Allah, limpahkanlah selawat ke atas penghulu kami Nabi Muhammad.", "3 kali");
        html += section("Hauqalah", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", "La hawla wala quwwata illa billah", "Tiada daya dan kekuatan melainkan dengan pertolongan Allah.");
        html += section("Istighfar", "أَسْتَغْفِرُ ٱللَّٰهَ ٱلْعَظِيمَ", "Astaghfirullahal 'azim", "Aku memohon ampun kepada Allah Yang Maha Agung.", "3 kali");
        html += section("Tahlil", "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", "La ilaha illallah", "Tiada Tuhan melainkan Allah", "33 atau 100 kali");
        html += section("Kalimah Syahadah", "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ", "Ashhadu alla ilaha illallah wa ashhadu anna Muhammadan rasulullah", "Aku bersaksi bahawa tiada Tuhan melainkan Allah dan Nabi Muhammad utusan Allah.");

        // --- 6. PENUTUP ---
        html += `
        <div class="prayer-card text-center py-4 bg-success bg-opacity-10 border-success">
            <h5 class="fw-bold text-success mb-3">DOA TAHLIL</h5>
            <p class="small mb-4">Sila teruskan dengan bacaan doa arwah mengikut kelaziman.</p>
            <a href="doa-arwah.html" class="btn btn-success rounded-pill px-4 shadow-sm">
                <i class="fas fa-hands-praying me-2"></i> Buka Doa Arwah
            </a>
        </div>`;

        loader.remove();
        tahlilContent.innerHTML = html;

    } catch (err) {
        console.error(err);
        loader.innerHTML = "<p class='text-danger'>Ralat memuatkan data. Sila refresh halaman.</p>";
    }
}

loadTahlil();