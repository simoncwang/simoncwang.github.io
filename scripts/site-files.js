const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const pageFiles = [
    ...fs.readdirSync(root)
        .filter((file) => file.endsWith(".html"))
        .map((file) => path.join(root, file)),
    ...fs.readdirSync(path.join(root, "projects"))
        .filter((file) => file.endsWith(".html"))
        .map((file) => path.join(root, "projects", file)),
    path.join(root, "terminal", "index.html"),
];

const projectPageFiles = pageFiles.filter((file) => (
    file.includes(`${path.sep}projects${path.sep}`)
    && path.basename(file) !== "projectshome.html"
));

const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, "");
const relativePath = (file) => path.relative(root, file);

function loadProjectData() {
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(
        fs.readFileSync(path.join(root, "javascript", "project_data.js"), "utf8"),
        context,
    );
    return {
        projects: JSON.parse(JSON.stringify(context.window.PORTFOLIO_PROJECTS)),
        featured: JSON.parse(JSON.stringify(context.window.PORTFOLIO_FEATURED_ENTRIES)),
    };
}

module.exports = {
    loadProjectData,
    pageFiles,
    projectPageFiles,
    relativePath,
    root,
    stripComments,
};
