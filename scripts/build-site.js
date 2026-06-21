const fs = require("node:fs/promises");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "_site");

const requiredFiles = [
    "index.html",
    "blog.html",
    "courses.html",
    "playground.html",
    "style.css",
];

const optionalFiles = [
    "_config.yml",
    "404.html",
    "CNAME",
];

const publicDirectories = [
    "assets",
    "backgrounds",
    "documents",
    "fonts",
    "images",
    "javascript",
    "projects",
    "terminal",
];

async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function copyFile(relativePath) {
    const source = path.join(root, relativePath);
    if (!await exists(source)) {
        throw new Error(`Missing required deploy file: ${relativePath}`);
    }
    const destination = path.join(outputDirectory, relativePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination);
}

async function copyOptionalFile(relativePath) {
    const source = path.join(root, relativePath);
    if (!await exists(source)) return;
    const destination = path.join(outputDirectory, relativePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination);
}

async function copyDirectory(relativePath) {
    const source = path.join(root, relativePath);
    if (!await exists(source)) {
        throw new Error(`Missing required deploy directory: ${relativePath}`);
    }
    await fs.cp(source, path.join(outputDirectory, relativePath), {
        recursive: true,
        dereference: false,
        filter: (filePath) => path.basename(filePath) !== ".DS_Store",
    });
}

async function main() {
    await fs.rm(outputDirectory, { recursive: true, force: true });
    await fs.mkdir(outputDirectory, { recursive: true });

    for (const file of requiredFiles) await copyFile(file);
    for (const file of optionalFiles) await copyOptionalFile(file);
    for (const directory of publicDirectories) await copyDirectory(directory);

    await fs.writeFile(path.join(outputDirectory, ".nojekyll"), "");
    console.log("Built deployable site in _site/.");
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
