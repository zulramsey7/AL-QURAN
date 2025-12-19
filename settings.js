document.addEventListener('DOMContentLoaded', () => {
  const darkModeSwitch = document.getElementById('darkModeSwitch');
  const resetBtn = document.getElementById('resetData');

  // 1. Semak status Dark Mode sedia ada
  if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      darkModeSwitch.checked = true;
  }

  // 2. Event Listener untuk Dark Mode
  darkModeSwitch.addEventListener('change', () => {
      if (darkModeSwitch.checked) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
      } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
      }
  });

  // 3. Reset Data (Hapus rekod kehadiran)
  resetBtn.addEventListener('click', () => {
      if (confirm('Adakah anda pasti mahu membuang semua rekod kehadiran harian?')) {
          localStorage.removeItem('attendanceCount');
          localStorage.removeItem('lastVisit');
          alert('Data telah berjaya set semula.');
          window.location.reload();
      }
  });
});