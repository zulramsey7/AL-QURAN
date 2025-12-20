const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: false,
            currentTime: '',
            countdown: '00:00:00',
            hijriDate: '',
            locationName: 'Mencari Lokasi...',
            nextPrayerName: '',
            nextPrayerTime: null,
            dailyTimes: { Subuh: '--:--', Syuruk: '--:--', Zohor: '--:--', Asar: '--:--', Maghrib: '--:--', Isyak: '--:--' },
            monthlyData: [],
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
        async init() {
            this.loading = true;
            this.updateClock();
            setInterval(this.updateClock, 1000);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => this.fetchAllData(pos.coords.latitude, pos.coords.longitude),
                    (err) => {
                        this.error = "GPS disekat. Menggunakan lokasi Kuala Lumpur.";
                        this.fetchAllData(3.1390, 101.6869);
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                this.fetchAllData(3.1390, 101.6869);
            }
        },

        async fetchAllData(lat, lon) {
            try {
                // 1. Waktu Solat Harian (JAKIM via MPT)
                const res = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
                const result = await res.json();
                
                if (result.data) {
                    const times = result.data.times;
                    const names = ['Imsak', 'Subuh', 'Syuruk', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
                    let tempTimes = {};
                    names.forEach((name, index) => {
                        const d = new Date(times[index] * 1000);
                        tempTimes[name] = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
                    });
                    this.dailyTimes = tempTimes;
                    this.locationName = result.data.place;
                }

                // 2. Jadual Bulanan & Hijri (Aladhan)
                const today = new Date();
                const mRes = await fetch(`https://api.aladhan.com/v1/calendar/${today.getFullYear()}/${today.getMonth() + 1}?latitude=${lat}&longitude=${lon}&method=11`);
                const mData = await mRes.json();
                this.monthlyData = mData.data;
                
                // Set Hijri hari ini dari data bulanan
                const currentDayData = mData.data[today.getDate() - 1];
                this.hijriDate = `${currentDayData.date.hijri.day} ${currentDayData.date.hijri.month.en} ${currentDayData.date.hijri.year}H`;

                // 3. Kiblat
                const qRes = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
                const qData = await qRes.json();
                this.qiblaAngle = Math.round(qData.data.direction);

                this.calculateNextPrayer();
            } catch (e) {
                this.error = "Gagal memuatkan data. Sila refresh.";
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
            const prayerOrder = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
            for (let name of prayerOrder) {
                const [h, m] = this.dailyTimes[name].split(':');
                const pDate = new Date();
                pDate.setHours(parseInt(h), parseInt(m), 0, 0);
                if (pDate > now) {
                    this.nextPrayerName = name;
                    this.nextPrayerTime = pDate;
                    return;
                }
            }
            // Fallback ke Subuh esok
            this.nextPrayerName = 'Subuh';
            const [sh, sm] = this.dailyTimes['Subuh'].split(':');
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(parseInt(sh), parseInt(sm), 0, 0);
            this.nextPrayerTime = tomorrow;
        },

        updateCountdown() {
            const diff = this.nextPrayerTime - new Date();
            if (diff <= 0) {
                this.playAzan();
                this.calculateNextPrayer();
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        },

        testAzan() {
            if (this.isAzanPlaying) {
                this.stopAzan();
            } else {
                this.isAzanPlaying = true;
                this.audio.play().catch(() => {
                    alert("Klik skrin untuk aktifkan bunyi.");
                    this.isAzanPlaying = false;
                });
            }
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play().catch(() => {});
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
        },

        formatTime(t) { return t ? t.split(' ')[0] : '--:--'; },

        isToday(dateStr) {
            const d = new Date();
            const today = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
            return dateStr === today;
        },

        refreshData() { this.init(); }
    },
    mounted() {
        this.init();
        document.addEventListener('click', () => {
            this.audio.play().then(() => { this.audio.pause(); this.audio.currentTime = 0; }).catch(() => {});
        }, { once: true });
    }
}).mount('#solat-app');
