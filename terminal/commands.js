(() => {
  "use strict";

  const fileSystem = window.TerminalFileSystem;
  const commandNames = [
    "/help",
    "/about",
    "/contact",
    "/clear",
    "/exit",
    "help",
    "clear",
    "history",
    "pwd",
    "ls",
    "cd",
    "open",
  ];

  function createCommands(terminal) {
    const commands = {
      "/help": showHelp,
      "help": showHelp,
      "/about": () => openPath("~/about.txt"),
      "/contact": () => openPath("~/contact.txt"),
      "/clear": terminal.clear,
      "clear": terminal.clear,
      "history": () => {
        terminal.writeText(
          terminal.getHistory()
            .map((command, index) => `${String(index + 1).padStart(3, " ")}  ${command}`)
            .join("\n"),
        );
      },
      "pwd": () => terminal.writeText(fileSystem.getAbsolutePath()),
      "ls": (args) => listPath(args[0] || "."),
      "cd": (args) => changeDirectory(args[0]),
      "open": (args) => openPath(args[0]),
      "/exit": () => {
        window.location.href = "../index.html";
      },
      "/rain": terminal.runAsciiRain,
    };

    function showHelp() {
      terminal.writeMarkup([
        '<span class="output-accent">portfolio commands</span>',
        "  /about          open a short introduction",
        "  /contact        show contact information",
        "  /exit           return to the main website",
        "",
        '<span class="output-accent">shell commands</span>',
        "  help            show this command guide",
        "  clear           clear the terminal",
        "  history         show commands from this session",
        "  pwd             print the current working directory",
        "  ls [path]       list a virtual directory",
        "  cd &lt;path&gt;       change virtual directories",
        "  open &lt;path&gt;     read a text file or open a link in a new tab",
        "",
        '<span class="output-muted">tips: use Tab to autocomplete and ArrowUp / ArrowDown for history.</span>',
      ].join("\n"));
    }

    function listPath(path) {
      const result = fileSystem.list(path);
      if (result.error) {
        terminal.writeError(result.error);
        return;
      }

      terminal.writeMarkup(
        result.entries
          .map((entry) => {
            const suffix = entry.type === "directory" ? "/" : "";
            const className = entry.type === "directory"
              ? "output-directory"
              : entry.type === "link"
                ? "output-link"
                : "output-accent";
            return `<span class="${className}">${terminal.escapeHtml(entry.name)}${suffix}</span>`;
          })
          .join("  "),
      );
    }

    function changeDirectory(path) {
      if (!path) {
        terminal.writeError("usage: cd <path>");
        return;
      }

      const result = fileSystem.changeDirectory(path);
      if (result.error) {
        terminal.writeError(result.error);
        return;
      }

      terminal.updatePrompt();
    }

    function openPath(path) {
      if (!path) {
        terminal.writeError("usage: open <path>");
        return;
      }

      const result = fileSystem.resolve(path);
      if (result.error) {
        terminal.writeError(result.error);
        return;
      }

      if (result.node.type === "directory") {
        terminal.writeError(`cannot open directory: ${path}. Try cd ${path} or ls ${path}.`);
        return;
      }

      if (result.node.type === "text") {
        terminal.writeText(result.node.content);
        return;
      }

      const openedWindow = window.open(result.node.url, "_blank", "noopener,noreferrer");
      if (openedWindow) openedWindow.opener = null;
      terminal.writeText(`opening ${path} in a new tab...`);
    }

    return {
      execute(rawValue) {
        const tokens = rawValue.trim().split(/\s+/);
        const commandName = tokens.shift().toLowerCase();
        const handler = commands[commandName];
        if (!handler) {
          terminal.writeError(`command not found: ${rawValue}\ntype help to see the available commands.`);
          return;
        }

        handler(tokens);
      },
      names: commandNames,
    };
  }

  window.TerminalCommands = { createCommands };
})();
