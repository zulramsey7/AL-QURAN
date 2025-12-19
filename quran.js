/**
 * Fail: quran.js
 * Deskripsi: Menguruskan senarai 114 Surah dari API equran.id v2 dengan sistem caching
 */

 let surahData = [];

 /**
  * Fungsi utama untuk mengambil senarai surah
  */
 async function getSurahList() {
     const loadingSpinner = document.getElementById('loading-quran');
     const surahContainer = document.getElementById('surah-container');
     const surahList = document.getElementById('surah-list');
 
     // 1. SEMAK CACHE (OFFLINE FIRST)
     const cachedSurah = localStorage.getItem('quran_surah_list');
 
     if (cachedSurah) {
         console.log("Memuatkan senarai surah dari cache...");
         surahData = JSON.parse(cachedSurah);
         displaySurah(surahData);
         finalizeUI();
     } else {
         console.log("Mengambil senarai surah baru dari API...");
         try {
             const response = await fetch('https://equran.id/api/v2/surat');
             if (!response.ok) throw new Error('Respon API gagal');
             
             const result = await response.json();
             surahData = result.data;
 
             // Simpan ke LocalStorage
             localStorage.setItem('quran_surah_list', JSON.stringify(surahData));
             
             displaySurah(surahData);
             finalizeUI();
         } catch (error) {
             console.error("Ralat:", error);
             surahList.innerHTML = `
                 <div class="col-12 text-center py-5">
                     <div class="alert alert-danger border-0 shadow-sm rounded-4 p-4">
                         <i class="fas fa-exclamation-circle mb-3 fa-2x"></i><br>
                         <h6 class="fw-bold">Gagal Memuatkan Senarai Surah</h6>
                         <p class="small mb-0 text-muted">Sila pastikan internet anda aktif untuk percubaan pertama.</p>
                         <button onclick="location.reload()" class="btn btn-sm btn-success mt-3 rounded-pill px-4">Cuba Lagi</button>
                     </div>
                 </div>`;
             loadingSpinner.classList.add('d-none');
             surahContainer.classList.remove('d-none');
         }
     }
 
     function finalizeUI() {
         loadingSpinner.classList.add('d-none');
         surahContainer.classList.remove('d-none');
         surahList.classList.remove('d-none');
     }
 }
 
 /**
  * Memaparkan data surah ke dalam grid HTML
  */
 function displaySurah(data) {
     const list = document.getElementById('surah-list');
     const noSurah = document.getElementById('no-surah');
     
     list.innerHTML = '';
 
     if (data.length === 0) {
         noSurah.classList.remove('d-none');
         return;
     } else {
         noSurah.classList.add('d-none');
     }
 
     data.forEach((s, index) => {
         // Tentukan label tempat turun surah
         const place = s.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyyah';
         const badgeClass = s.tempatTurun === 'Mekah' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success';
 
         const cardHTML = `
             <div class="col-md-6 col-lg-4 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.02}s">
                 <a href="surah.html?no=${s.nomor}" class="surah-card p-3 h-100 text-decoration-none">
                     <div class="d-flex align-items-center justify-content-between">
                         <div class="d-flex align-items-center">
                             <div class="surah-no me-3 shadow-sm">${s.nomor}</div>
                             <div>
                                 <h6 class="fw-bold mb-0 text-dark">${s.namaLatin}</h6>
                                 <div class="d-flex align-items-center mt-1">
                                     <span class="type-badge me-2" style="font-size: 0.65rem;">${place}</span>
                                     <small class="text-muted small">${s.jumlahAyat} Ayat</small>
                                 </div>
                             </div>
                         </div>
                         <div class="text-end">
                             <div class="arabic-name">${s.nama}</div>
                             <small class="text-muted d-block" style="font-size: 0.7rem;">${s.arti}</small>
                         </div>
                     </div>
                 </a>
             </div>
         `;
         list.innerHTML += cardHTML;
     });
 }
 
 /**
  * Fungsi Carian Real-time
  */
 document.getElementById('search-surah').addEventListener('input', (e) => {
     const term = e.target.value.toLowerCase().trim();
     
     // Cari berdasarkan nama rumi, maksud, atau nombor surah
     const filtered = surahData.filter(s => 
         s.namaLatin.toLowerCase().includes(term) || 
         s.arti.toLowerCase().includes(term) ||
         s.nomor.toString() === term
     );
     
     displaySurah(filtered);
 });
 
 // Jalankan fungsi apabila halaman siap dimuatkan
 document.addEventListener('DOMContentLoaded', getSurahList);