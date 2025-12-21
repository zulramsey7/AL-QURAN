/**
 * DATA SIRAH & PARA NABI - QuranDigital2025
 */

const sirahData = {
    nabawiyah: [
      { 
          id: 101, 
          title: "Tahun Gajah", 
          content: "Nabi Muhammad SAW dilahirkan pada 12 Rabiulawal Tahun Gajah. Raja Abrahah cuba menyerang Kaabah dengan tentera bergajah, namun Allah SWT menghantar burung Ababil untuk memusnahkan mereka.",
          icon: "fa-elephant", 
          color: "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)" 
      },
      { 
          id: 102, 
          title: "Wahyu Pertama", 
          content: "Ketika Baginda berusia 40 tahun, Malaikat Jibril datang membawa wahyu pertama (Surah Al-Alaq: 1-5) di Gua Hira'. Ini menandakan bermulanya tugas dakwah Baginda sebagai Rasulullah SAW.",
          icon: "fa-dove", 
          color: "linear-gradient(135deg, #40916c 0%, #2d6a4f 100%)" 
      },
      { 
        id: 103, 
        title: "Isra' & Mi'raj", 
        icon: "fa-star-and-crescent", 
        color: "linear-gradient(135deg, #d4a373 0%, #b08968 100%)",
        isNovel: true, 
        scenes: [
            { img: "sirah1.png", text: "Tahun Kesedihan. Allah menghiburkan Rasulullah SAW dengan jemputan ke langit selepas pemergian Abu Talib & Khadijah." },
            { img: "sirah2.png", text: "Buraq membawa Rasulullah ke Masjidil Aqsa. Di sana, Baginda mengimamkan solat bersama para Nabi." },
            { img: "sirah4.png", text: "Rasulullah naik ke Sidratul Muntaha dan menerima perintah solat lima waktu secara langsung daripada Allah SWT." }
        ]
      },
      { 
          id: 104, 
          title: "Hijrah Madinah", 
          content: "Baginda berhijrah bersama Abu Bakar As-Siddiq. Di Madinah, Baginda membina Masjid Nabawi dan mempersaudarakan kaum Muhajirin dan Ansar.",
          icon: "fa-mosque", 
          color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" 
      }
    ],
    paraNabi: [
        { id: 1, title: "Nabi Adam AS", content: "Manusia pertama yang diciptakan Allah daripada tanah dan ditempatkan di Syurga sebelum diturunkan ke bumi sebagai khalifah pertama.", icon: "fa-seedling", color: "linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)" },
        { id: 2, title: "Nabi Idris AS", content: "Nabi yang sangat rajin belajar dan orang pertama yang pandai menulis menggunakan kalam (pena) serta menjahit pakaian.", icon: "fa-pen-nib", color: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" },
        { id: 3, title: "Nabi Nuh AS", content: "Nabi yang membina bahtera besar atas perintah Allah untuk menyelamatkan orang beriman daripada banjir besar melanda dunia.", icon: "fa-ship", color: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)" },
        { id: 4, title: "Nabi Hud AS", content: "Nabi yang diutus kepada kaum 'Ad yang sombong dengan kekuatan mereka. Allah menghantar angin kencang sebagai peringatan.", icon: "fa-wind", color: "linear-gradient(135deg, #556270 0%, #ff6b6b 100%)" },
        { id: 5, title: "Nabi Saleh AS", content: "Mukjizat beliau ialah seekor unta betina yang keluar dari celah batu besar sebagai bukti kekuasaan Allah kepada kaum Thamud.", icon: "fa-paw", color: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)" },
        { id: 6, title: "Nabi Ibrahim AS", content: "Bapa para Nabi yang membina Kaabah di Makkah. Beliau juga tokoh utama dalam ibadah korban dan haji.", icon: "fa-fire", color: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
        { id: 7, title: "Nabi Luth AS", content: "Diutus kepada kaum Sadum. Beliau sangat gigih berdakwah walaupun kaumnya sangat degil dan enggan mengikut perintah Allah.", icon: "fa-mountain", color: "linear-gradient(135deg, #8e44ad 0%, #c0392b 100%)" },
        { id: 8, title: "Nabi Ismail AS", content: "Anak Nabi Ibrahim yang sabar. Beliau membantu bapanya membina Kaabah dan menjadi asal-usul air zam-zam.", icon: "fa-tint", color: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)" },
        { id: 9, title: "Nabi Ishaq AS", content: "Anak kedua Nabi Ibrahim yang dikurniakan kepada Sarah pada usia tua. Beliau dikenali sebagai Nabi yang sangat soleh.", icon: "fa-scroll", color: "linear-gradient(135deg, #606c88 0%, #3f5c91 100%)" },
        { id: 10, title: "Nabi Yaqub AS", content: "Bapa kepada Nabi Yusuf yang sangat penyabar. Beliau sentiasa berpesan kepada anak-anaknya untuk menjaga iman kepada Allah.", icon: "fa-hands", color: "linear-gradient(135deg, #3CA55C 0%, #B5AC49 100%)" },
        { id: 11, title: "Nabi Yusuf AS", content: "Nabi yang memiliki ketampanan luar biasa. Dibuang ke perigi oleh saudaranya, namun akhirnya menjadi menteri di Mesir.", icon: "fa-crown", color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
        { id: 12, title: "Nabi Ayub AS", content: "Lambang kesabaran. Beliau diuji dengan penyakit dan kehilangan harta serta anak selama bertahun-tahun namun tetap beriman.", icon: "fa-heart", color: "linear-gradient(135deg, #e53935 0%, #e35d5b 100%)" },
        { id: 13, title: "Nabi Syuaib AS", content: "Nabi yang diutus kepada kaum Madyan. Beliau sering mengingatkan mereka supaya jujur dalam urusan timbangan dan perniagaan.", icon: "fa-balance-scale", color: "linear-gradient(135deg, #4da0b0 0%, #d39d38 100%)" },
        { id: 14, title: "Nabi Musa AS", content: "Mukjizat membelah laut dengan tongkat dan membebaskan Bani Israil daripada kezaliman Firaun.", icon: "fa-magic", color: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" },
        { id: 15, title: "Nabi Harun AS", content: "Saudara Nabi Musa yang fasih berbicara. Beliau sentiasa membantu Musa dalam urusan dakwah menentang Firaun.", icon: "fa-comment", color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" },
        { id: 16, title: "Nabi Zulkifli AS", content: "Nabi yang sangat amanah dan kuat beribadah. Beliau memimpin kaumnya dengan penuh keadilan dan kesabaran.", icon: "fa-shield-alt", color: "linear-gradient(135deg, #304352 0%, #d7d2cc 100%)" },
        { id: 17, title: "Nabi Daud AS", content: "Nabi yang dikurniakan suara merdu dan mampu melembutkan besi. Beliau juga pemenang dalam perlawanan menentang Jalut.", icon: "fa-music", color: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)" },
        { id: 18, title: "Nabi Sulaiman AS", content: "Nabi terkaya yang memerintah jin, haiwan, dan manusia. Beliau boleh memahami bahasa semut dan burung.", icon: "fa-gem", color: "linear-gradient(135deg, #642b73 0%, #c6426e 100%)" },
        { id: 19, title: "Nabi Ilyas AS", content: "Diutus kepada kaum yang menyembah berhala bernama Ba'al. Beliau menyeru kaumnya kembali kepada Allah yang Esa.", icon: "fa-sun", color: "linear-gradient(135deg, #f4c4f3 0%, #fc67fa 100%)" },
        { id: 20, title: "Nabi Ilyasa AS", content: "Penerus dakwah Nabi Ilyas. Beliau memimpin kaumnya dengan hikmah dan mukjizat yang banyak.", icon: "fa-book-open", color: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" },
        { id: 21, title: "Nabi Yunus AS", content: "Nabi yang ditelan ikan Paus besar selama 40 hari. Beliau sentiasa berzikir memohon ampun kepada Allah di dalam perut ikan.", icon: "fa-water", color: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)" },
        { id: 22, title: "Nabi Zakaria AS", content: "Nabi yang sangat sabar menanti zuriat. Beliau menjadi penjaga Maryam di Baitulmaqdis.", icon: "fa-pray", color: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
        { id: 23, title: "Nabi Yahya AS", content: "Anak Nabi Zakaria yang sangat berani dan menghafal kitab sejak kecil. Beliau dikenali sebagai Nabi yang sangat bertaqwa.", icon: "fa-feather", color: "linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)" },
        { id: 24, title: "Nabi Isa AS", content: "Nabi yang dilahirkan tanpa bapa dengan kekuasaan Allah. Mukjizat beliau termasuk menyembuhkan orang buta.", icon: "fa-cloud", color: "linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)" },
        { id: 25, title: "Nabi Muhammad SAW", content: "Nabi terakhir, khatamul anbiya. Membawa Islam sebagai rahmatan lil 'alamin melalui kitab suci Al-Quran.", icon: "fa-star-and-crescent", color: "linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)" }
    ]
};

function renderAllStories() {
    const nabContainer = document.getElementById('nabawiyah-container');
    const nabiContainer = document.getElementById('para-nabi-container');

    if (nabContainer) nabContainer.innerHTML = sirahData.nabawiyah.map((item, index) => createCardHTML(item, index, 'nabawiyah')).join('');
    if (nabiContainer) nabiContainer.innerHTML = sirahData.paraNabi.map((item, index) => createCardHTML(item, index, 'paraNabi')).join('');
}

function createCardHTML(item, index, type) {
    return `
        <div class="col-6 col-lg-3 mb-4 story-card animate__animated animate__fadeIn">
            <div class="card h-100 border-0 shadow-sm" style="border-radius: 20px; background: #ffffff;">
                <div class="card-body p-3 d-flex flex-column align-items-center text-center">
                    <div class="mb-3" style="background: ${item.color}; width: 45px; height: 45px; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        <i class="fas ${item.icon} fa-sm"></i>
                    </div>
                    <div style="min-height: 40px; display: flex; align-items: center; justify-content: center;">
                        <h6 class="fw-bold mb-0 card-title-text" style="color: #1b4332; font-size: 0.8rem; line-height: 1.2;">
                            ${item.title}
                        </h6>
                    </div>
                    <div class="mt-auto pt-3">
                        <button onclick="openStoryModal('${type}', ${item.id})" 
                                class="btn btn-success shadow-sm fw-bold" 
                                style="background-color: #2d6a4f; color: white; border: none; font-size: 0.65rem; border-radius: 8px; padding: 5px 15px; min-width: 80px; letter-spacing: 0.5px;">
                            BACA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function openStoryModal(type, id) {
    const story = sirahData[type].find(s => s.id === id);
    if (!story) return;

    const modalDialog = document.getElementById('modalDialog');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');

    if (story.isNovel) {
        modalDialog.classList.add('modal-xl');
        modalContent.innerHTML = `
            <div id="novelCarousel" class="carousel slide" data-bs-ride="false" data-bs-interval="false">
                <div class="carousel-inner">
                    ${story.scenes.map((scene, i) => `
                        <div class="carousel-item ${i === 0 ? 'active' : ''}">
                            <div class="row g-0">
                                <div class="col-lg-7">
                                    <img src="assets/${scene.img}" class="w-100" style="height:350px; object-fit:cover;" onerror="this.src='https://placehold.co/600x400?text=Imej+Sirah'">
                                </div>
                                <div class="col-lg-5 p-4 d-flex flex-column justify-content-center">
                                    <p style="font-size: 1.05rem; line-height: 1.7; color: #333;">${scene.text}</p>
                                    <div class="d-flex justify-content-between mt-4">
                                        <button class="btn btn-outline-secondary btn-sm px-3" 
                                                type="button" 
                                                onclick="bootstrap.Carousel.getInstance(document.getElementById('novelCarousel')).prev()"
                                                ${i === 0 ? 'disabled' : ''}>
                                            <i class="fas fa-arrow-left"></i> Balik
                                        </button>
                                        <button class="btn btn-success btn-sm px-4" 
                                                type="button" 
                                                onclick="${i === story.scenes.length - 1 ? "bootstrap.Modal.getInstance(document.getElementById('readModal')).hide()" : "bootstrap.Carousel.getInstance(document.getElementById('novelCarousel')).next()" }">
                                            ${i === story.scenes.length - 1 ? 'Tutup' : 'Terus <i class="fas fa-arrow-right"></i>'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`;
    } else {
        modalDialog.classList.remove('modal-xl');
        modalContent.innerHTML = `<div class="p-4 text-center"><p style="font-size: 1.15rem; line-height: 1.8; color: #444; margin:0;">${story.content}</p></div>`;
    }

    modalTitle.innerText = story.title;
    modalIcon.style.background = story.color;
    modalIcon.innerHTML = `<i class="fas ${story.icon}"></i>`;
    
    // Pastikan modal di-init dengan betul
    let modalElement = document.getElementById('readModal');
    let modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();

    // Init Carousel jika ia adalah novel
    if (story.isNovel) {
        let carouselElement = document.getElementById('novelCarousel');
        new bootstrap.Carousel(carouselElement);
    }
}

// Search Logic
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.story-card').forEach(card => {
            const title = card.querySelector('.card-title-text').innerText.toLowerCase();
            card.style.display = title.includes(term) ? "block" : "none";
        });
    });
}

document.addEventListener('DOMContentLoaded', renderAllStories);