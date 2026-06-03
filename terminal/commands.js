(() => {
  "use strict";

  const fileSystem = window.TerminalFileSystem;
  const themes = window.TerminalThemes;
  const commandNames = [
    "help",
    "clear",
    "history",
    "theme",
    "tour",
    "whoami",
    "tree",
    "pwd",
    "ls",
    "cd",
    "open",
    "exit",
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
      "theme": handleTheme,
      "tour": showTour,
      "whoami": showWhoami,
      "tree": (args) => showTree(args[0] || "."),
      "pwd": () => terminal.writeText(fileSystem.getAbsolutePath()),
      "ls": (args) => listPath(args[0] || "."),
      "cd": (args) => changeDirectory(args[0]),
      "open": (args) => openPath(args[0]),
      "exit": exitTerminal,
      "/exit": exitTerminal,
      "/rain": terminal.runAsciiRain,
    };

    function showHelp() {
      terminal.writeMarkup([
        '<span class="output-accent">shell commands</span>',
        formatHelpRow("help", "show this command guide"),
        formatHelpRow("tour", "show a short walkthrough"),
        formatHelpRow("whoami", "identify the person behind the terminal"),
        formatHelpRow("tree [path]", "show the virtual portfolio tree"),
        formatHelpRow("ls [path]", "list a virtual directory"),
        formatHelpRow("cd <path>", "change virtual directories"),
        formatHelpRow("open <path>", "read a text file or open a link in a new tab"),
        formatHelpRow("pwd", "print the current working directory"),
        formatHelpRow("theme list", "show available terminal themes"),
        formatHelpRow("theme set <theme>", "switch themes"),
        formatHelpRow("clear", "clear the terminal"),
        formatHelpRow("history", "show commands from this session"),
        formatHelpRow("exit", "return to the main website"),
        "",
        '<span class="output-muted">try: whoami, open contact.txt, cd projects, open wildlife-analyzer</span>',
        '<span class="output-muted">tips: use Tab to autocomplete and ArrowUp / ArrowDown for history.</span>',
      ].join("\n"));
    }

    function formatHelpRow(command, description) {
      return [
        '  <span class="help-command">',
        terminal.escapeHtml(command.padEnd(18, " ")),
        '</span><span class="help-description">',
        terminal.escapeHtml(description),
        '</span>',
      ].join("");
    }

    function exitTerminal() {
      window.location.href = "../index.html";
    }

    function handleTheme(args) {
      const [firstArg, secondArg] = args;
      if (!firstArg || firstArg === "list") {
        terminal.writeMarkup([
          '<span class="output-accent">available themes</span>',
          ...themes.listThemes().map((theme) => {
            const marker = theme.active ? "*" : " ";
            return `  ${marker} ${theme.name.padEnd(8, " ")} ${theme.description}`;
          }),
          "",
          '<span class="output-muted">usage: theme set &lt;name&gt; or theme &lt;name&gt;</span>',
        ].join("\n"));
        return;
      }

      const nextTheme = firstArg === "set" ? secondArg : firstArg;
      if (!nextTheme) {
        terminal.writeError("usage: theme set <name>");
        return;
      }

      const result = themes.setTheme(nextTheme);
      if (result.error) {
        terminal.writeError(`${result.error}\navailable themes: ${result.names.join(", ")}`);
        return;
      }

      terminal.writeMarkup(
        `theme set to <span class="output-accent">${result.name}</span> - ${result.description}`,
      );
    }

    function showTour() {
      terminal.writeMarkup([
        '<span class="output-accent">terminal tour</span>',
        "",
        "This is a small read-only shell for exploring Simon's portfolio.",
        "Try this path through the experience:",
        "",
        "  whoami",
        "  tree",
        "  open about.txt",
        "  cd projects",
        "  ls",
        "  open wildlife-analyzer",
        "  cd ../documents",
        "  open resume.pdf",
        "",
        '<span class="output-muted">Nothing here modifies files. open either prints a virtual text file or opens a link in a new tab.</span>',
      ].join("\n"));
    }

    function showWhoami() {
      terminal.writeText([
        "simon",
        "role: research engineer",
        "interests: agentic systems, creative tools, human-AI interaction",
        "site: a lightweight portfolio with a hidden terminal interface",
        "status: building useful things with a little bit of weirdness",
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

    function showTree(path) {
      const result = fileSystem.tree(path);
      if (result.error) {
        terminal.writeError(result.error);
        return;
      }

      terminal.writeText(result.lines.join("\n"));
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

    async function openPath(path) {
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

      terminal.writeText([
        path,
        "-".repeat(path.length),
        result.node.description || "Portfolio link",
        "",
        `opening ${path} in a new tab in a moment...`,
      ].join("\n"));

      await terminal.delay(1000);
      const openedWindow = window.open(result.node.url, "_blank", "noopener,noreferrer");
      if (openedWindow) openedWindow.opener = null;
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
