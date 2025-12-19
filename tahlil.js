const tahlilData = [
  {
      title: "1. Surah Al-Fatihah",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Al-Ḥamdu Lillāhi Rabbil-‘Ālamīn. Ar-Raḥmānir-Raḥīm. Māliki Yaumid-Dīn. Iyyāka Na‘Budu Wa Iyyāka Nasta‘Īn. Ihdinaṣ-Ṣirāṭal-Mustaqīm. Ṣirāṭallażīna An‘Amta ‘Alaihim, Gairil-Magḍūbi ‘Alaihim Wa Laḍ-Ḍāllīn",
      translation: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani. Segala puji tertentu bagi Allah, Tuhan yang memelihara dan Mentadbirkan Alam. Yang Maha Pemurah, lagi Maha Mengasihani. Yang Menguasai pemerintahan hari Pembalasan (hari Akhirat). Engkaulah sahaja (Ya Allah) Yang Kami Sembah dan kepada Engkaulah sahaja kami memohon pertolongan. Tunjukkan kami jalan yang lurus. Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang Engkau telah murkai dan bukan pula (jalan) orang-orang yang sesat."
  },
  {
      title: "2. Surah Al-Ikhlas (3x)",
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
      latin: "Qul Huwallāhu Aḥad. Allāhuṣ-Ṣamad. Lam Yalid Wa Lam Yūlad. Wa Lam Yakul Lahū Kufuwan Aḥad (3 Kali)",
      translation: "Katakanlah: 'Dialah Allah yang maha esa. Allah adalah tuhan tempat bergantung oleh segala sesuatu. Dia tidak beranak dan tidak diperanakkan. Dan tidak ada seorangpun yang setara dengan-Nya.' (3 kali)."
  },
  {
      title: "3. Tahlil & Takbir",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lā ilāha illallāhu wallāhu akbar",
      translation: "Tiada Tuhan melainkan Allah, dan Allah Maha Besar."
  },
  {
      title: "4. Surah Al-Falaq",
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾",
      latin: "Qul A‘Ūżu Birabbil-Falaq. Min Syarri Mā Khalaq. Wa Min Syarri Gāsiqin Iżā Waqab. Wa Min Syarrin-Naffāṡāti Fil-‘Uqad. Wa Min Syarri Ḥāsidin Iżā Ḥasad",
      translation: "Katakanlah, 'Aku berlindung kepada tuhan yang menguasai waktu subuh dari kejahatan makhluk-Nya. Dari kejahatan malam apabila telah gelap gelita. Dan dari kejahatan makhluk yang menghembus pada simpulan; Dan dari kejahatan orang yang dengki apabila ia mendengki.'"
  },
  {
      title: "5. Tahlil & Takbir",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lā ilāha illallāhu wallāhu akbar",
      translation: "Tiada Tuhan melainkan Allah, dan Allah Maha Besar."
  },
  {
      title: "6. Surah An-Nas",
      arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾",
      latin: "Qul A‘Ūżu Birabbin-Nās. Malikin-Nās. Ilāhin-Nās. Min Syarril-Waswāsil-Khannās. Allażī Yuwaswisu Fī Ṣudūrin-Nās. Minal Jinnati Wan-Nās",
      translation: "Katakanlah: 'Aku berlindung kepada (Allah) Pemulihara sekalian manusia. Yang Menguasai sekalian manusia, Tuhan yang berhak disembah oleh sekalian manusia, dari kejahatan pembisik penghasut yang timbul tenggelam, yang membisikkan ke dalam hati manusia, dari kalangan jin dan manusia'."
  },
  {
      title: "7. Tahlil & Takbir",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lā ilāha illallāhu wallāhu akbar",
      translation: "Tiada Tuhan melainkan Allah, dan Allah Maha Besar."
  },
  {
      title: "8. Surah Al-Fatihah",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾",
      latin: "Bismillāhir-Raḥmānir-Raḥīm. Al-Ḥamdu Lillāhi Rabbil-‘Ālamīn. Ar-Raḥmānir-Raḥīm. Māliki Yaumid-Dīn. Iyyāka Na‘Budu Wa Iyyāka Nasta‘Īn. Ihdinaṣ-Ṣirāṭal-Mustaqīm. Ṣirāṭallażīna An‘Amta ‘Alaihim, Gairil-Magḍūbi ‘Alaihim Wa Laḍ-Ḍāllīn",
      translation: "Membaca Surah Al-Fatihah sebagai permulaan doa dan keberkatan bagi arwah."
  },
  {
      title: "9. Al-Baqarah (Ayat 1-5)",
      arabic: "الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ﴿٢﴾ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٣﴾ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٤﴾ أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ ﴿٥﴾",
      latin: "Alif Lām Mīm. Żālikal-Kitābu Lā Raiba Fīh, Hudal Lil-Muttaqīn. Allażīna Yu’minūna Bil-Gaibi Wa Yuqīmūnaṣ-Ṣalāta Wa Mimmā Razaqnāhum Yunfiqūn. Wallażīna Yu’minūna Bimā Unzila Ilaika Wa Mā Unzila Min Qablik, Wa Bil-Ākhirati Hum Yūqinūn. Ulā’ika ‘Alā Hudam Mir Rabbihim Wa Ulā’ika Humul-Mufliḥūn",
      translation: "Alif lam mim. Kitab Al-Quran ini tidak ada sebarang keraguan padanya; ia menjadi petunjuk bagi orang yang bertaqwa. Iaitu mereka yang beriman kepada perkara ghaib, mendirikan solat, dan menafkahkan sebahagian rezeki. Dan mereka yang beriman kepada kitab diturunkan kepadamu dan kitab terdahulu, serta yakin akan hari akhirat. Merekalah yang mendapat petunjuk dari Tuhannya dan merekalah orang yang beruntung."
  },
  {
      title: "10. Al-Baqarah (Ayat 163)",
      arabic: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
      latin: "Wa ilaahukum ilaahuw Waahid, Laa ilaaha illaa Huwar-Rahmaanur-rahiim",
      translation: "Dan Tuhan kamu ialah Tuhan Yang Maha Esa; tiada Tuhan melainkan Dia, Yang Maha Pemurah, lagi Maha Mengasihani."
  },
  {
      title: "11. Ayat Kursi (Al-Baqarah 255)",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      latin: "Allāhu Lā Ilāha Illā Huw, Al-Ḥayyul-Qayyūm, Lā Ta’khużuhū Sinatuw Wa Lā Naum, Lahū Mā Fis-Samāwāti Wa Mā Fil-Arḍ, Man Żallażī Yasyfa‘U ‘Indahū Illā Bi’iżnih, Ya‘Lamu Mā Baina Aidīhim Wa Mā Khalfahum, Wa Lā Yuḥīṭūna Bisyai’im Min ‘Ilmihī Illā Bimā Syā’, Wasi‘A Kursiyyuhus-Samāwāti Wal-Arḍ, Wa Lā Ya’ūduhū Ḥifẓuhumā, Wa Huwal-‘Aliyyul-‘Aẓīm",
      translation: "Allah, tiada Tuhan melainkan Dia Yang Hidup kekal lagi terus menerus mengurus makhluk-Nya. Tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan di bumi. Tiada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan dan di belakang mereka. Kursi Allah meliputi langit dan bumi. Dia tidak merasa berat menjaga keduanya. Dia Maha Tinggi lagi Maha Agung."
  },
  {
      title: "12. Al-Baqarah (Ayat 284-286)",
      arabic: "لِّلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ... آمَنَ الرَّسُولُ... لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا...",
      latin: "Lillāhi Mā Fis-Samāwāti Wa Mā Fil-Arḍ... Āmanar-Rasūlu... Lā Yukallifullāhu Nafsan Illā Wus‘Ahā...",
      translation: "Segala yang ada di langit dan bumi adalah kepunyaan Allah... (Hingga akhir surah Al-Baqarah) Allah tidak membebani seseorang melainkan sesuai kesanggupannya..."
  },
  {
      title: "15. Hud (Ayat 73) & Zikir",
      arabic: "يَا أَرْحَمَ الرَّاحِمِينَ ارْحَمْنَا (٣) رَحْمَتُ اللَّهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ ۚ إِنَّهُ حَمِيدٌ مَّجِيدٌ",
      latin: "Yaa Arhamar-Raahimiin IrHamna (3x). Rahmatullaahi Wa Barakaatuhuu ‘Alaykum Ahlal-Bayt, innahuu HamiiDum-Majiid",
      translation: "Wahai Tuhan Yang Maha Pengasih, kasihani kami (3x). Rahmat Allah dan keberkatan-Nya melimpah ke atas kamu sekalian wahai ahli bait. Sesungguhnya Allah Maha Terpuji lagi Maha Mulia."
  },
  {
      title: "16. Al-Ahzab (Ayat 33)",
      arabic: "إِنَّمَا يُرِيدُ اللَّهُ لِيُذْهِبَ عَنكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيرًا",
      latin: "InnaMaa YuriiDullahu Liyudz-hiba ‘Ankumur-Rijsa Ahlal-bayt Wa YuThahHiraKum That-Hiiraa",
      translation: "Sesungguhnya Allah bermaksud hendak menghilangkan dosa dari kamu, wahai ahlul bait dan membersihkan kamu sebersih-bersihnya."
  },
  {
      title: "17. Al-Ahzab (Ayat 56)",
      arabic: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
      latin: "Innallaaha Wa Malaa’ikatahuu YuSolluuNa ‘Alan-Nabiyy, Yaa AyyuHalLaziina AamaNuu Sollu ‘Alaihi Wa SalliMuu TasLiiMaa",
      translation: "Sesungguhnya Allah dan para malaikat-Nya berselawat untuk nabi. Wahai orang-orang yang beriman, berselawatlah kamu untuknya dan ucapkanlah salam penghormatan kepadanya."
  }
];

// --- Fungsi Paparan ---
let currentFontSize = 1.8;

function renderTahlil() {
    const container = document.getElementById('tahlil-content');
    if (!container) return;

    let html = '';
    tahlilData.forEach((item) => {
        html += `
            <div class="tahlil-item animate__animated animate__fadeIn mb-4 shadow-sm">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-success rounded-pill px-3">${item.title}</span>
                </div>
                <div class="arabic-text text-end mb-4" style="font-size: ${currentFontSize}rem;">
                    ${item.arabic}
                </div>
                <div class="latin-text mb-3">
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

window.adjustFont = function(step) {
    currentFontSize += step * 0.2;
    if (currentFontSize < 1.2) currentFontSize = 1.2;
    if (currentFontSize > 3.5) currentFontSize = 3.5;
    renderTahlil();
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderTahlil, 300);
});