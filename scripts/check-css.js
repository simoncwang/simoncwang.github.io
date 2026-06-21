const fs = require("node:fs");
const path = require("node:path");
const { buildCss, modules } = require("./css-modules");
const { root } = require("./site-files");

const current = fs.readFileSync(path.join(root, "style.css"), "utf8");
const expected = buildCss();

if (current !== expected) {
    console.error("style.css is stale. Run npm run css:build.");
    process.exit(1);
}

console.log(`Validated compiled CSS from ${modules.length} modules.`);
