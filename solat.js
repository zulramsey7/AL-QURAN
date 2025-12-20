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
                        console.warn("GPS error:", err.message);
                        this.error = "GPS tidak aktif atau disekat. Menggunakan lokasi Kuala Lumpur.";
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
                // Gunakan mpt.i906.my untuk dapatkan kod zon JAKIM yang betul (cth: SGR01)
                const res = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
                const data = await res.json();
                
                if (data.data && data.data.code) {
                    const zoneCode = data.data.code;
                    this.locationName = data.data.place;
                    
                    await Promise.all([
                        this.fetchPrayerTimes(zoneCode),
                        this.fetchQibla(lat, lon)
                    ]);
                } else {
                    throw new Error("Zon tidak ditemui");
                }
            } catch (e) {
                console.error("Zone fetch error:", e);
                this.error = "Gagal mengesan zon lokasi. Sila cuba lagi.";
                // Fallback ke Kuala Lumpur jika gagal
                if (this.locationName === 'Mencari Lokasi...') {
                    this.fetchPrayerTimes('WLY01');
                }
            } finally {
                this.loading = false;
            }
        },

        async fetchPrayerTimes(zone) {
            try {
                // PENYELESAIAN CORS: Menggunakan proxy allorigins.win
                const targetUrl = `https://www.e-solat.gov.my/index.php?r=Api/getTimes&zone=${zone}&filter=month`;
                const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
                const proxyData = await res.json();
                
                // AllOrigins membungkus data dalam string 'contents'
                const result = JSON.parse(proxyData.contents);
                
                if (result.prayerTime) {
                    const today = new Date();
                    const day = String(today.getDate()).padStart(2, '0');
                    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const month = monthMap[today.getMonth()];
                    const year = today.getFullYear();
                    
                    // Cari data hari ini berdasarkan format date dalam JSON (cth: "20-Dec-2025")
                    const todayStr = `${day}-${month}-${year}`;
                    const todayData = result.prayerTime.find(p => p.date === todayStr) || result.prayerTime[0];
                    
                    const format = (t) => t.substring(0, 5); 

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
            } catch (e) {
                console.error("Prayer fetch error:", e);
                this.error = "Gagal memuatkan waktu solat dari server JAKIM.";
            }
        },

        async fetchQibla(lat, lon) {
            try {
                const res = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
                const data = await res.json();
                this.qiblaAngle = Math.round(data.data.direction);
            } catch (e) {
                console.error("Qibla fetch error:", e);
            }
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
                    // Tunggu 1 minit sebelum kira waktu seterusnya supaya tidak 'loop'
                    setTimeout(() => this.calculateNextPrayer(), 60000);
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
                if (!this.dailyTimes[name] || this.dailyTimes[name] === '--:--') continue;
                
                const [h, m] = this.dailyTimes[name].split(':');
                const pDate = new Date();
                pDate.setHours(parseInt(h), parseInt(m), 0, 0);
                
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
            tomorrow.setHours(parseInt(sh), parseInt(sm), 0, 0);
            this.nextPrayerName = 'Subuh';
            this.nextPrayerTime = tomorrow;
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                this.audio.play().catch(e => console.log("Audio play blocked by browser. User interaction required."));
            }
        },

        stopAzan() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isAzanPlaying = false;
        },

        testAzan() {
            if (this.isAzanPlaying) {
                this.stopAzan();
            } else {
                this.isAzanPlaying = true;
                this.audio.play().catch(e => {
                    this.isAzanPlaying = false;
                    alert("Sila benarkan audio dalam tetapan pelayar anda.");
                });
            }
        },

        isToday(dateStr) {
            const today = new Date();
            const d = String(today.getDate()).padStart(2, '0');
            const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const m = monthMap[today.getMonth()];
            const y = today.getFullYear();
            return dateStr === `${d}-${m}-${y}`;
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
