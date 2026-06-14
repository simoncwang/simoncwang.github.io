const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const manifest = require("./image-manifest.json");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "images", "generated");
const profiles = {
    avatar: [256, 512],
    card: [480, 800],
    article: [768, 1280],
};
const quality = {
    photo: { webp: 78, avif: 52 },
    illustration: { webp: 80, avif: 54 },
    graphic: { webp: 88, avif: 68 },
};

const slugify = (source) => path.basename(source, path.extname(source))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function buildImage(entry) {
    const sourcePath = path.join(root, entry.source);
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
        throw new Error(`Unable to read dimensions for ${entry.source}`);
    }

    const widths = [...new Set(entry.profiles.flatMap((profile) => profiles[profile]))]
        .filter((width) => width <= metadata.width)
        .sort((a, b) => a - b);
    const imageQuality = quality[entry.kind];
    const slug = slugify(entry.source);

    for (const width of widths) {
        const pipeline = sharp(sourcePath)
            .rotate()
            .resize({ width, withoutEnlargement: true });

        await Promise.all([
            pipeline.clone()
                .webp({ quality: imageQuality.webp, effort: 6 })
                .toFile(path.join(outputDirectory, `${slug}-${width}.webp`)),
            pipeline.clone()
                .avif({ quality: imageQuality.avif, effort: 6 })
                .toFile(path.join(outputDirectory, `${slug}-${width}.avif`)),
        ]);
    }

    return {
        source: entry.source,
        width: metadata.width,
        height: metadata.height,
        generatedWidths: widths,
    };
}

async function main() {
    await fs.rm(outputDirectory, { recursive: true, force: true });
    await fs.mkdir(outputDirectory, { recursive: true });

    const results = [];
    for (const entry of manifest) results.push(await buildImage(entry));

    await fs.writeFile(
        path.join(outputDirectory, "manifest.json"),
        `${JSON.stringify(results, null, 2)}\n`,
    );
    console.log(`Generated responsive images for ${results.length} referenced sources.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
