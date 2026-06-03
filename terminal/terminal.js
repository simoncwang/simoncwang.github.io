(() => {
  "use strict";

  const output = document.getElementById("terminal-output");
  const terminalBody = document.getElementById("terminal-body");
  const promptForm = document.getElementById("prompt-form");
  const promptPath = document.getElementById("prompt-path");
  const input = document.getElementById("terminal-input");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const commandHistory = [];
  let historyIndex = 0;
  let isBusy = true;

  const asciiWordmark = [
    "  _____ ___ __  __  ___  _   _ ",
    " /  ___|_ _|  \\/  |/ _ \\| \\ | |",
    " \\ `--. | || |\\/| | | | |  \\| |",
    "  `--. \\| || |  | | | | | . ` |",
    " /\\__/ /| || |  | | |_| | |\\  |",
    " \\____/|___|_|  |_|\\___/\\_| \\_/",
  ].join("\n");

  function createBlock(className = "") {
    const block = document.createElement("div");
    block.className = `output-block ${className}`.trim();
    output.appendChild(block);
    return block;
  }

  function writeMarkup(html, className = "") {
    const block = createBlock(className);
    block.innerHTML = html;
    scrollToBottom();
    return block;
  }

  function writeText(text, className = "") {
    const block = createBlock(className);
    block.textContent = text;
    scrollToBottom();
    return block;
  }

  function writeError(text) {
    return writeText(text, "output-error");
  }

  function clear() {
    output.replaceChildren();
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function updatePrompt() {
    promptPath.textContent = `:${window.TerminalFileSystem.getDisplayPath()}$`;
  }

  function showPrompt() {
    isBusy = false;
    input.disabled = false;
    promptForm.classList.remove("is-hidden");
    input.focus();
    scrollToBottom();
  }

  function hidePrompt() {
    isBusy = true;
    input.disabled = true;
    promptForm.classList.add("is-hidden");
  }

  function echoCommand(value) {
    const block = createBlock("output-echo");
    const user = document.createElement("span");
    const command = document.createElement("span");

    user.className = "prompt-user";
    user.textContent = "visitor@simoncwang.github.io";
    command.textContent = `${promptPath.textContent} ${value}`;

    block.append(user, command);
  }

  function completeCommand() {
    const value = input.value;
    if (!value) return;

    const firstSpace = value.indexOf(" ");
    if (firstSpace === -1) {
      const matches = commandRegistry.names.filter((command) => (
        command.startsWith(value.toLowerCase())
      ));
      if (matches.length === 1) input.value = matches[0];
      return;
    }

    const command = value.slice(0, firstSpace).toLowerCase();
    if (!["cd", "ls", "open"].includes(command)) return;

    const spacing = value.slice(0, firstSpace + 1);
    const path = value.slice(firstSpace + 1);
    const matches = window.TerminalFileSystem.completePath(path);
    if (matches.length === 1) input.value = `${spacing}${matches[0]}`;
  }

  function browseHistory(direction) {
    if (!commandHistory.length) return;

    historyIndex = Math.min(
      commandHistory.length,
      Math.max(0, historyIndex + direction),
    );
    input.value = historyIndex === commandHistory.length
      ? ""
      : commandHistory[historyIndex];
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function boot() {
    const bootLines = reduceMotion
      ? ["initializing portfolio terminal..."]
      : [
          "initializing portfolio terminal...",
          "loading creative runtime...",
          "establishing visitor session...",
        ];

    for (const line of bootLines) {
      writeText(line, "output-muted");
      if (!reduceMotion) await delay(360);
    }

    if (!reduceMotion) await delay(180);
    writeText(asciiWordmark, "output-ascii");
    writeMarkup([
      '<span class="output-accent">session ready.</span>',
      'type <span class="output-accent">help</span> to explore.',
    ].join("\n"));
    showPrompt();
  }

  async function runAsciiRain() {
    hidePrompt();
    writeMarkup('<span class="output-accent">weather service:</span> localized ASCII rain incoming...');

    if (reduceMotion) {
      writeText("  |  .  |  .  |  .  |  .  |\n  .  |  .  |  .  |  .  |  .\n     forecast: calm after the rain.", "rain-frame");
      showPrompt();
      return;
    }

    const frame = createBlock("rain-frame");
    const characters = ["|", ":", ".", "'", " "];
    const width = window.innerWidth < 640 ? 36 : 68;
    const height = window.innerWidth < 640 ? 10 : 14;

    for (let tick = 0; tick < 16; tick += 1) {
      const lines = [];
      for (let row = 0; row < height; row += 1) {
        let line = "";
        for (let column = 0; column < width; column += 1) {
          const density = (row + tick) % 5 === 0 ? 0.48 : 0.2;
          line += Math.random() < density
            ? characters[Math.floor(Math.random() * (characters.length - 1))]
            : " ";
        }
        lines.push(line);
      }
      frame.textContent = lines.join("\n");
      scrollToBottom();
      await delay(86);
    }

    frame.remove();
    writeMarkup('<span class="output-muted">forecast: calm after the rain.</span>');
    showPrompt();
  }

  const commandRegistry = window.TerminalCommands.createCommands({
    clear,
    delay,
    escapeHtml,
    getHistory: () => commandHistory,
    runAsciiRain,
    updatePrompt,
    writeError,
    writeMarkup,
    writeText,
  });

  promptForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    input.value = "";
    if (!value) return;

    echoCommand(value);
    commandHistory.push(value);
    historyIndex = commandHistory.length;
    commandRegistry.execute(value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      completeCommand();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      browseHistory(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      browseHistory(1);
    }
  });

  terminalBody.addEventListener("click", () => {
    if (!isBusy) input.focus();
  });

  updatePrompt();
  boot();
})();
