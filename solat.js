const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: false,
            currentTime: '',
            countdown: '00:00:00',
            hijriDate: '',
            locationName: 'Memuatkan...',
            nextPrayerName: '',
            nextPrayerTime: null,
            dailyTimes: { Subuh: '--:--', Syuruk: '--:--', Zohor: '--:--', Asar: '--:--', Maghrib: '--:--', Isyak: '--:--' },
            qiblaAngle: 0,
            error: null,
            isAzanPlaying: false,
            audio: new Audio('azan.mp3'),
            azanSettings: JSON.parse(localStorage.getItem('azanSettings')) || { 
                Subuh: true, Zohor: true, Asar: true, Maghrib: true, Isyak: true 
            }
        }
    },
    methods: {
        testAzan() {
            if (this.isAzanPlaying) {
                this.stopAzan();
            } else {
                this.isAzanPlaying = true;
                this.audio.play().catch(err => {
                    console.error("Audio Error:", err);
                    alert("Gagal memainkan azan.mp3. Pastikan fail ada dalam folder dan anda telah klik skrin.");
                    this.isAzanPlaying = false;
                });
            }
        },

        async init() {
            this.loading = true;
            this.updateClock();
            setInterval(this.updateClock, 1000);

            // Cuba dapatkan lokasi, jika gagal (disekat) guna Kuala Lumpur
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => this.fetchData(pos.coords.latitude, pos.coords.longitude),
                    () => this.fetchData(3.1390, 101.6869), // Fallback KL
                    { timeout: 8000 }
                );
            } else {
                this.fetchData(3.1390, 101.6869);
            }
        },

        async fetchData(lat, lon) {
            try {
                // Ambil Waktu Solat JAKIM (MPT API)
                const res = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
                const result = await res.json();

                if (result.data && result.data.times) {
                    const times = result.data.times;
                    const names = ['Imsak', 'Subuh', 'Syuruk', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
                    
                    let tempTimes = {};
                    names.forEach((name, index) => {
                        const d = new Date(times[index] * 1000);
                        tempTimes[name] = d.getHours().toString().padStart(2, '0') + ':' + 
                                         d.getMinutes().toString().padStart(2, '0');
                    });

                    this.dailyTimes = tempTimes;
                    this.locationName = result.data.place || "Kuala Lumpur";

                    // Ambil Hijri & Kiblat
                    const hRes = await fetch(`https://api.aladhan.com/v1/gToH`);
                    const hData = await hRes.json();
                    this.hijriDate = `${hData.data.hijri.day} ${hData.data.hijri.month.en} ${hData.data.hijri.year}H`;

                    const qRes = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
                    const qData = await qRes.json();
                    this.qiblaAngle = Math.round(qData.data.direction);

                    this.calculateNextPrayer();
                }
            } catch (e) {
                this.error = "Gagal memuatkan data solat.";
            } finally {
                this.loading = false;
            }
        },

        updateClock() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('ms-MY', { hour12: false });
            if (this.nextPrayerTime) this.updateCountdown();
        },

        calculateNextPrayer() {
            const now = new Date();
            const names = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
            
            for (let name of names) {
                if (this.dailyTimes[name] === '--:--') continue;
                const [h, m] = this.dailyTimes[name].split(':');
                const pDate = new Date();
                pDate.setHours(parseInt(h), parseInt(m), 0, 0);
                
                if (pDate > now) {
                    this.nextPrayerName = name;
                    this.nextPrayerTime = pDate;
                    return;
                }
            }
            // Jika dah Isyak, ambil Subuh esok
            const [sh, sm] = this.dailyTimes['Subuh'].split(':');
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(parseInt(sh), parseInt(sm), 0, 0);
            this.nextPrayerName = 'Subuh';
            this.nextPrayerTime = tomorrow;
        },

        updateCountdown() {
            const diff = this.nextPrayerTime - new Date();
            if (diff <= 0 && diff > -5000) {
                this.playAzan();
                this.calculateNextPrayer();
                return;
            }
            if (diff < -5000) {
                this.calculateNextPrayer();
            }

            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(Math.max(0, h)).padStart(2,'0')}:${String(Math.max(0, m)).padStart(2,'0')}:${String(Math.max(0, s)).padStart(2,'0')}`;
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play().catch(() => { this.isAzanPlaying = false; });
                setTimeout(() => { this.stopAzan(); }, 300000); // Stop selepas 5 minit
            }
        },

        stopAzan() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isAzanPlaying = false;
        },

        getIcon(name) {
            const map = { Subuh: 'fa-cloud-moon', Syuruk: 'fa-sun', Zohor: 'fa-certificate', Asar: 'fa-cloud-sun', Maghrib: 'fa-moon', Isyak: 'fa-star' };
            return `fas ${map[name] || 'fa-clock'}`;
        }
    },
    mounted() {
        this.init();
        // Trik unlock audio mobile
        document.addEventListener('click', () => {
            this.audio.play().then(() => {
                this.audio.pause();
                this.audio.currentTime = 0;
            }).catch(() => {});
        }, { once: true });
    }
}).mount('#solat-app');
