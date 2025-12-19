/**
 * DATA SIRAH & PARA NABI
 * Disusun secara sistematik untuk paparan dinamik
 */

 const sirahData = {
  nabawiyah: [
      { 
          id: 101, 
          title: "Tahun Gajah", 
          desc: "Peristiwa kelahiran Nabi Muhammad SAW dan serangan tentera Abrahah.", 
          content: "Nabi Muhammad SAW dilahirkan pada 12 Rabiulawal Tahun Gajah. Pada tahun tersebut, Raja Abrahah dari Yaman cuba menyerang Kaabah dengan tentera bergajah, namun Allah SWT menghantar burung Ababil untuk memusnahkan mereka dengan batu dari neraka.",
          icon: "fa-elephant", 
          color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
      },
      { 
          id: 102, 
          title: "Wahyu Pertama", 
          desc: "Permulaan kerasulan Baginda di Gua Hira' melalui Malaikat Jibril.", 
          content: "Ketika Baginda berusia 40 tahun, Malaikat Jibril datang membawa wahyu pertama (Surah Al-Alaq: 1-5). Peristiwa ini berlaku di Gua Hira' dan menandakan bermulanya tugas dakwah Baginda sebagai Rasulullah SAW.",
          icon: "fa-dove", 
          color: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)" 
      },
      { 
          id: 103, 
          title: "Isra' & Mi'raj", 
          desc: "Perjalanan agung ke Baitul Maqdis dan langit ketujuh dalam satu malam.", 
          content: "Baginda Rasulullah SAW dibawa menunggang Buraq dari Masjidil Haram ke Masjidil Aqsa, kemudian naik ke Sidratul Muntaha untuk menerima perintah solat lima waktu secara langsung daripada Allah SWT.",
          icon: "fa-star-and-crescent", 
          color: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)" 
      },
      { 
          id: 104, 
          title: "Hijrah Madinah", 
          desc: "Perpindahan besar umat Islam yang membina tamadun baru di Madinah.", 
          content: "Baginda berhijrah bersama Saidina Abu Bakar As-Siddiq. Di Madinah, Baginda membina Masjid Quba, Masjid Nabawi, dan mempersaudarakan kaum Muhajirin dan Ansar bagi membentuk negara Islam yang pertama.",
          icon: "fa-mosque", 
          color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" 
      }
  ],
  paraNabi: [
      { id: 1, title: "Nabi Adam AS", desc: "Manusia pertama yang diciptakan Allah SWT.", content: "Nabi Adam diciptakan daripada tanah dan ditempatkan di Syurga sebelum diturunkan ke bumi bersama Hawa sebagai khalifah pertama.", icon: "fa-seedling", color: "linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)" },
      { id: 2, title: "Nabi Idris AS", desc: "Nabi pertama yang pandai menulis dan menjahit.", content: "Beliau terkenal dengan ketaatan yang sangat tinggi sehingga Allah SWT mengangkat kedudukannya ke langit.", icon: "fa-pen-nib", color: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)" },
      { id: 3, title: "Nabi Nuh AS", desc: "Membina bahtera besar untuk menyelamatkan orang beriman.", content: "Selama 950 tahun berdakwah, hanya sedikit yang beriman. Allah memerintahkan pembinaan bahtera sebelum banjir besar melanda.", icon: "fa-ship", color: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)" },
      { id: 6, title: "Nabi Ibrahim AS", desc: "Bapa para Nabi yang tidak hangus dibakar api.", content: "Beliau membina Kaabah bersama anaknya Nabi Ismail dan merupakan tokoh utama dalam pensyariatan ibadah korban dan haji.", icon: "fa-fire", color: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
      { id: 11, title: "Nabi Yusuf AS", desc: "Nabi yang memiliki ketampanan luar biasa.", content: "Dibuang ke perigi oleh saudaranya, dipenjara, dan akhirnya menjadi menteri di Mesir. Kisahnya disebut sebagai sebaik-baik kisah dalam Al-Quran.", icon: "fa-crown", color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
      { id: 14, title: "Nabi Musa AS", desc: "Mukjizat membelah laut dan melawan Firaun.", content: "Menerima kitab Taurat di Bukit Sina dan memimpin Bani Israil keluar dari kezaliman Firaun di Mesir.", icon: "fa-scroll", color: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)" },
      { id: 18, title: "Nabi Sulaiman AS", desc: "Nabi yang memerintah manusia, jin, dan haiwan.", content: "Memiliki kekayaan luar biasa dan boleh bercakap dengan haiwan seperti semut dan burung Hud-hud.", icon: "fa-gem", color: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)" },
      { id: 21, title: "Nabi Yunus AS", desc: "Ditelan oleh ikan paus yang sangat besar.", content: "Beliau bertaubat di dalam perut ikan dengan zikir 'La ilaha illa anta subhanaka inni kuntu minadzolimin' sehingga Allah menyelamatkannya.", icon: "fa-fish", color: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" },
      { id: 24, title: "Nabi Isa AS", desc: "Lahir tanpa bapa dan boleh bercakap semasa bayi.", content: "Menerima kitab Injil, boleh menyembuhkan orang buta dan menghidupkan orang mati dengan izin Allah.", icon: "fa-hand-holding-heart", color: "linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)" },
      { id: 25, title: "Nabi Muhammad SAW", desc: "Penutup segala Nabi dan Rasul.", content: "Membawa rahmat ke seluruh alam dan menyampaikan Al-Quran sebagai mukjizat terbesar hingga hari kiamat.", icon: "fa-kaaba", color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }
  ]
};

/**
* RENDER KAD KISAH
*/
function renderAllStories() {
  const nabContainer = document.getElementById('nabawiyah-container');
  const nabiContainer = document.getElementById('para-nabi-container');

  if (nabContainer) {
      nabContainer.innerHTML = sirahData.nabawiyah.map((item, index) => createCardHTML(item, index, 'nabawiyah')).join('');
  }
  
  if (nabiContainer) {
      nabiContainer.innerHTML = sirahData.paraNabi.map((item, index) => createCardHTML(item, index, 'paraNabi')).join('');
  }
}

function createCardHTML(item, index, type) {
  return `
      <div class="col-lg-4 col-md-6 animate__animated animate__fadeInUp story-card" data-type="${type}" style="animation-delay: ${index * 0.05}s">
          <div class="card sirah-card h-100 shadow-sm border-0">
              <div class="card-body p-4 text-center">
                  <div class="icon-circle mb-3 mx-auto shadow-sm" style="background: ${item.color}; width: 70px; height: 70px; border-radius: 20px; color: white; display: flex; align-items: center; justify-content: center;">
                      <i class="fas ${item.icon} fa-2x"></i>
                  </div>
                  <h5 class="fw-bold card-title-text mb-2">${item.title}</h5>
                  <p class="text-muted small mb-0">${item.desc}</p>
              </div>
              <div class="card-footer bg-transparent border-0 p-4 pt-0">
                  <button onclick="openStoryModal('${type}', ${item.id})" class="btn btn-success w-100 rounded-pill shadow-sm py-2">
                      Baca Kisah <i class="fas fa-book-open ms-2 small"></i>
                  </button>
              </div>
          </div>
      </div>
  `;
}

/**
* LOGIK MODAL
*/
function openStoryModal(type, id) {
  const dataSet = sirahData[type];
  const story = dataSet.find(s => s.id === id);

  if (story) {
      document.getElementById('modalTitle').innerText = story.title;
      document.getElementById('modalContent').innerHTML = `<p>${story.content}</p>`;
      
      const modalIcon = document.getElementById('modalIcon');
      modalIcon.style.background = story.color;
      modalIcon.style.color = 'white';
      modalIcon.innerHTML = `<i class="fas ${story.icon}"></i>`;

      const myModal = new bootstrap.Modal(document.getElementById('readModal'));
      myModal.show();
  }
}

/**
* FUNGSI CARIAN (Search)
*/
document.getElementById('searchInput').addEventListener('input', function(e) {
  const term = e.target.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.story-card');
  let hasResults = false;

  cards.forEach(card => {
      const title = card.querySelector('.card-title-text').innerText.toLowerCase();
      if (title.includes(term)) {
          card.classList.remove('d-none');
          hasResults = true;
      } else {
          card.classList.add('d-none');
      }
  });

  const noResults = document.getElementById('noResults');
  if (hasResults) {
      noResults.classList.add('d-none');
  } else {
      noResults.classList.remove('d-none');
  }
});

// Jalankan fungsi
document.addEventListener('DOMContentLoaded', renderAllStories);