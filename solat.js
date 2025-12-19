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
            nextPrayerTime: '',
            dailyTimes: {},
            monthlyData: [],
            qiblaAngle: 0,
            error: null,
            // Muat tetapan dari LocalStorage jika ada
            azanSettings: JSON.parse(localStorage.getItem('azanSettings')) || { 
                Subuh: true, Zohor: true, Asar: true, Maghrib: true, Isyak: true 
            },
            currentMonthName: new Date().toLocaleString('ms-MY', { month: 'long' })
        }
    },
    watch: {
        // Simpan setiap kali user tukar switch azan
        azanSettings: {
            handler(val) {
                localStorage.setItem('azanSettings', JSON.stringify(val));
            },
            deep: true
        }
    },
    methods: {
        async init() {
            this.loading = true;
            this.updateClock();
            setInterval(this.updateClock, 1000);
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.handleLocation, this.handleLocationError);
            } else {
                this.error = "Geolocation tidak disokong oleh pelayar anda.";
                this.loading = false;
            }
        },

        async handleLocation(position) {
            const { latitude, longitude } = position.coords;
            try {
                // 1. Ambil Waktu Solat Harian & Tarikh Hijri
                const date = new Date().toISOString().split('T')[0];
                const res = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=11`);
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
                    // Bersihkan nama lokasi (contoh: Asia/Kuala_Lumpur jadi Kuala Lumpur)
                    this.locationName = data.data.meta.timezone.split('/').pop().replace('_', ' ');

                    // 2. Ambil Jadual Bulanan
                    const monthRes = await fetch(`https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=11`);
                    const monthData = await monthRes.json();
                    this.monthlyData = monthData.data;

                    // 3. Ambil Arah Kiblat
                    const qiblaRes = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
                    const qiblaData = await qiblaRes.json();
                    this.qiblaAngle = Math.round(qiblaData.data.direction);
                    
                    this.calculateNextPrayer();
                    this.initCompass();
                }
                this.loading = false;
            } catch (e) {
                console.error(e);
                this.error = "Gagal memuatkan data API. Sila periksa sambungan internet.";
                this.loading = false;
            }
        },

        updateClock() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('ms-MY', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
            });
            if (this.nextPrayerTime) this.updateCountdown();
        },

        calculateNextPrayer() {
            const now = new Date();
            // Senarai waktu solat untuk dibandingkan (kecuali Syuruk untuk countdown)
            const prayerNames = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
            
            for (let name of prayerNames) {
                const [h, m] = this.dailyTimes[name].split(':');
                const pDate = new Date();
                pDate.setHours(h, m, 0);
                
                if (pDate > now) {
                    this.nextPrayerName = name;
                    this.nextPrayerTime = pDate;
                    return;
                }
            }

            // Jika semua sudah lepas (Isyak lepas), set ke Subuh esok
            const [h, m] = this.dailyTimes['Subuh'].split(':');
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(h, m, 0);
            this.nextPrayerName = 'Subuh (Esok)';
            this.nextPrayerTime = tomorrow;
        },

        updateCountdown() {
            const diff = this.nextPrayerTime - new Date();
            if (diff <= 0) {
                this.calculateNextPrayer(); // Refresh jika countdown habis
                return;
            }
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            this.countdown = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        },

        initCompass() {
            // Logik untuk peranti yang menyokong sensor kompas
            if (window.DeviceOrientationEvent) {
                const handler = (e) => {
                    let heading = e.webkitCompassHeading || e.alpha;
                    if (heading !== undefined) {
                        // Tolak heading semasa dari angle kiblat untuk dapatkan arah relatif
                        const relativeAngle = this.qiblaAngle - heading;
                        const pointer = document.getElementById('compass-pointer');
                        if (pointer) {
                            pointer.style.transform = `translateX(-50%) rotate(${relativeAngle}deg)`;
                        }
                    }
                };

                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    // Perlu untuk iOS
                    DeviceOrientationEvent.requestPermission().then(state => {
                        if (state === 'granted') window.addEventListener('deviceorientation', handler);
                    });
                } else {
                    window.addEventListener('deviceorientationabsolute', handler);
                    window.addEventListener('deviceorientation', handler);
                }
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

        formatTime(t) { 
            return t ? t.split(' ')[0] : '--:--'; 
        },

        isToday(dateStr) {
            // Format API Aladhan: DD-MM-YYYY
            const now = new Date();
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();
            const today = `${d}-${m}-${y}`;
            return dateStr === today;
        },

        refreshData() { 
            this.loading = true;
            location.reload(); 
        },

        handleLocationError(error) {
            this.loading = false;
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    this.error = "Sila benarkan akses lokasi untuk waktu solat yang tepat.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    this.error = "Maklumat lokasi tidak tersedia.";
                    break;
                default:
                    this.error = "Ralat lokasi berlaku.";
            }
        }
    },
    mounted() {
        this.init();
    }
}).mount('#solat-app');