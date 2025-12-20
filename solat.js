/* Fail: solat.js */
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
            // Struktur data default
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
    computed: {
        // Memastikan susunan paparan sentiasa betul mengikut kronologi solat
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
            this.updateClock();
            
            if (!this.clockInterval) {
                this.clockInterval = setInterval(this.updateClock, 1000);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => this.fetchAllData(pos.coords.latitude, pos.coords.longitude),
                    (err) => {
                        this.error = "GPS tidak aktif. Menggunakan lokasi Kuala Lumpur.";
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
                // Fetch data bulanan dari API MPT (JAKIM)
                const res = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}?filter=month`);
                const result = await res.json();

                if (result.data) {
                    const today = new Date();
                    const dayIndex = today.getDate() - 1; 
                    const allMonthTimes = result.data.times;
                    const times = allMonthTimes[dayIndex]; 
                    
                    // PEMBETULAN INDEX API JAKIM:
                    // 0:Imsak, 1:Subuh, 2:Syuruk, 3:Zohor, 4:Asar, 5:Maghrib, 6:Isyak
                    this.dailyTimes = {
                        Subuh: this.tsToTime(times[1]),
                        Syuruk: this.tsToTime(times[2]),
                        Zohor: this.tsToTime(times[3]),
                        Asar: this.tsToTime(times[4]),
                        Maghrib: this.tsToTime(times[5]),
                        Isyak: this.tsToTime(times[6])
                    };

                    // Petakan data bulanan supaya Syuruk tidak hilang dalam jadual
                    this.monthlyData = allMonthTimes.map((dayTimes, idx) => {
                        return {
                            day: idx + 1,
                            fajr: this.tsToTime(dayTimes[1]),
                            syuruk: this.tsToTime(dayTimes[2]),
                            dhuhr: this.tsToTime(dayTimes[3]),
                            asr: this.tsToTime(dayTimes[4]),
                            maghrib: this.tsToTime(dayTimes[5]),
                            isha: this.tsToTime(dayTimes[6]),
                            fullDate: `${idx + 1}-${today.getMonth() + 1}-${today.getFullYear()}`
                        };
                    });

                    this.hijriDate = result.data.hijri;
                    this.locationName = result.data.place;

                    // Ambil data Kiblat
                    const qRes = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
                    const qData = await qRes.json();
                    this.qiblaAngle = Math.round(qData.data.direction);

                    this.calculateNextPrayer();
                }
            } catch (e) {
                this.error = "Gagal memuatkan data JAKIM.";
                console.error(e);
            } finally {
                this.loading = false;
            }
        },

        tsToTime(ts) {
            if (!ts) return '--:--';
            const d = new Date(ts * 1000);
            return d.getHours().toString().padStart(2, '0') + ':' + 
                   d.getMinutes().toString().padStart(2, '0');
        },

        updateClock() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('ms-MY', { hour12: false });
            if (this.nextPrayerTime) this.updateCountdown();
        },

        calculateNextPrayer() {
            const now = new Date();
            // Hanya solat fardu yang ada Azan (Syuruk dikecualikan)
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
            // Jika Isyak sudah lepas, ambil Subuh esok
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const [sh, sm] = this.dailyTimes['Subuh'].split(':');
            tomorrow.setHours(parseInt(sh), parseInt(sm), 0, 0);
            this.nextPrayerName = 'Subuh';
            this.nextPrayerTime = tomorrow;
        },

        updateCountdown() {
            const now = new Date();
            const diff = this.nextPrayerTime - now;

            // Jika tepat masuk waktu solat
            if (diff <= 0 && diff > -3000) {
                this.playAzan();
                this.calculateNextPrayer();
                return;
            }

            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(Math.max(0, h)).padStart(2,'0')}:${String(Math.max(0, m)).padStart(2,'0')}:${String(Math.max(0, s)).padStart(2,'0')}`;
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play().catch(e => console.warn("Autoplay ditahan oleh pelayar. Klik mana-mana untuk aktifkan audio."));
            }
        },

        testAzan() {
            if (this.isAzanPlaying) {
                this.stopAzan();
            } else {
                this.isAzanPlaying = true;
                this.audio.play();
            }
        },

        stopAzan() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isAzanPlaying = false;
        },

        isToday(dateStr) {
            const d = new Date();
            const today = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
            return dateStr === today;
        },

        getIcon(name) {
            const map = { Subuh: 'fa-cloud-moon', Syuruk: 'fa-sun', Zohor: 'fa-certificate', Asar: 'fa-cloud-sun', Maghrib: 'fa-moon', Isyak: 'fa-star' };
            return `fas ${map[name] || 'fa-clock'}`;
        },

        refreshData() { this.init(); }
    },
    mounted() {
        this.init();
        // Unlock audio untuk mobile browser
        const unlock = () => {
            this.audio.play().then(() => { this.audio.pause(); this.audio.currentTime = 0; });
            document.removeEventListener('click', unlock);
        };
        document.addEventListener('click', unlock);
    }
}).mount('#solat-app');
