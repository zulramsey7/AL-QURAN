const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: false,
            currentTime: '',
            countdown: '00:00:00',
            hijriDate: '',
            locationName: 'Kuala Lumpur',
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
            coords: { lat: 3.1390, lon: 101.6869 },
        }
    },
    watch: {
        // Simpan tetapan azan setiap kali pengguna ubah
        azanSettings: {
            handler(val) {
                localStorage.setItem('azanSettings', JSON.stringify(val));
            },
            deep: true
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
    methods: {
        async init() {
            this.loading = true;
            this.startClock();
            
            const geoOptions = {
                enableHighAccuracy: true, 
                timeout: 10000,           
                maximumAge: 0             
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        this.coords.lat = pos.coords.latitude;
                        this.coords.lon = pos.coords.longitude;
                        // Kira qiblat sebaik dapat koordinat
                        this.calculateQibla(this.coords.lat, this.coords.lon);
                        await this.fetchData();
                    },
                    async (err) => {
                        console.error("GPS Gagal, guna default:", err.message);
                        this.calculateQibla(this.coords.lat, this.coords.lon);
                        await this.fetchData(); 
                    },
                    geoOptions
                );
            } else {
                this.calculateQibla(this.coords.lat, this.coords.lon);
                await this.fetchData();
            }
        },

        // FUNGSI BARU: Pengiraan Arah Qiblat
        calculateQibla(lat, lon) {
            const phiK = 21.4225 * Math.PI / 180; // Lat Kaabah
            const lambdaK = 39.8262 * Math.PI / 180; // Lon Kaabah
            const phi = lat * Math.PI / 180;
            const lambda = lon * Math.PI / 180;

            const y = Math.sin(lambdaK - lambda);
            const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
            
            let qibla = Math.atan2(y, x) * 180 / Math.PI;
            this.qiblaAngle = (qibla + 360) % 360;
        },

        async fetchData() {
            this.loading = true;
            this.error = null;
            try {
                const now = new Date();
                const month = now.getMonth() + 1;
                const year = now.getFullYear();

                const tune = "0,2,0,2,0,2,0,2"; 
                const url = `https://api.aladhan.com/v1/calendar?latitude=${this.coords.lat}&longitude=${this.coords.lon}&method=11&school=0&tune=${tune}&month=${month}&year=${year}`;
                
                const res = await fetch(url);
                const json = await res.json();
                
                if (json.data) {
                    const todayIdx = now.getDate() - 1;
                    const todayData = json.data[todayIdx];
                    const t = todayData.timings;
                    const fmt = (s) => s.split(' ')[0];

                    this.dailyTimes = {
                        Subuh: fmt(t.Fajr),
                        Syuruk: fmt(t.Sunrise),
                        Zohor: fmt(t.Dhuhr),
                        Asar: fmt(t.Asr),
                        Maghrib: fmt(t.Maghrib),
                        Isyak: fmt(t.Isha)
                    };

                    this.monthlyData = json.data.map(d => ({
                        day: parseInt(d.date.gregorian.day),
                        fajr: fmt(d.timings.Fajr),
                        syuruk: fmt(d.timings.Sunrise),
                        dhuhr: fmt(d.timings.Dhuhr),
                        asr: fmt(d.timings.Asr),
                        maghrib: fmt(d.timings.Maghrib),
                        isha: fmt(d.timings.Isha)
                    }));

                    this.hijriDate = `${todayData.date.hijri.day} ${todayData.date.hijri.month.en} ${todayData.date.hijri.year}`;
                    
                    if(todayData.meta && todayData.meta.timezone) {
                        this.locationName = todayData.meta.timezone.split('/')[1].replace('_', ' ');
                    }
                    
                    this.calculateNextPrayer();
                }
            } catch (e) {
                this.error = "Ralat memuatkan data solat.";
            } finally {
                this.loading = false;
            }
        },

        startClock() {
            setInterval(() => {
                const now = new Date();
                this.currentTime = now.toLocaleTimeString('ms-MY', { hour12: false });
                this.updateCountdown();
            }, 1000);
        },

        calculateNextPrayer() {
            const now = new Date();
            const prayerOrder = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
            for (let name of prayerOrder) {
                const timeStr = this.dailyTimes[name];
                if (!timeStr || timeStr === '--:--') continue;
                const [h, m] = timeStr.split(':');
                const pDate = new Date();
                pDate.setHours(parseInt(h), parseInt(m), 0, 0);
                if (pDate > now) {
                    this.nextPrayerName = name;
                    this.nextPrayerTime = pDate;
                    return;
                }
            }
            this.nextPrayerName = 'Subuh';
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const [sh, sm] = this.dailyTimes['Subuh'].split(':');
            tomorrow.setHours(parseInt(sh), parseInt(sm), 0, 0);
            this.nextPrayerTime = tomorrow;
        },

        updateCountdown() {
            if (!this.nextPrayerTime) return;
            const diff = this.nextPrayerTime - new Date();
            if (diff <= 0) {
                this.playAzan();
                setTimeout(() => this.calculateNextPrayer(), 3000);
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        },

        getIcon(name) {
            const icons = { 'Subuh': 'fas fa-cloud-moon', 'Syuruk': 'fas fa-sun', 'Zohor': 'fas fa-cloud-sun', 'Asar': 'fas fa-certificate', 'Maghrib': 'fas fa-moon', 'Isyak': 'fas fa-star-and-crescent' };
            return icons[name] || 'fas fa-clock';
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play().catch(e => console.log("Audio diblock browser:", e));
            }
        },

        stopAzan() { this.audio.pause(); this.audio.currentTime = 0; this.isAzanPlaying = false; },
        testAzan() { if (this.isAzanPlaying) this.stopAzan(); else { this.isAzanPlaying = true; this.audio.play(); } },
        isToday(day) { return parseInt(day) === new Date().getDate(); },
        refreshLocation() { this.init(); }
    },
    mounted() { this.init(); }
}).mount('#solat-app');
