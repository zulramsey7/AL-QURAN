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
            coords: { lat: 3.1390, lon: 101.6869 },
            dataSource: 'JAKIM' // Menjejak sumber data yang digunakan
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
            this.error = null;
            this.startClock();
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        this.coords.lat = pos.coords.latitude;
                        this.coords.lon = pos.coords.longitude;
                        this.detectZone(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => {
                        console.warn("GPS Access Denied");
                        this.detectZone(3.1390, 101.6869); // Fallback KL
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                this.detectZone(3.1390, 101.6869);
            }
        },

        async detectZone(lat, lon) {
            try {
                // Gunakan mpt.i906.my untuk dapatkan kod zon JAKIM & Nama Tempat
                const res = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
                const data = await res.json();
                
                let zoneCode = data.data.code;
                this.locationName = data.data.place;

                if (!zoneCode || zoneCode.startsWith('ext')) {
                    zoneCode = 'WLY01';
                }

                await Promise.all([
                    this.fetchPrayerTimes(zoneCode, lat, lon),
                    this.fetchQibla(lat, lon)
                ]);
            } catch (e) {
                console.error("Detect Zone Error:", e);
                this.fetchPrayerTimes('WLY01', lat, lon); 
            }
        },

        async fetchPrayerTimes(zone, lat, lon) {
            this.loading = true;
            try {
                const targetUrl = `https://www.e-solat.gov.my/index.php?r=Api/getTimes&zone=${zone}&filter=month`;
                let result = null;

                // TRY 1: JAKIM via Corsproxy.io
                try {
                    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
                    if (res.ok) {
                        result = await res.json();
                        this.dataSource = 'JAKIM (Primary)';
                    }
                } catch (e) { console.warn("Primary proxy failed."); }

                // TRY 2: JAKIM via AllOrigins (Backup Proxy)
                if (!result || !result.prayerTime) {
                    try {
                        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
                        const proxyData = await res.json();
                        if (proxyData.contents) {
                            result = JSON.parse(proxyData.contents);
                            this.dataSource = 'JAKIM (Backup)';
                        }
                    } catch (e) { console.warn("Secondary proxy failed."); }
                }

                // TRY 3: ALADHAN API (Global Fallback) - Jika JAKIM disekat 100%
                if (!result || !result.prayerTime) {
                    console.warn("JAKIM APIs failed. Switching to Aladhan API.");
                    const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${lat}&longitude=${lon}&method=11`);
                    const aladhan = await res.json();
                    
                    if (aladhan.data) {
                        const t = aladhan.data.timings;
                        this.dailyTimes = {
                            Subuh: t.Fajr, Syuruk: t.Sunrise, Zohor: t.Dhuhr,
                            Asar: t.Asr, Maghrib: t.Maghrib, Isyak: t.Isha
                        };
                        this.hijriDate = `${aladhan.data.date.hijri.day} ${aladhan.data.date.hijri.month.en} ${aladhan.data.date.hijri.year}`;
                        this.dataSource = 'Aladhan (Global Data)';
                        this.calculateNextPrayer();
                        this.loading = false;
                        return;
                    }
                }

                // Jika data JAKIM berjaya didapati
                if (result && result.prayerTime) {
                    const today = new Date();
                    const d = String(today.getDate()).padStart(2, '0');
                    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const todayStr = `${d}-${monthMap[today.getMonth()]}-${today.getFullYear()}`;
                    
                    const todayData = result.prayerTime.find(p => p.date === todayStr) || result.prayerTime[0];
                    const format = (t) => t.substring(0, 5); 

                    this.dailyTimes = {
                        Subuh: format(todayData.fajr), Syuruk: format(todayData.syuruk),
                        Zohor: format(todayData.dhuhr), Asar: format(todayData.asr),
                        Maghrib: format(todayData.maghrib), Isyak: format(todayData.isha)
                    };

                    this.monthlyData = result.prayerTime.map(p => ({
                        day: p.day, fajr: format(p.fajr), syuruk: format(p.syuruk),
                        dhuhr: format(p.dhuhr), asr: format(p.asr),
                        maghrib: format(p.maghrib), isha: format(p.isha),
                        fullDate: p.date
                    }));

                    this.hijriDate = result.hijri;
                    this.calculateNextPrayer();
                    this.error = null;
                }
            } catch (e) {
                console.error("Critical Fetch Error:", e);
                this.error = "Gagal memuatkan data. Sila refresh halaman.";
            } finally {
                this.loading = false;
            }
        },

        async fetchQibla(lat, lon) {
            try {
                const res = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
                const data = await res.json();
                this.qiblaAngle = Math.round(data.data.direction);
            } catch (e) {}
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
                this.audio.play().catch(e => console.warn("Audio blocked"));
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
