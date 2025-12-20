const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: false,
            currentTime: '',
            countdown: '00:00:00',
            hijriDate: '',
            locationName: 'Mencari lokasi...',
            nextPrayerName: '',
            nextPrayerTime: null,
            dailyTimes: {},
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
    watch: {
        azanSettings: {
            handler(val) {
                localStorage.setItem('azanSettings', JSON.stringify(val));
            },
            deep: true
        }
    },
    methods: {
        testAzan() {
            if (this.isAzanPlaying) {
                this.stopAzan();
            } else {
                this.isAzanPlaying = true;
                this.audio.play().catch(err => {
                    alert("Sila klik skrin terlebih dahulu untuk aktifkan bunyi.");
                    this.isAzanPlaying = false;
                });
            }
        },

        async init() {
            this.loading = true;
            this.updateClock();
            setInterval(this.updateClock, 1000);
            
            if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission();
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.handleLocation, this.handleLocationError, {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 0
                });
            } else {
                this.error = "GPS tidak disokong oleh peranti anda.";
                this.loading = false;
            }
        },

        async handleLocation(position) {
            const { latitude, longitude } = position.coords;
            try {
                // 1. Ambil Waktu Solat Rasmi JAKIM via MPT API
                const res = await fetch(`https://mpt.i906.my/api/prayer/${latitude},${longitude}`);
                const data = await res.json();
                
                if (data.code === 200 || data.data) {
                    const times = data.data.times; // Array timestamp dari JAKIM
                    const names = ['Imsak', 'Subuh', 'Syuruk', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
                    
                    let formattedTimes = {};
                    names.forEach((name, index) => {
                        const date = new Date(times[index] * 1000);
                        formattedTimes[name] = date.toLocaleTimeString('ms-MY', { 
                            hour: '2-digit', minute: '2-digit', hour12: false 
                        });
                    });

                    this.dailyTimes = formattedTimes;
                    this.locationName = data.data.place || "Lokasi Anda";

                    // 2. Ambil Tarikh Hijri & Jadual Bulanan (API Aladhan tetap berguna untuk kalendar)
                    const hijriRes = await fetch(`https://api.aladhan.com/v1/gToH?date=${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`);
                    const hijriData = await hijriRes.json();
                    this.hijriDate = `${hijriData.data.hijri.day} ${hijriData.data.hijri.month.en} ${hijriData.data.hijri.year}H`;

                    // 3. Ambil Arah Kiblat
                    const qiblaRes = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
                    const qiblaData = await qiblaRes.json();
                    this.qiblaAngle = Math.round(qiblaData.data.direction);
                    
                    this.calculateNextPrayer();
                    this.initCompass();
                }
                this.loading = false;
            } catch (e) {
                this.error = "Gagal memuatkan data JAKIM. Periksa internet.";
                this.loading = false;
            }
        },

        updateClock() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('ms-MY', { 
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
            });
            if (this.nextPrayerTime) this.updateCountdown();
        },

        calculateNextPrayer() {
            const now = new Date();
            const prayerNames = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
            
            for (let name of prayerNames) {
                if (!this.dailyTimes[name]) continue;
                const [h, m] = this.dailyTimes[name].split(':');
                const pDate = new Date();
                pDate.setHours(parseInt(h), parseInt(m), 0, 0);
                
                if (pDate > now) {
                    this.nextPrayerName = name;
                    this.nextPrayerTime = pDate;
                    return;
                }
            }

            const [h, m] = this.dailyTimes['Subuh'].split(':');
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(parseInt(h), parseInt(m), 0, 0);
            this.nextPrayerName = 'Subuh';
            this.nextPrayerTime = tomorrow;
        },

        updateCountdown() {
            const now = new Date();
            const diff = this.nextPrayerTime - now;

            if (diff <= 0 && diff > -2000) {
                this.playAzan();
                setTimeout(() => this.calculateNextPrayer(), 3000);
                return;
            }

            if (diff <= 0) {
                this.calculateNextPrayer();
                return;
            }

            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        },

        playAzan() {
            if (this.azanSettings[this.nextPrayerName] && !this.isAzanPlaying) {
                this.isAzanPlaying = true;
                
                if (Notification.permission === "granted") {
                    new Notification("Waktu Solat", {
                        body: `Telah masuk waktu ${this.nextPrayerName} bagi zon ${this.locationName}.`,
                        icon: 'icon-192x192.png'
                    });
                }

                this.audio.play().catch(err => {
                    console.warn("Autoplay disekat.");
                    this.isAzanPlaying = false; 
                });

                setTimeout(() => { this.stopAzan(); }, 240000);
            }
        },

        stopAzan() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isAzanPlaying = false;
        },

        initCompass() {
            const handler = (e) => {
                let heading = e.webkitCompassHeading || (360 - e.alpha);
                if (heading !== undefined && heading !== null) {
                    const relativeAngle = this.qiblaAngle - heading;
                    const pointer = document.getElementById('compass-pointer');
                    if (pointer) {
                        pointer.style.transition = 'transform 0.3s ease-out';
                        pointer.style.transform = `translateX(-50%) rotate(${relativeAngle}deg)`;
                    }
                }
            };

            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission()
                        .then(state => {
                            if (state === 'granted') window.addEventListener('deviceorientation', handler, true);
                        });
                }, { once: true });
            } else {
                window.addEventListener('deviceorientation', handler, true);
            }
        },

        getIcon(name) {
            const map = { Subuh: 'fa-cloud-moon', Syuruk: 'fa-sun', Zohor: 'fa-certificate', Asar: 'fa-cloud-sun', Maghrib: 'fa-moon', Isyak: 'fa-star' };
            return `fas ${map[name] || 'fa-clock'}`;
        },

        formatTime(t) { return t ? t.split(' ')[0] : '--:--'; },

        isToday(dateStr) {
            const now = new Date();
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();
            return dateStr === `${d}-${m}-${y}`;
        },

        handleLocationError(error) {
            this.loading = false;
            this.error = "Akses lokasi ditolak. Sila aktifkan GPS untuk data JAKIM yang tepat.";
        },
        
        refreshData() {
            this.init();
        }
    },
    mounted() {
        this.init();
        
        document.addEventListener('click', () => {
            this.audio.play().then(() => {
                this.audio.pause();
                this.audio.currentTime = 0;
            }).catch(() => {});
        }, { once: true });
    }
}).mount('#solat-app');
