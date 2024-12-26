
// dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
    // changing the icon of the dark mode toggle
    // Get the button and icon elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check if dark mode is already enabled in localStorage (optional)
    if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-regular');
    themeIcon.classList.add('fa-solid'); // Set moon icon
    }

    // Function to toggle dark mode and switch icons
    themeToggle.addEventListener('click', function() {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-solid');
        themeIcon.classList.add('fa-regular'); // Set sun icon
        localStorage.setItem('darkMode', 'disabled'); // Optional: store the state
    } else {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-regular');
        themeIcon.classList.add('fa-solid'); // Set moon icon
        localStorage.setItem('darkMode', 'enabled'); // Optional: store the state
    }
    });

    const toggleButton = document.getElementById('theme-toggle');
    const targetElements = document.querySelectorAll('[data-theme-target]');
    const defaultTheme = 'light'; // Default theme if not set
    const originalColors = {}; // Store original colors for restoration
    const originalTextColors = {}; // Store original text colors for restoration
    const originalLinkColors = {}; // Store original link colors within target elements
    const navLinkColors = {};

    // getting references to the header and footer
    let navElements = document.querySelectorAll('.navbar, .footer');

    navElements.forEach((el) => {
        const links = el.querySelectorAll('a');
        links.forEach((link) => {
            navLinkColors[link.href] = getComputedStyle(link).color;
        });
    });
  
    // Store the original background, text, and link colors
    targetElements.forEach((el) => {
      originalColors[el.id] = getComputedStyle(el).backgroundColor;
      originalTextColors[el.id] = getComputedStyle(el).color;
      
      // Store link colors for each target element
      const links = el.querySelectorAll('a');
      links.forEach((link) => {
        originalLinkColors[link.href] = getComputedStyle(link).color;
      });
    });
  
    // Load and apply the saved theme
    let currentTheme = localStorage.getItem('theme') || defaultTheme;
    applyTheme(currentTheme);
  
    // Toggle button click event
    toggleButton.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  
    // Apply the theme
    function applyTheme(theme) {
        navElements.forEach((el => {
            const links = el.querySelectorAll('a');
            if (theme === 'dark') {
                links.forEach((link) => {
                    link.style.color = '#ffffff';
                });
                el.style.backgroundColor = '#85b8ab';
                el.style.color = "white"
            } else {
                el.style.backgroundColor = '#cde4df';
                links.forEach((link) => {
                    link.style.color = navLinkColors[link.href]
                });
                el.style.color = "black"
            }
        }));
        
        targetElements.forEach((el) => {
        if (theme === 'dark') {
            // Darken the background color
            const darkerColor = darkenColor(originalColors[el.id], 60);
            el.style.backgroundColor = darkerColor;

            // Lighten the text color
            const lighterTextColor = lightenColor(originalTextColors[el.id], 80);
            el.style.color = lighterTextColor;

            // Adjust the link colors for dark mode
            const links = el.querySelectorAll('a');
            links.forEach((link) => {
            const lighterLinkColor = lightenColor(originalLinkColors[link.href], 50);
            link.style.color = lighterLinkColor;
            });
        } else {
            // Restore original background, text, and link colors
            el.style.backgroundColor = originalColors[el.id];
            el.style.color = originalTextColors[el.id]; // Restore original text color

            // Restore the link colors
            const links = el.querySelectorAll('a');
            links.forEach((link) => {
            link.style.color = originalLinkColors[link.href];
            });
        }
        });
    }
  
    // Function to darken a color (background color)
    function darkenColor(color, percent) {
      const rgbMatch = color.match(/rgba?\((\d+), (\d+), (\d+)/);
      if (!rgbMatch) return color; // If not a valid color, return as-is
  
      const [_, r, g, b] = rgbMatch.map(Number);
      const adjust = (value) => Math.max(0, Math.min(255, value - Math.round((percent / 100) * 255)));
  
      return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
    }
  
    // Function to lighten a color (text color or links)
    function lightenColor(color, percent) {
      const rgbMatch = color.match(/rgba?\((\d+), (\d+), (\d+)/);
      if (!rgbMatch) return color; // If not a valid color, return as-is
  
      const [_, r, g, b] = rgbMatch.map(Number);
      const adjust = (value) => Math.max(0, Math.min(255, value + Math.round((percent / 100) * 255)));
  
      return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
    }
  });