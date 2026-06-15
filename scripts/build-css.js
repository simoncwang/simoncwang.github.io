const fs = require("node:fs");
const path = require("node:path");
const { buildCss } = require("./css-modules");
const { root } = require("./site-files");

fs.writeFileSync(path.join(root, "style.css"), buildCss());
console.log("Built style.css from modular sources.");
