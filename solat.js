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
            // Menggunakan audio azan lokal
            audio: new Audio('azan.mp3'),
            // Tetapan azan disimpan dalam LocalStorage
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
        // --- Fungsi Baru: Untuk Menguji Bunyi Azan ---
        testAzan() {
            if (this.isAzanPlaying) {
                this.stopAzan();
            } else {
                this.isAzanPlaying = true;
                this.audio.play().catch(err => {
                    alert("Ralat: Fail 'azan.mp3' tidak ditemui. Pastikan fail ada dalam folder yang sama.");
                    this.isAzanPlaying = false;
                });
            }
        },

        async init() {
            this.loading = true;
            this.updateClock();
            setInterval(this.updateClock, 1000);
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.handleLocation, this.handleLocationError, {
                    enableHighAccuracy: true,
                    timeout: 8000,
                    maximumAge: 0
                });
            } else {
                this.error = "Geolocation tidak disokong oleh peranti anda.";
                this.loading = false;
            }
        },

        async handleLocation(position) {
            const { latitude, longitude } = position.coords;
            try {
                // Method 3: Muslim World League (Sesuai untuk Malaysia/JAKIM)
                const baseUrl = `https://api.aladhan.com/v1`;
                const config = `latitude=${latitude}&longitude=${longitude}&method=3`;

                const res = await fetch(`${baseUrl}/timings?${config}`);
                const data = await res.json();
                
                if (data.code === 200) {
                    const t = data.data.timings;
                    this.dailyTimes = {
                        'Subuh': t.Fajr,
                        'Syuruk': t.Sunrise,
                        'Zohor': t.Dhuhr,
                        'Asar': t.Asr,
                        'Maghrib': t.Maghrib,
                        'Isyak': t.Isha
                    };
                    
                    this.hijriDate = `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}H`;
                    this.locationName = data.data.meta.timezone.split('/').pop().replace('_', ' ');

                    // Jadual Bulanan
                    const monthRes = await fetch(`${baseUrl}/calendar?${config}`);
                    const monthData = await monthRes.json();
                    this.monthlyData = monthData.data;

                    // Arah Kiblat
                    const qiblaRes = await fetch(`${baseUrl}/qibla/${latitude}/${longitude}`);
                    const qiblaData = await qiblaRes.json();
                    this.qiblaAngle = Math.round(qiblaData.data.direction);
                    
                    this.calculateNextPrayer();
                    this.initCompass();
                }
                this.loading = false;
            } catch (e) {
                this.error = "Gagal memuatkan data. Periksa sambungan internet.";
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

            // Jika semua waktu hari ini sudah lepas, ambil Subuh esok
            if (this.dailyTimes['Subuh']) {
                const [h, m] = this.dailyTimes['Subuh'].split(':');
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(parseInt(h), parseInt(m), 0, 0);
                this.nextPrayerName = 'Subuh';
                this.nextPrayerTime = tomorrow;
            }
        },

        updateCountdown() {
            const now = new Date();
            const diff = this.nextPrayerTime - now;

            // Jika tepat masuk waktu (jarak kurang 1.5 saat)
            if (diff <= 0 && diff > -1500) {
                this.playAzan();
                setTimeout(() => this.calculateNextPrayer(), 2000);
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
                this.audio.play().catch(err => {
                    console.warn("Autoplay block: Sila klik skrin untuk membolehkan bunyi.");
                    this.isAzanPlaying = false; 
                });

                // Berhenti automatik selepas 4 minit
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
                if (heading !== undefined) {
                    const relativeAngle = this.qiblaAngle - heading;
                    const pointer = document.getElementById('compass-pointer');
                    if (pointer) {
                        pointer.style.transform = `translateX(-50%) rotate(${relativeAngle}deg)`;
                    }
                }
            };

            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.body.addEventListener('click', () => {
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
            const map = { 
                Subuh: 'fa-cloud-moon', 
                Syuruk: 'fa-sun', 
                Zohor: 'fa-certificate', 
                Asar: 'fa-cloud-sun', 
                Maghrib: 'fa-moon', 
                Isyak: 'fa-star' 
            };
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
            this.error = "Gagal akses lokasi. Sila aktifkan GPS untuk waktu solat yang tepat.";
        },
        
        refreshData() {
            this.init();
        }
    },
    mounted() {
        this.init();
    }
}).mount('#solat-app');
