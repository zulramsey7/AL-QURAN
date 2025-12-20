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
                        this.error = "GPS disekat. Sila benarkan akses lokasi di pelayar anda.";
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
                // Gunakan API MuslimSalat (lebih stabil untuk tukar koordinat ke Zon)
                const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://muslimsalat.com/filter:address/daily.json?key=4f69766063630737f7e91d643d46324d&lat=' + lat + '&long=' + lon)}`);
                const data = await res.json();
                const content = JSON.parse(data.contents);
                
                // Ambil nama negeri/bandar untuk cari kod zon
                const city = content.city || "Kuala Lumpur";
                this.locationName = content.address || city;
                
                // Dapatkan kod zon JAKIM berdasarkan koordinat secara terus dari API alternatif
                const zoneRes = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
                const zoneData = await zoneRes.json();
                
                let zoneCode = zoneData.data.code;

                // FIX: Jika API bagi kod 'ext', paksa guna WLY01 (KL) untuk elak Error 400
                if (zoneCode.startsWith('ext')) {
                    zoneCode = 'WLY01';
                }

                await Promise.all([
                    this.fetchPrayerTimes(zoneCode),
                    this.fetchQibla(lat, lon)
                ]);
            } catch (e) {
                console.error("Detect Zone Error:", e);
                this.fetchPrayerTimes('WLY01'); // Kecemasan guna KL
            }
        },

        async fetchPrayerTimes(zone) {
            try {
                const targetUrl = `https://www.e-solat.gov.my/index.php?r=Api/getTimes&zone=${zone}&filter=month`;
                const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
                const proxyData = await res.json();
                
                if (!proxyData.contents) throw new Error("Proxy Return Empty");
                const result = JSON.parse(proxyData.contents);
                
                if (result.prayerTime) {
                    const today = new Date();
                    const d = String(today.getDate()).padStart(2, '0');
                    const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const todayStr = `${d}-${monthMap[today.getMonth()]}-${today.getFullYear()}`;
                    
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
                    this.loading = false;
                }
            } catch (e) {
                this.error = "Server JAKIM sedang sibuk. Sila refresh semula.";
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
                if (h === '--') continue;
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
                this.audio.play().catch(e => console.log("Audio blocked"));
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
