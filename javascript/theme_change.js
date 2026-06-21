
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    let currentTheme = document.documentElement.dataset.theme || 'light';
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
        document.documentElement.classList.toggle('theme-dark', theme === 'dark');
        document.documentElement.dataset.theme = theme;
    }

    function updateIcon(theme) {
        if (!themeIcon) return;
        if (themeToggle) {
            themeToggle.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
            );
        }
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-regular');
            themeIcon.classList.add('fa-solid');
        } else {
            themeIcon.classList.remove('fa-solid');
            themeIcon.classList.add('fa-regular');
        }
    }
});
