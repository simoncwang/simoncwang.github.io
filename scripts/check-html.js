const fs = require("node:fs");
const path = require("node:path");
const {
    loadProjectData,
    pageFiles,
    projectPageFiles,
    relativePath,
    stripComments,
} = require("./site-files");

const errors = [];
const { projects } = loadProjectData();

for (const file of pageFiles) {
    const html = stripComments(fs.readFileSync(file, "utf8"));
    const expectedFooter = !file.endsWith(`${path.sep}terminal${path.sep}index.html`);
    const ids = [...html.matchAll(/\bid=["']([^"']+)/g)].map((match) => match[1]);

    if ((html.match(/<main\b/g) || []).length !== 1) errors.push(`${relativePath(file)}: expected one main`);
    if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${relativePath(file)}: expected one h1`);
    if ((html.match(/<title>/g) || []).length !== 1) errors.push(`${relativePath(file)}: expected one title`);
    if (expectedFooter && (html.match(/<site-footer\b/g) || []).length !== 1) {
        errors.push(`${relativePath(file)}: expected one shared footer`);
    }
    if (/<footer class=["']footer/.test(html)) errors.push(`${relativePath(file)}: contains duplicated footer markup`);
    if (/<img\b(?![^>]*\balt=)[^>]*>/s.test(html)) errors.push(`${relativePath(file)}: image without alt`);
    if (/<a\b[^>]*>\s*<button\b|<button\b[^>]*>\s*<a\b/s.test(html)) {
        errors.push(`${relativePath(file)}: invalid interactive nesting`);
    }

    for (const id of new Set(ids)) {
        if (ids.filter((candidate) => candidate === id).length > 1) {
            errors.push(`${relativePath(file)}: duplicate id ${id}`);
        }
    }

    for (const match of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/g)) {
        if (!/rel=["'][^"']*noopener[^"']*noreferrer/.test(match[0])) {
            errors.push(`${relativePath(file)}: unsafe external link`);
        }
    }
}

const manifestPages = projects.map((project) => project.file).sort();
const actualPages = projectPageFiles.map((file) => path.basename(file)).sort();
if (JSON.stringify(manifestPages) !== JSON.stringify(actualPages)) {
    errors.push(`Project manifest mismatch:\nmanifest ${manifestPages}\npages ${actualPages}`);
}

for (const project of projects) {
    if (
        !project.id
        || !project.title
        || !project.navLabel
        || !project.navGroup
        || !project.navOrder
        || !project.category
        || !project.indexOrder
    ) {
        errors.push(`Project ${project.file || "(unknown)"} is missing required metadata`);
    }
}

if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}

console.log(`Validated structure, shared components, and project metadata for ${pageFiles.length} pages.`);
