(() => {
  "use strict";

  const themes = {
    default: "modern dark terminal",
    glacier: "cool blue terminal",
    matrix: "green-on-black glow",
    amber: "warm vintage terminal",
    light: "bright terminal for daylight",
  };

  let currentTheme = "default";

  function listThemes() {
    return Object.entries(themes).map(([name, description]) => ({
      name,
      description,
      active: name === currentTheme,
    }));
  }

  function names() {
    return Object.keys(themes);
  }

  function setTheme(name) {
    const normalizedName = name.toLowerCase();
    if (!themes[normalizedName]) {
      return {
        error: `unknown theme: ${name}`,
        names: Object.keys(themes),
      };
    }

    currentTheme = normalizedName;
    document.body.dataset.terminalTheme = currentTheme;
    return {
      name: currentTheme,
      description: themes[currentTheme],
    };
  }

  setTheme(currentTheme);

  window.TerminalThemes = {
    listThemes,
    names,
    setTheme,
  };
})();
