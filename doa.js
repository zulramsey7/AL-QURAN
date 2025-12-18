let allDoa = [];

async function loadDoa() {
    const doaList = document.getElementById('doa-list');
    const loadingSpinner = document.getElementById('loading-spinner');
    const doaContent = document.getElementById('doa-content');

    // 1. Semak LocalStorage (Offline Mode)
    const cachedDoa = localStorage.getItem('doa_harian_data');

    if (cachedDoa) {
        allDoa = JSON.parse(cachedDoa);
        displayDoa(allDoa);
    } else {
        try {
            // 2. Ambil dari API jika tiada cache
            const response = await fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian');
            const result = await response.json();
            allDoa = result.data;

            // Simpan data untuk kegunaan offline
            localStorage.setItem('doa_harian_data', JSON.stringify(allDoa));
            displayDoa(allDoa);
        } catch (error) {
            doaList.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-warning border-0 shadow-sm rounded-4">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Gagal memuatkan data doa. Sila semak sambungan internet anda.
                    </div>
                </div>`;
        }
    }

    loadingSpinner.classList.add('d-none');
    doaContent.classList.remove('d-none');
}

function displayDoa(data) {
    const list = document.getElementById('doa-list');
    list.innerHTML = '';

    if (data.length === 0) {
        list.innerHTML = '<div class="col-12 text-center text-muted mt-5">Doa tidak dijumpai...</div>';
        return;
    }

    data.forEach((doa, index) => {
        const cardHTML = `
            <div class="col-md-6 col-lg-4 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.05}s">
                <div class="card doa-card shadow-sm">
                    <div class="card-body p-4">
                        <h5 class="fw-bold text-success mb-3">${doa.title}</h5>
                        <p class="arabic-text text-end mb-3">${doa.arabic}</p>
                        <p class="latin-text small mb-3">${doa.latin}</p>
                        <div class="translation-text">
                            <strong>Maksud:</strong><br>
                            ${doa.translation}
                        </div>
                    </div>
                </div>
            </div>
        `;
        list.innerHTML += cardHTML;
    });
}

// Logik Fungsi Carian
document.getElementById('search-doa').addEventListener('input', function(e) {
    const keyword = e.target.value.toLowerCase();
    const filtered = allDoa.filter(doa => 
        doa.title.toLowerCase().includes(keyword) || 
        doa.translation.toLowerCase().includes(keyword)
    );
    displayDoa(filtered);
});

// Jalankan fungsi
document.addEventListener('DOMContentLoaded', loadDoa);