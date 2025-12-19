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
        desc: "Perjalanan agung ke Baitul Maqdis dan langit ketujuh.", 
        icon: "fa-star-and-crescent", 
        color: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
        isNovel: true, 
        scenes: [
            { 
                img: "assets/sirah1.jpg", 
                text: `Tahun itu dikenali sebagai Amul Huzni (Tahun Kesedihan). Rasulullah SAW baru sahaja kehilangan penyokong kuatnya, Abu Talib, dan permaisuri hatinya, Khadijah binti Khuwailid. Di tengah tekanan kaum Quraisy yang semakin hebat, Allah SWT ingin menghiburkan kekasih-Nya dengan satu jemputan protokol diraja ke langit.
    
                Pada malam yang tenang, sedang baginda berbaring di antara tidur dan jaga di kawasan Hijir Ismail, Malaikat Jibril AS datang. Dada baginda dibelah, hati baginda dicuci dengan air Zamzam, lalu dituangkan iman dan hikmah ke dalamnya.` 
            },
            { 
                img: "assets/sirah2.jpg", 
                text: `Di hadapan baginda, berdirilah seiras makhluk putih yang dipanggil Buraq. Saiznya lebih besar daripada keldai tetapi lebih kecil daripada bagal. Dengan satu langkah yang sejauh mata memandang, Buraq membawa Rasulullah dari Masjidil Haram di Makkah ke Masjidil Aqsa di Palestin dalam sekelip mata.
  
                Di Masjidil Aqsa, satu pemandangan menakjubkan menanti. Roh para Nabi terdahulu berkumpul, dan Rasulullah SAW berdiri di hadapan sebagai Imam, memimpin solat berjemaah.` 
            },
            { 
                img: "assets/sirah3.jpg", 
                text: `Dari Masjidil Aqsa, satu tangga cahaya (al-Mirqat) diturunkan. Rasulullah menembusi lapisan langit dan bertemu para Nabi:
                
                Langit 1: Nabi Adam AS.
                Langit 2: Nabi Yahya AS & Nabi Isa AS.
                Langit 3: Nabi Yusuf AS.
                Langit 4: Nabi Idris AS.
                Langit 5: Nabi Harun AS.
                Langit 6: Nabi Musa AS.
                Langit 7: Nabi Ibrahim AS bersandar di Baitul Ma'mur.` 
            },
            { 
                img: "assets/sirah4.jpg", 
                text: `Jibril membawa Rasulullah ke Sidratul Muntaha. Di sini, Jibril berhenti kerana tidak mampu melepasi sempadan keagungan Allah. 
                
                Rasulullah meneruskan seorang diri menghadap Allah SWT dan menerima perintah solat 50 waktu. Setelah berulang-alik atas nasihat Nabi Musa AS, akhirnya Allah menetapkan solat 5 waktu sehari semalam.` 
            }
        ]
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
        { id: 3, title: "Nabi Nuh AS", desc: "Membina bahtera besar untuk menyelamatkan orang beriman.", content: "Selama 950 tahun berdakwah, hanya sedikit yang beriman. Allah memerintahkan pembinaan bahtera sebelum banjir besar melanda.", icon: "fa-ship", color: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)" },
        { id: 6, title: "Nabi Ibrahim AS", desc: "Bapa para Nabi yang tidak hangus dibakar api.", content: "Beliau membina Kaabah bersama anaknya Nabi Ismail dan merupakan tokoh utama dalam pensyariatan ibadah korban dan haji.", icon: "fa-fire", color: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
        { id: 11, title: "Nabi Yusuf AS", desc: "Nabi yang memiliki ketampanan luar biasa.", content: "Dibuang ke perigi oleh saudaranya, dipenjara, dan akhirnya menjadi menteri di Mesir.", icon: "fa-crown", color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
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
          const modalDialog = document.getElementById('modalDialog');
          const modalContent = document.getElementById('modalContent');
          
          if (story.isNovel) {
            modalDialog.classList.add('modal-xl');
            modalContent.innerHTML = `
                <div id="novelCarousel" class="carousel slide" data-bs-interval="false">
                    <div class="carousel-inner">
                        ${story.scenes.map((scene, i) => `
                            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                                <div class="row g-0 bg-white">
                                    <div class="col-lg-7 bg-dark novel-img-container">
                                        <img src="assets/${scene.img}" class="w-100 h-100" style="object-fit: cover;" onerror="this.src='https://placehold.co/800x600?text=Imej+Tidak+Ditemui'">
                                    </div>
                                    <div class="col-lg-5 novel-text-container">
                                        <div class="p-4 mb-4">
                                            <span class="badge bg-success mb-2">Bahagian ${i + 1} / ${story.scenes.length}</span>
                                            <p class="story-text" style="white-space: pre-line;">${scene.text}</p>
                                        </div>
                                        <div class="d-flex justify-content-between mt-auto p-4">
                                            <button class="btn btn-outline-secondary btn-sm rounded-pill" data-bs-target="#novelCarousel" data-bs-slide="prev" ${i === 0 ? 'disabled' : ''}>Sebelumnya</button>
                                            <button class="btn btn-success btn-sm rounded-pill" data-bs-target="#novelCarousel" data-bs-slide="next">
                                                ${i === story.scenes.length - 1 ? 'Selesai' : 'Seterusnya'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
              `;
          } else {
              modalDialog.classList.remove('modal-xl');
              modalContent.innerHTML = `
                  <div class="p-4">
                      <p style="font-size: 1.15rem; line-height: 1.8; color: #444;">${story.content}</p>
                  </div>
              `;
          }
  
          document.getElementById('modalTitle').innerText = story.title;
          const modalIcon = document.getElementById('modalIcon');
          modalIcon.style.background = story.color;
          modalIcon.innerHTML = `<i class="fas ${story.icon}"></i>`;
  
          const myModal = new bootstrap.Modal(document.getElementById('readModal'));
          myModal.show();
      }
  }
  
  // Carian
  document.getElementById('searchInput').addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.story-card');
    cards.forEach(card => {
        const title = card.querySelector('.card-title-text').innerText.toLowerCase();
        card.style.display = title.includes(term) ? "block" : "none";
    });
  });
  
  document.addEventListener('DOMContentLoaded', renderAllStories);

