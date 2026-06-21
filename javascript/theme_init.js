(() => {
    "use strict";

    const storedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    const theme = storedTheme || systemTheme;

    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
})();
