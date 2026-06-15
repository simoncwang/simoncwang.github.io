const fs = require("node:fs");
const path = require("node:path");
const {
    pageFiles,
    relativePath,
    root,
    stripComments,
} = require("./site-files");

const errors = [];

for (const file of pageFiles) {
    const html = stripComments(fs.readFileSync(file, "utf8"));
    for (const match of html.matchAll(/\b(?:href|src|srcset)=["']([^"']+)["']/g)) {
        for (const reference of match[1].split(",").map((item) => item.trim().split(/\s+/)[0])) {
            if (
                !reference
                || reference.startsWith("#")
                || /^(?:https?:|mailto:|data:|\/\/)/.test(reference)
            ) continue;

            if (!fs.existsSync(path.resolve(path.dirname(file), reference))) {
                errors.push(`${relativePath(file)}: missing ${reference}`);
            }
        }
    }
}

for (const file of fs.readdirSync(path.join(root, "styles"))) {
    if (!file.endsWith(".css")) continue;
    const cssPath = path.join(root, "styles", file);
    const css = fs.readFileSync(cssPath, "utf8");
    for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        const reference = match[1].replace("\\,", ",");
        if (/^(?:https?:|data:)/.test(reference)) continue;
        if (!fs.existsSync(path.resolve(path.dirname(cssPath), reference))) {
            errors.push(`styles/${file}: missing ${reference}`);
        }
    }
}

if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}

console.log(`Validated local links and assets across ${pageFiles.length} pages.`);
