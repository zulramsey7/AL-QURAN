/* Fail: solat.js - Fokus Waktu Solat Sahaja dengan Penambahbaikan UI */
const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: false,
            currentTime: '--:--:--',
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
                
                // Method 11 (JAKIM/Malaysia) jika tersedia, atau method 2 (ISNA)
                const url = `https://api.aladhan.com/v1/calendar?latitude=${this.coords.lat}&longitude=${this.coords.lon}&method=11&month=${month}&year=${year}`;
                
                const res = await fetch(url);
                const json = await res.json();
                
                if (json.data) {
                    const todayData = json.data[now.getDate() - 1];
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
                        dhuhr: fmt(d.timings.Dhuhr),
                        asr: fmt(d.timings.Asr),
                        maghrib: fmt(d.timings.Maghrib),
                        isha: fmt(d.timings.Isha)
                    }));

                    // Format Tarikh Hijri yang lebih kemas
                    const hd = todayData.date.hijri;
                    this.hijriDate = `${hd.day} ${hd.month.en} ${hd.year}H`;
                    
                    if(todayData.meta && todayData.meta.timezone) {
                        const loc = todayData.meta.timezone.split('/')[1] || "Kuala Lumpur";
                        this.locationName = loc.replace('_', ' ');
                    }
                    
                    this.calculateNextPrayer();
                }
            } catch (e) {
                console.error(e);
                this.error = "Gagal memuatkan data solat. Sila cuba lagi.";
            }
        },

        startClock() {
            setInterval(() => {
                const now = new Date();
                this.currentTime = now.toLocaleTimeString('ms-MY', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: false 
                });
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
            
            // Kes Midnight: Jika semua waktu hari ini lepas, tunjuk Subuh esok
            this.nextPrayerName = 'Subuh';
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const subuhTime = this.dailyTimes['Subuh'].split(':');
            tomorrow.setHours(parseInt(subuhTime[0]), parseInt(subuhTime[1]), 0, 0);
            this.nextPrayerTime = tomorrow;
        },

        updateCountdown() {
            if (!this.nextPrayerTime) return;
            const now = new Date();
            const diff = this.nextPrayerTime - now;
            
            if (diff <= 0) {
                this.playAzan();
                // Refresh waktu solat seterusnya selepas 1 minit azan
                setTimeout(() => this.calculateNextPrayer(), 60000);
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
                'Zohor': 'fas fa-sun', 
                'Asar': 'fas fa-cloud-sun', 
                'Maghrib': 'fas fa-moon', 
                'Isyak': 'fas fa-star-and-crescent' 
            };
            return icons[name] || 'fas fa-clock';
        },

        playAzan() {
            // Mainkan azan jika setting untuk waktu solat tersebut adalah TRUE
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play().catch(e => {
                    console.warn("Browser menghalang autoplay audio. Pengguna perlu klik dahulu.");
                    this.isAzanPlaying = false; // Reset jika gagal
                });
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
            this.loading = true;
            localStorage.removeItem('azanSettings'); // Pilihan: reset cache jika mahu
            location.reload();
        }
    },
    mounted() {
        this.init();
    }
}).mount('#solat-app');