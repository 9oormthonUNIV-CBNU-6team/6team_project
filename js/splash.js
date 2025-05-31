window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';

    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('home').classList.remove('hidden');
    }, 300); // 300ms dissolve duration
  }, 1200); // 1200ms delay
});
