
// dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const defaultTheme = 'light';

    let currentTheme = localStorage.getItem('theme') || defaultTheme;
    applyTheme(currentTheme);
    updateIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            updateIcon(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    function applyTheme(theme) {
        document.body.classList.toggle('theme-dark', theme === 'dark');
    }

    function updateIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-regular');
            themeIcon.classList.add('fa-solid');
        } else {
            themeIcon.classList.remove('fa-solid');
            themeIcon.classList.add('fa-regular');
        }
    }
});
