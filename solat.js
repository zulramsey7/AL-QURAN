/* Fail: solat.js - Fokus Waktu Solat Sahaja */
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
            error: null,
            isAzanPlaying: false,
            audio: new Audio('azan.mp3'),
            azanSettings: JSON.parse(localStorage.getItem('azanSettings')) || { 
                Subuh: true, Zohor: true, Asar: true, Maghrib: true, Isyak: true 
            },
            coords: { lat: 3.1390, lon: 101.6869 }, // Default Kuala Lumpur
        }
    },
    watch: {
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
                maximumAge: 60000 
            };

            // Masih perlukan GPS untuk dapatkan waktu solat yang tepat mengikut kawasan
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        this.coords.lat = pos.coords.latitude;
                        this.coords.lon = pos.coords.longitude;
                        await this.fetchData();
                        this.loading = false;
                    },
                    (err) => {
                        this.error = "GPS tidak aktif. Menggunakan lokasi default.";
                        this.loading = false;
                        this.fetchData();
                    },
                    geoOptions
                );
            } else {
                this.fetchData();
            }
        },

        async fetchData() {
            try {
                const now = new Date();
                const month = now.getMonth() + 1;
                const year = now.getFullYear();
                
                // Menggunakan API Aladhan untuk jadual bulanan
                const url = `https://api.aladhan.com/v1/calendar?latitude=${this.coords.lat}&longitude=${this.coords.lon}&method=11&month=${month}&year=${year}`;
                
                const res = await fetch(url);
                const json = await res.json();
                
                if (json.data) {
                    const todayData = json.data[now.getDate() - 1];
                    const t = todayData.timings;
                    const fmt = (s) => s.split(' ')[0]; // Buang info timezone (e.g. "+08")

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
                console.error(e);
                this.error = "Ralat memuatkan jadual solat.";
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
            
            // Jika semua waktu hari ini sudah lepas, seterusnya adalah Subuh esok
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
                // Tunggu sebentar sebelum kira waktu seterusnya
                setTimeout(() => this.calculateNextPrayer(), 2000);
                return;
            }
            
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        },

        getIcon(name) {
            const icons = { 
                'Subuh': 'fas fa-cloud-moon', 
                'Syuruk': 'fas fa-sun', 
                'Zohor': 'fas fa-cloud-sun', 
                'Asar': 'fas fa-certificate', 
                'Maghrib': 'fas fa-moon', 
                'Isyak': 'fas fa-star-and-crescent' 
            };
            return icons[name] || 'fas fa-clock';
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play().catch(e => console.log("Audio diblock browser:", e));
            }
        },

        stopAzan() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isAzanPlaying = false;
        },

        isToday(day) {
            return parseInt(day) === new Date().getDate();
        },

        refreshLocation() {
            location.reload();
        }
    },
    mounted() {
        this.init();
    }
}).mount('#solat-app');