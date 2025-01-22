
// dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
    // changing the icon of the dark mode toggle
    // Get the button and icon elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const targetElements = document.querySelectorAll('[data-theme-target]');
    const defaultTheme = 'light'; // Default theme if not set
    const originalColors = {}; // Store original colors for restoration
    const originalTextColors = {}; // Store original text colors for restoration
    const originalLinkColors = {}; // Store original link colors within target elements
    const navLinkColors = {};

    // getting references to the header and footer
    let navElements = document.querySelectorAll('.navbar, .footer, .navbar-brand');

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

    // storing original color of the body
    originalColors["body"] = getComputedStyle(document.body).backgroundColor;
  
    // Load and apply the saved theme
    let currentTheme = localStorage.getItem('theme') || defaultTheme;
    updateIcon(currentTheme);
    applyTheme(currentTheme);
  
    // Toggle button click event, update theme
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      updateIcon(currentTheme);

      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });

    // function to update lightbulb icon
    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-regular');
            themeIcon.classList.add('fa-solid'); 
        } else {
            themeIcon.classList.remove('fa-solid');
            themeIcon.classList.add('fa-regular'); 
        }
    }
  
    // Apply the theme
    function applyTheme(theme) {
        // change background color of the body to theme
        // if (theme === 'dark') {
        //     // Darken the background color
        //     var darkerColor = darkenColor(originalColors["body"], 30);
        //     console.log(darkerColor);
        //     document.body.style.backgroundColor = darkerColor;
        // } else {
        //     console.log(originalColors["body"]);
        //     document.body.style.backgroundColor = originalColors["body"];
        // }
        // applying theme for any data-theme-target elements
        targetElements.forEach((el) => {
            if (theme === 'dark') {
                // Darken the background color
                const darkerColor = darkenColor(originalColors[el.id], 70);
                el.style.backgroundColor = darkerColor;
    
                // Lighten the text color
                const lighterTextColor = lightenColor(originalTextColors[el.id], 80);
                // el.style.color = lighterTextColor;
                el.style.color = "#dceed4";
    
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


        // for course page switch list border colors
        listItems = document.querySelectorAll('.list-group-item');
        listItems.forEach((el => {
            if (theme === 'dark') {
                el.style.borderColor = "#c0b69e";
            } else {
                el.style.borderColor = "#6e6e6e";
            }
        }));

        // applying theme to sidenav section headers and buttons
        sectionButtons = document.querySelectorAll('.section-button');
        sectionButtons.forEach((el => {
            if (theme === 'dark') {
                el.style.color = "#9edecf";
            } else {
                el.style.color = "black";
            }
        }));

        // updating hover color of section-header
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(el => {
            if (theme === 'dark') {
                el.style.setProperty('--hover-color', '#177951');
            } else {
                el.style.setProperty('--hover-color', '#7fa5b9');
            }
        });


        // different color for active sidenav element
        activeSideNav = document.querySelectorAll('.sidenav .nav-item.nav-link.active');
        activeSideNav.forEach((el => {
            if (theme === 'dark') {
                el.style.backgroundColor = "#0b4d3a";
            } else {
                el.style.backgroundColor = "#b0d0ea";
            }
        }));

        // applying theme to top nav and footer elements
        navElements.forEach((el => {
            const links = el.querySelectorAll('a');
            if (theme === 'dark') {
                links.forEach((link) => {
                    link.style.color = '#ffffff';
                });
                // el.style.background = "linear-gradient(-90deg, #486a67,#688d8b, #7f9f98, #8bb4aa)";
                el.style.backgroundColor = '#85b8ab';
                el.style.color = "white"
            } else {
                // el.style.background = "linear-gradient(90deg, #a2c0c3,#abcbc5, #cde4df, #d4eadb)";
                el.style.backgroundColor = '#cde4df';
                links.forEach((link) => {
                    link.style.color = navLinkColors[link.href]
                });
                el.style.color = "black"
            }
        }));
        
        // switching pre element colors
        const pres = document.querySelectorAll("pre");
        pres.forEach((el) => {
            if (theme === "dark") {
                el.style.color="#dba4d7";
            } else {
                el.style.color="#b33cab";
            }
        });

        // switching project highlight titles
        const highlight_titles = document.querySelectorAll(".highlight-link h3");
        highlight_titles.forEach((el) => {
            if (theme === "dark") {
                el.style.color = "#dceed4";
            } else {
                el.style.color = "black";
            }
        });

        // switching tag colors
        const tags = document.querySelectorAll(".tag");
        tags.forEach((el) => {
            if (theme==="dark") {
                el.style.color="#dceed4";
            } else{
                el.style.color="#006f4a";
            }
        });

        // switching skill colors
        const skills = document.querySelectorAll(".skill");
        skills.forEach((el) => {
            if (theme==="dark") {
                el.style.color="#d6e3f7";
            } else{
                el.style.color="#0d006f";
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