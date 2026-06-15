(() => {
  "use strict";

  const ROOT_PARTS = ["home", "visitor", "portfolio"];

  const directory = (children) => ({ type: "directory", children });
  const textFile = (content) => ({ type: "text", content });
  const link = (url, description = "") => ({ type: "link", url, description });
  const projectFiles = Object.fromEntries([
    ["all-projects", link("../projects/projectshome.html", "Browse the complete project portfolio")],
    ...(window.PORTFOLIO_PROJECTS || []).map((project) => [
      project.id,
      link(`../projects/${project.file}`, project.terminalDescription),
    ]),
  ]);

  const root = directory({
    "about.txt": textFile([
      "about.txt",
      "---------",
      "Hello, I am Simon.",
      "",
      "I am a research engineer interested in building useful,",
      "creative systems with AI and software. This page is a",
      "small browser-native experiment tucked inside my portfolio.",
    ].join("\n")),
    "contact.txt": textFile([
      "contact.txt",
      "-----------",
      "email     wang.c.simon@gmail.com",
      "github    github.com/simoncwang",
      "linkedin  linkedin.com/in/simon-wang-519902193",
    ].join("\n")),
    projects: directory(projectFiles),
    documents: directory({
      "resume.pdf": link("../documents/resume.pdf", "Resume"),
    }),
    links: directory({
      github: link("https://github.com/simoncwang", "GitHub profile"),
      linkedin: link("https://www.linkedin.com/in/simon-wang-519902193/", "LinkedIn profile"),
      email: link("mailto:wang.c.simon@gmail.com", "Email Simon"),
    }),
  });

  let currentParts = [];

  function parsePath(path = ".") {
    const trimmed = path.trim();
    if (!trimmed || trimmed === ".") return [...currentParts];

    if (trimmed === "~" || trimmed === "/") return [];

    const absolutePrefix = `/${ROOT_PARTS.join("/")}`;
    let parts;
    if (trimmed === absolutePrefix) {
      parts = [];
    } else if (trimmed.startsWith(`${absolutePrefix}/`)) {
      parts = trimmed.slice(absolutePrefix.length + 1).split("/");
    } else if (trimmed.startsWith("~/")) {
      parts = trimmed.slice(2).split("/");
    } else if (trimmed.startsWith("/")) {
      return { error: `path is outside the portfolio sandbox: ${trimmed}` };
    } else {
      parts = [...currentParts, ...trimmed.split("/")];
    }

    const normalized = [];
    for (const part of parts) {
      if (!part || part === ".") continue;
      if (part === "..") {
        if (!normalized.length) {
          return { error: "permission denied: you cannot leave the portfolio sandbox" };
        }
        normalized.pop();
      } else {
        normalized.push(part);
      }
    }
    return normalized;
  }

  function resolve(path = ".") {
    const parts = parsePath(path);
    if (!Array.isArray(parts)) return parts;

    let node = root;
    for (const part of parts) {
      if (node.type !== "directory" || !node.children[part]) {
        return { error: `no such file or directory: ${path}` };
      }
      node = node.children[part];
    }

    return { node, parts };
  }

  function getDisplayPath(parts = currentParts) {
    return parts.length ? `~/${parts.join("/")}` : "~";
  }

  function getAbsolutePath() {
    return `/${[...ROOT_PARTS, ...currentParts].join("/")}`;
  }

  function list(path = ".") {
    const result = resolve(path);
    if (result.error) return result;
    if (result.node.type !== "directory") {
      return { error: `not a directory: ${path}` };
    }

    const entries = Object.entries(result.node.children)
      .map(([name, node]) => ({ name, type: node.type, description: node.description || "" }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { entries };
  }

  function changeDirectory(path) {
    const result = resolve(path);
    if (result.error) return result;
    if (result.node.type !== "directory") {
      return { error: `not a directory: ${path}` };
    }

    currentParts = result.parts;
    return { path: getDisplayPath() };
  }

  function completePath(path = "") {
    const lastSlash = path.lastIndexOf("/");
    const directoryPath = lastSlash === -1 ? "." : path.slice(0, lastSlash) || "/";
    const prefix = lastSlash === -1 ? "" : path.slice(0, lastSlash + 1);
    const fragment = path.slice(lastSlash + 1).toLowerCase();
    const result = resolve(directoryPath);

    if (result.error || result.node.type !== "directory") return [];

    return Object.entries(result.node.children)
      .filter(([name]) => name.toLowerCase().startsWith(fragment))
      .map(([name, node]) => `${prefix}${name}${node.type === "directory" ? "/" : ""}`)
      .sort((a, b) => a.localeCompare(b));
  }

  function tree(path = ".") {
    const result = resolve(path);
    if (result.error) return result;

    const rootLabel = result.parts.length
      ? result.parts[result.parts.length - 1]
      : ".";

    if (result.node.type !== "directory") {
      return { lines: [rootLabel] };
    }

    const lines = [rootLabel];
    appendTreeLines(result.node, "", lines);
    return { lines };
  }

  function appendTreeLines(node, prefix, lines) {
    const entries = Object.entries(node.children)
      .sort(([a], [b]) => a.localeCompare(b));

    entries.forEach(([name, child], index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? "`-- " : "|-- ";
      const suffix = child.type === "directory" ? "/" : "";
      lines.push(`${prefix}${connector}${name}${suffix}`);

      if (child.type === "directory") {
        appendTreeLines(child, `${prefix}${isLast ? "    " : "|   "}`, lines);
      }
    });
  }

  window.TerminalFileSystem = {
    changeDirectory,
    completePath,
    getAbsolutePath,
    getDisplayPath,
    list,
    resolve,
    tree,
  };
})();
