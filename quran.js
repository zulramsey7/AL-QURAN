/**
 * Fail: quran.js
 * Deskripsi: Menguruskan senarai 114 Surah dengan sistem FORCE CACHE REFRESH
 */

 let surahData = [];

 async function getSurahList() {
     const loadingSpinner = document.getElementById('loading-quran');
     const surahContainer = document.getElementById('surah-container');
     const surahList = document.getElementById('surah-list');
 
     // --- TAMBAHAN: Padam cache lama jika format tidak padan ---
     const cacheVersion = "v2.1"; // Tukar versi ini jika anda buat perubahan besar
     if (localStorage.getItem('quran_version') !== cacheVersion) {
         localStorage.clear();
         localStorage.setItem('quran_version', cacheVersion);
     }
 
     const cachedSurah = localStorage.getItem('quran_surah_list');
 
     if (cachedSurah) {
         console.log("Memuatkan dari cache...");
         surahData = JSON.parse(cachedSurah);
         displaySurah(surahData);
         finalizeUI();
     } else {
         try {
             const response = await fetch('https://equran.id/api/v2/surat');
             const result = await response.json();
             
             // Pastikan data wujud sebelum simpan
             if (result.data) {
                 surahData = result.data;
                 localStorage.setItem('quran_surah_list', JSON.stringify(surahData));
                 displaySurah(surahData);
                 finalizeUI();
             }
         } catch (error) {
             console.error("Ralat API:", error);
             // Paparkan mesej ralat jika gagal
         }
     }
 
     function finalizeUI() {
         if (loadingSpinner) loadingSpinner.classList.add('d-none');
         if (surahContainer) surahContainer.classList.remove('d-none');
         if (surahList) surahList.classList.remove('d-none');
     }
 }
 
 function displaySurah(data) {
     const list = document.getElementById('surah-list');
     if (!list) return;
     list.innerHTML = '';
 
     data.forEach((s, index) => {
         const place = s.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyyah';
 
         // Pastikan kita guna property yang betul dari API equran.id v2
         // s.nama = Tulisan Arab
         // s.namaLatin = Nama Surah
         // s.arti = Maksud
         
         const cardHTML = `
             <div class="col-md-6 col-lg-4 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.01}s">
                 <a href="surah.html?no=${s.nomor}" class="surah-card p-3 h-100 text-decoration-none d-block">
                     <div class="d-flex align-items-center justify-content-between">
                         <div class="d-flex align-items-center">
                             <div class="surah-no me-3 shadow-sm">${s.nomor}</div>
                             <div>
                                 <h6 class="fw-bold mb-0 text-dark">${s.namaLatin}</h6>
                                 <div class="d-flex align-items-center mt-1">
                                     <span class="type-badge me-2" style="font-size: 0.65rem; background: #e9ecef; padding: 2px 8px; border-radius: 10px;">${place}</span>
                                     <small class="text-muted small">${s.jumlahAyat} Ayat</small>
                                 </div>
                             </div>
                         </div>
                         <div class="text-end">
                             <div class="arabic-name" style="font-family: 'Uthman-Taha', serif !important;">${s.nama}</div>
                             <small class="text-muted d-block" style="font-size: 0.7rem;">${s.arti}</small>
                         </div>
                     </div>
                 </a>
             </div>
         `;
         list.insertAdjacentHTML('beforeend', cardHTML);
     });
 }
 
 // ... (Kekalkan fungsi carian anda di bawah)
 /**
  * Fungsi Carian Real-time
  */
 const searchInput = document.getElementById('search-surah');
 if (searchInput) {
     searchInput.addEventListener('input', (e) => {
         const term = e.target.value.toLowerCase().trim();
         
         const filtered = surahData.filter(s => 
             s.namaLatin.toLowerCase().includes(term) || 
             s.arti.toLowerCase().includes(term) ||
             s.nomor.toString() === term
         );
         
         displaySurah(filtered);
     });
 }
 
 // Jalankan fungsi apabila halaman siap dimuatkan
 document.addEventListener('DOMContentLoaded', getSurahList);
