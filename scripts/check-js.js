const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { root } = require("./site-files");

const directories = ["javascript", "scripts", "terminal"];
const files = directories.flatMap((directory) => (
    fs.readdirSync(path.join(root, directory), { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
        .map((entry) => path.join(root, directory, entry.name))
));

for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) {
        process.stderr.write(result.stderr);
        process.exit(result.status || 1);
    }
}

console.log(`Checked JavaScript syntax in ${files.length} files.`);
