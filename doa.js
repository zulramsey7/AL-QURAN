/**
 * Fail: doa.js
 * Deskripsi: Menguruskan data Doa Harian dengan fungsi carian masa-nyata
 */

 let allDoa = [];

 async function loadDoa() {
     const doaList = document.getElementById('doa-list');
     const loadingSpinner = document.getElementById('loading-spinner');
     const doaContent = document.getElementById('doa-content');
 
     // 1. Semak LocalStorage (Offline Mode First)
     const cachedDoa = localStorage.getItem('doa_harian_data');
 
     if (cachedDoa) {
         console.log("Memuatkan doa dari cache...");
         allDoa = JSON.parse(cachedDoa);
         displayDoa(allDoa);
         finalizeUI();
     } else {
         try {
             console.log("Mengambil data doa baru...");
             const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian');
             const result = await response.json();
             
             // Bergantung kepada struktur API, kita ambil result.data atau result sahaja
             allDoa = result.data || result;
 
             // Simpan untuk kegunaan offline
             localStorage.setItem('doa_harian_data', JSON.stringify(allDoa));
             displayDoa(allDoa);
             finalizeUI();
         } catch (error) {
             console.error("Ralat API Doa:", error);
             doaList.innerHTML = `
                 <div class="col-12 text-center py-5">
                     <div class="alert alert-warning border-0 shadow-sm rounded-4 p-4">
                         <i class="fas fa-wifi-slash mb-3 fa-2x"></i><br>
                         <h6 class="fw-bold">Sambungan Gagal</h6>
                         <p class="small mb-0 text-muted">Data doa tidak dapat dimuatkan. Sila pastikan anda mempunyai akses internet untuk muat turun pertama kali.</p>
                         <button onclick="location.reload()" class="btn btn-sm btn-success mt-3 rounded-pill px-4">Cuba Lagi</button>
                     </div>
                 </div>`;
             loadingSpinner.classList.add('d-none');
             doaContent.classList.remove('d-none');
         }
     }
 
     function finalizeUI() {
         loadingSpinner.classList.add('d-none');
         doaContent.classList.remove('d-none');
     }
 }
 
 /**
  * Memaparkan senarai doa ke dalam grid
  */
 function displayDoa(data) {
     const list = document.getElementById('doa-list');
     const noResults = document.getElementById('no-results');
     
     list.innerHTML = '';
 
     if (!data || data.length === 0) {
         noResults.classList.remove('d-none');
         return;
     } else {
         noResults.classList.add('d-none');
     }
 
     data.forEach((doa, index) => {
         const cardHTML = `
             <div class="col-md-6 col-lg-4 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.03}s">
                 <div class="card doa-card shadow-sm h-100">
                     <div class="card-body p-4 d-flex flex-column">
                         <div class="mb-3">
                             <span class="badge bg-success-subtle text-success rounded-pill px-3 py-2 small mb-2">Doa Harian</span>
                             <h5 class="fw-bold mb-0" style="color: var(--primary-color);">${doa.title}</h5>
                         </div>
                         
                         <div class="arabic-text text-end mb-3">
                             ${doa.arabic}
                         </div>
                         
                         <div class="latin-text mb-3">
                             ${doa.latin}
                         </div>
                         
                         <div class="translation-text mt-auto">
                             <small class="text-uppercase fw-bold text-muted d-block mb-1" style="letter-spacing: 1px; font-size: 0.7rem;">Maksud:</small>
                             ${doa.translation}
                         </div>
                     </div>
                 </div>
             </div>
         `;
         list.innerHTML += cardHTML;
     });
 }
 
 /**
  * Logik Fungsi Carian Masa-Nyata
  */
 document.getElementById('search-doa').addEventListener('input', function(e) {
     const keyword = e.target.value.toLowerCase().trim();
     
     // Tapis berdasarkan Tajuk atau Maksud
     const filtered = allDoa.filter(doa => 
         doa.title.toLowerCase().includes(keyword) || 
         doa.translation.toLowerCase().includes(keyword)
     );
     
     displayDoa(filtered);
 });
 
 // Jalankan fungsi utama
 document.addEventListener('DOMContentLoaded', loadDoa);