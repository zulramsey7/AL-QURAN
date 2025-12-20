/* Fail: solat.css */
:root {
  --primary-green: #198754;
  --dark-green: #146c43;
  --soft-green: #eafaf1;
  --gold: #ffc107;
  --dark-text: #2c3e50;
}

[v-cloak] { display: none; }

body {
  background-color: #f8f9fa;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--dark-text);
}

/* Navbar Consistency */
.navbar {
  background: var(--primary-green) !important;
  z-index: 1050;
}

/* Hero Section dengan Animasi Gradient Hijau */
.prayer-hero {
  background: linear-gradient(-45deg, #146c43, #198754, #20c997, #157347);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  color: white;
  padding: 80px 0 120px 0;
  border-radius: 0 0 50px 50px;
  margin-bottom: -40px;
  position: relative;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.location-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 50px;
  display: inline-block;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.countdown-box {
  background: rgba(0, 0, 0, 0.15);
  padding: 15px 30px;
  border-radius: 20px;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

/* --- Azan Floating Controller --- */
.stop-azan-overlay {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: white;
  padding: 15px 25px;
  border-radius: 100px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  border: 2px solid var(--primary-green);
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 300px;
  justify-content: center;
}

/* --- Compass Logic --- */
.compass-dial {
  width: 200px;
  height: 200px;
  border: 10px solid #ffffff;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  background: #ffffff;
}

.kaaba-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--dark-text);
  z-index: 1;
}

.needle {
  width: 4px;
  height: 80px;
  background: #dc3545; /* Jarum Merah */
  position: absolute;
  top: 20px;
  left: 50%;
  transform-origin: bottom center;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 2px;
  z-index: 2;
}

/* --- Prayer Cards --- */
.prayer-list {
  display: grid;
  gap: 15px;
}

.prayer-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

/* Highlight Waktu Solat Semasa */
.prayer-card.active-now {
  background: var(--soft-green);
  border: 1px solid var(--primary-green);
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(25, 135, 84, 0.1);
}

/* Icon Animation when Azan is playing */
.fa-volume-up.text-success {
  animation: pulse-audio 1.5s infinite;
}

@keyframes pulse-audio {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.prayer-icon-wrapper {
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-green);
  font-size: 1.4rem;
}

.active-now .prayer-icon-wrapper {
  background: var(--primary-green);
  color: white;
}

/* --- Table & UI --- */
.card-rounded {
  border-radius: 25px !important;
  overflow: hidden;
}

.table thead th {
  background-color: #f8f9fa;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 15px;
}

.table-success {
  --bs-table-bg: var(--soft-green);
  --bs-table-border-color: var(--primary-green);
  font-weight: bold;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .prayer-hero {
    padding: 60px 0 100px 0;
    border-radius: 0 0 40px 40px;
  }
  
  .display-3 { font-size: 2.5rem; }
  
  .stop-azan-overlay {
    width: 90%;
    bottom: 20px;
    padding: 10px 15px;
    font-size: 0.85rem;
  }
}
