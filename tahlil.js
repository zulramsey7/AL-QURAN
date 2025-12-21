/**
 * Fail: tahlil.js
 * Deskripsi: Data bacaan Tahlil Lengkap (Semua Ayat Kekal) dengan Gaya Diamond
 */

const tahlilData = [
  {
      title: ". Surah Al-Fatihah",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاك نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Al-Ḥamdu Lillāhi Rabbil-‘Ālamīn. Ar-Raḥmānir-Raḥīm. Māliki Yaumid-Dīn. Iyyāka Na‘Budu Wa Iyyāka Nasta‘Īn. Ihdinaṣ-Ṣirāṭal-Mustaqīm. Ṣirāṭallażīna An‘Amta ‘Alaihim, Gairil-Magḍūbi ‘Alaihim Wa Laḍ-Ḍāllīn",
      translation: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani. Segala puji tertentu bagi Allah, Tuhan yang memelihara dan Mentadbirkan Alam. Yang Maha Pemurah, lagi Maha Mengasihani. Yang Menguasai pemerintahan hari Pembalasan (hari Akhirat). Engkaulah sahaja (Ya Allah) Yang Kami Sembah dan kepada Engkaulah sahaja kami memohon pertolongan. Tunjukkan kami jalan yang lurus. Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang Engkau telah murkai dan bukan pula (jalan) orang-orang yang sesat."
  },
  {
      title: ". Surah Al-Ikhlas (3x)",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Qul Huwallāhu Aḥad. Allāhuṣ-Ṣamad. Lam Yalid Wa Lam Yūlad. Wa Lam Yakul Lahū Kufuwan Aḥad (3 Kali)",
      translation: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani. Katakanlah: 'Dialah Allah yang maha esa. Allah adalah tuhan tempat bergantung oleh segala sesuatu. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada seorangpun yang setara dengan-Nya.' (3 kali)."
  },
  {
      title: ". Tahlil & Takbir",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lā ilāha illallāhu wallāhu akbar",
      translation: "Tiada Tuhan melainkan Allah, dan Allah Maha Besar."
  },
  {
      title: ". Surah Al-Falaq",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Qul A‘Ūżu Birabbil-Falaq. Min Syarri Mā Khalaq. Wa Min Syarri Gāsiqin Iżā Waqab. Wa Min Syarrin-Naffāṡāti Fil-‘Uqad. Wa Min Syarri Ḥāsidin Iżā Ḥasad",
      translation: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani. Katakanlah, 'Aku berlindung kepada tuhan yang menguasai waktu subuh dari kejahatan makhluk-Nya...'"
  },
  {
      title: ". Tahlil & Takbir",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lā ilāha illallāhu wallāhu akbar",
      translation: "Tiada Tuhan melainkan Allah, dan Allah Maha Besar."
  },
  {
      title: ". Surah An-Nas",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Qul A‘Ūżu Birabbin-Nās. Malikin-Nās. Ilāhin-Nās. Min Syarril-Waswāsil-Khannās. Allażī Yuwaswisu Fī Ṣudūrin-Nās. Minal Jinnati Wan-Nās",
      translation: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani. Katakanlah: 'Aku berlindung kepada (Allah) Pemulihara sekalian manusia...'"
  },
  {
      title: ". Tahlil & Takbir",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lā ilāha illallāhu wallāhu akbar",
      translation: "Tiada Tuhan melainkan Allah, dan Allah Maha Besar."
  },
  {
      title: ". Surah Al-Fatihah",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاك نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Al-Ḥamdu Lillāhi Rabbil-‘Ālamīn. Ar-Raḥmānir-Raḥīm. Māliki Yaumid-Dīn. Iyyāka Na‘Budu Wa Iyyāka Nasta‘Īn. Ihdinaṣ-Ṣirāṭal-Mustaqīm. Ṣirāṭallażīna An‘Amta ‘Alaihim, Gairil-Magḍūbi ‘Alaihim Wa Laḍ-Ḍāllīn",
      translation: "Membaca Surah Al-Fatihah sebagai permulaan doa dan keberkatan bagi arwah."
  },
  {
      title: ". Al-Baqarah (Ayat 1-5)",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ﴿٢﴾ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٣﴾ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٤﴾ أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ ﴿٥﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Alif Lām Mīm. Żālikal-Kitābu Lā Raiba Fīh, Hudal Lil-Muttaqīn. Allażīna Yu’minūna Bil-Gaibi Wa Yuqīmūnaṣ-Ṣalāta Wa Mimmā Razaqnāhum Yunfiqūn...",
      translation: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani. Alif lam mim. Kitab Al-Quran ini tidak ada sebarang keraguan padanya..."
  },
  {
      title: ". Al-Baqarah (Ayat 163)",
      arabic: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
      latin: "Wa ilaahukum ilaahuw Waahid, Laa ilaaha illaa Huwar-Rahmaanur-rahiim",
      translation: "Dan Tuhan kamu ialah Tuhan Yang Maha Esa; tiada Tuhan melainkan Dia, Yang Maha Pemurah, lagi Maha Mengasihani."
  },
  {
      title: ". Ayat Kursi (Al-Baqarah 255)",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      latin: "Allāhu Lā Ilāha Illā Huw, Al-Ḥayyul-Qayyūm, Lā Ta’khużuhū Sinatuw Wa Lā Naum, Lahū Mā Fis-Samāwāti Wa Mā Fil-Arḍ, Man Żallażī Yasyfa‘U ‘Indahū Illā Bi’iżnih...",
      translation: "Allah, tiada Tuhan melainkan Dia Yang Hidup kekal lagi terus menerus mengurus makhluk-Nya..."
  },
  {
      title: ". Al-Baqarah (Ayat 284-286)",
      arabic: "لِّلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ... آمَنَ الرَّسُولُ... لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا...",
      latin: "Lillāhi Mā Fis-Samāwāti Wa Mā Fil-Arḍ... Āmanar-Rasūlu... Lā Yukallifullāhu Nafsan Illā Wus‘Ahā...",
      translation: "Segala yang ada di langit dan bumi adalah kepunyaan Allah... Allah tidak membebani seseorang melainkan sesuai kesanggupannya..."
  },
  {
      title: ". Hud (Ayat 73) & Zikir",
      arabic: "يَا أَرْحَمَ الرَّاحِمِينَ ارْحَمْنَا (٣) رَحْمَتُ اللَّهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ ۚ إِنَّهُ حَمِيدٌ مَّجِيدٌ",
      latin: "Yaa Arhamar-Raahimiin IrHamna (3x). Rahmatullaahi Wa Barakaatuhuu ‘Alaykum Ahlal-Bayt, innahuu HamiiDum-Majiid",
      translation: "Wahai Tuhan Yang Maha Pengasih, kasihani kami (3x). Rahmat Allah dan keberkatan-Nya melimpah ke atas kamu sekalian wahai ahli bait."
  },
  {
      title: ". Al-Ahzab (Ayat 33)",
      arabic: "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا",
      latin: "InnaMaa YuriiDullahu Liyudz-hiba ‘Ankumur-Rijsa Ahlal-bayt Wa YuThahHiraKum That-Hiiraa",
      translation: "Sesungguhnya Allah bermaksud hendak menghilangkan dosa dari kamu, wahai ahlul bait dan membersihkan kamu sebersih-bersihnya."
  },
  {
      title: ". Al-Ahzab (Ayat 56)",
      arabic: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
      latin: "Innallaaha Wa Malaa’ikatahuu YuSolluuNa ‘Alan-Nabiyy, Yaa AyyuHalLaziina AamaNuu Sollu ‘Alaihi Wa SalliMuu TasLiiMaa",
      translation: "Sesungguhnya Allah dan para malaikat-Nya berselawat untuk nabi. Wahai orang-orang yang beriman, berselawatlah kamu untuknya..."
  }
];

// --- Fungsi Paparan ---
let currentFontSize = 2.2;

function renderTahlil() {
    const container = document.getElementById('tahlil-content');
    if (!container) return;

    let html = '';
    tahlilData.forEach((item, index) => {
        html += `
            <div class="tahlil-item animate__animated animate__fadeInUp">
                <div class="tahlil-no"><span>${index + 1}</span></div>
                
                <div class="tahlil-badge">${item.title}</div>
                
                <div class="arabic-text" style="font-size: ${currentFontSize}rem;">
                    ${item.arabic}
                </div>
                
                <div class="latin-text">
                    ${item.latin}
                </div>
                
                <div class="translation-text">
                    ${item.translation}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fungsi Adjust Font
window.adjustFont = function(step) {
    currentFontSize += (step * 0.2);
    if (currentFontSize < 1.4) currentFontSize = 1.4;
    if (currentFontSize > 3.5) currentFontSize = 3.5;
    
    const texts = document.querySelectorAll('.arabic-text');
    texts.forEach(t => t.style.fontSize = currentFontSize + 'rem');
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
        renderTahlil();
    }, 400);
});