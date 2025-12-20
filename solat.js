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
            },
            coords: { lat: 3.1390, lon: 101.6869 } 
        }
    },
    computed: {
        orderedPrayers() {
            const order = ['Subuh', 'Syuruk', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
            return order.map(name => ({
                name: name,
                time: this.dailyTimes[name] || '--:--'
            }));
        }
    },
    watch: {
        azanSettings: {
            handler(val) { localStorage.setItem('azanSettings', JSON.stringify(val)); },
            deep: true
        }
    },
    methods: {
        async init() {
            this.loading = true;
            this.error = null;
            this.startClock();
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        this.coords.lat = pos.coords.latitude;
                        this.coords.lon = pos.coords.longitude;
                        this.getJakimZone(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => {
                        this.error = "GPS tidak aktif. Menggunakan lokasi Kuala Lumpur.";
                        this.getJakimZone(3.1390, 101.6869); 
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                this.getJakimZone(3.1390, 101.6869);
            }
        },

        async getJakimZone(lat, lon) {
            try {
                // Step 1: Dapatkan Kod Zon JAKIM (cth: SGR01) guna koordinat
                // API ini menukar GPS kepada zon rasmi JAKIM dengan sangat tepat
                const res = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
                const data = await res.json();
                
                const zoneCode = data.data.code;
                this.locationName = data.data.place;
                
                // Step 2: Ambil Waktu Solat & Kiblat
                await Promise.all([
                    this.fetchPrayerTimes(zoneCode),
                    this.fetchQibla(lat, lon)
                ]);
            } catch (e) {
                this.error = "Gagal menghubungi server waktu solat.";
            } finally {
                this.loading = false;
            }
        },

        async fetchPrayerTimes(zone) {
            const res = await fetch(`https://www.e-solat.gov.my/index.php?r=Api/getTimes&zone=${zone}&filter=month`);
            const result = await res.json();
            
            if (result.prayerTime) {
                const todayStr = new Date().getDate();
                const todayData = result.prayerTime.find(p => parseInt(p.day) === todayStr) || result.prayerTime[0];
                
                const format = (t) => t.substring(0, 5); // Potong saat (13:00:00 -> 13:00)

                this.dailyTimes = {
                    Subuh: format(todayData.fajr),
                    Syuruk: format(todayData.syuruk),
                    Zohor: format(todayData.dhuhr),
                    Asar: format(todayData.asr),
                    Maghrib: format(todayData.maghrib),
                    Isyak: format(todayData.isha)
                };

                this.monthlyData = result.prayerTime.map(p => ({
                    day: p.day,
                    fajr: format(p.fajr),
                    syuruk: format(p.syuruk),
                    dhuhr: format(p.dhuhr),
                    asr: format(p.asr),
                    maghrib: format(p.maghrib),
                    isha: format(p.isha),
                    fullDate: p.date
                }));

                this.hijriDate = result.hijri;
                this.calculateNextPrayer();
            }
        },

        async fetchQibla(lat, lon) {
            const res = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
            const data = await res.json();
            this.qiblaAngle = Math.round(data.data.direction);
        },

        startClock() {
            this.updateClock();
            setInterval(this.updateClock, 1000);
        },

        updateClock() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('ms-MY', { hour12: false });
            if (this.nextPrayerTime) {
                const diff = this.nextPrayerTime - now;
                if (diff <= 0) {
                    this.playAzan();
                    this.calculateNextPrayer();
                } else {
                    this.updateCountdown(diff);
                }
            }
        },

        updateCountdown(diff) {
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        },

        calculateNextPrayer() {
            const now = new Date();
            const prayerOrder = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
            
            for (let name of prayerOrder) {
                const [h, m] = this.dailyTimes[name].split(':');
                const pDate = new Date();
                pDate.setHours(h, m, 0, 0);
                
                if (pDate > now) {
                    this.nextPrayerName = name;
                    this.nextPrayerTime = pDate;
                    return;
                }
            }
            // Jika Isyak sudah lepas, cari Subuh esok
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const [sh, sm] = this.dailyTimes['Subuh'].split(':');
            tomorrow.setHours(sh, sm, 0, 0);
            this.nextPrayerName = 'Subuh';
            this.nextPrayerTime = tomorrow;
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play();
            }
        },

        stopAzan() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isAzanPlaying = false;
        },

        testAzan() {
            this.isAzanPlaying ? this.stopAzan() : (this.isAzanPlaying = true, this.audio.play());
        },

        isToday(dateStr) {
            const today = new Date().getDate();
            return parseInt(dateStr.split('-')[0]) === today;
        },

        getIcon(name) {
            const map = { Subuh: 'fa-cloud-moon', Syuruk: 'fa-sun', Zohor: 'fa-certificate', Asar: 'fa-cloud-sun', Maghrib: 'fa-moon', Isyak: 'fa-star' };
            return `fas ${map[name]}`;
        }
    },
    mounted() {
        this.init();
    }
}).mount('#solat-app');
