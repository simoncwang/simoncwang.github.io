const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const imageManifest = require("./image-manifest.json");
const generatedManifest = require("../images/generated/manifest.json");
const {
    loadProjectData,
    pageFiles,
    root,
    stripComments,
} = require("./site-files");

const { projects, featured } = loadProjectData();

async function main() {
    const html = pageFiles
        .map((file) => stripComments(fs.readFileSync(file, "utf8")))
        .join("\n");
    const staticSources = [...html.matchAll(/<img\b[^>]*src=["']([^"']+\.(?:png|jpe?g|webp|avif))["']/gi)]
        .map((match) => path.normalize(match[1].replace(/^\.\.\//, "").replace(/^\.\//, "")));
    const highlightSources = [...projects, ...featured]
        .filter((entry) => entry.highlight)
        .map((entry) => entry.highlight.image.source);
    const liveSources = new Set([...staticSources, ...highlightSources]);
    const manifestSources = new Set(imageManifest.map((entry) => entry.source));

    for (const source of liveSources) {
        if (!manifestSources.has(source)) throw new Error(`Live raster missing from manifest: ${source}`);
    }
    for (const source of manifestSources) {
        if (!liveSources.has(source)) throw new Error(`Unreferenced raster in manifest: ${source}`);
    }

    for (const entry of generatedManifest) {
        const sourceMetadata = await sharp(path.join(root, entry.source)).metadata();
        for (const width of entry.generatedWidths) {
            for (const extension of ["avif", "webp"]) {
                const slug = path.basename(entry.source, path.extname(entry.source))
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                const generatedPath = path.join(root, "images", "generated", `${slug}-${width}.${extension}`);
                if (!fs.existsSync(generatedPath)) throw new Error(`Missing generated image: ${generatedPath}`);
                const metadata = await sharp(generatedPath).metadata();
                if (metadata.width > sourceMetadata.width || metadata.height > sourceMetadata.height) {
                    throw new Error(`${generatedPath} exceeds its source dimensions`);
                }
            }
        }
    }

    console.log(`Validated ${manifestSources.size} source images and all generated derivatives.`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
