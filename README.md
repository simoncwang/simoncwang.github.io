# Simon Wang Portfolio

[View the website](https://simoncwang.github.io/)

This repository contains my static HTML, CSS, and JavaScript portfolio hosted
directly through GitHub Pages.

## Development

Install the development-only image tooling:

```sh
npm ci
```

Run all source, link, HTML, project-data, and image checks:

```sh
npm test
```

Rebuild responsive AVIF and WebP assets:

```sh
npm run images:build
```

CSS source is organized under `styles/` and compiled into `style.css`:

```sh
npm run css:build
```

Build all generated site assets:

```sh
npm run build
```

Create the deployable GitHub Pages artifact locally:

```sh
npm run site:build
```

Project metadata lives in `javascript/project_data.js` and drives the homepage,
Projects page, project drawer, and terminal filesystem.

See [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md) for page templates and the
content-authoring workflow.

## Stack

- Static HTML, CSS, and vanilla JavaScript
- Site-owned modular CSS
- Font Awesome via CDN
- Sharp for development-time responsive image generation
- GitHub Pages deployment

## Deployment

Pull requests run validation through GitHub Actions. Pushes to `main` run the
deployment workflow, which installs dependencies, builds CSS and responsive
images, validates the site, packages public files into `_site/`, and deploys
that artifact to GitHub Pages.

In GitHub, the repository Pages source should be set to **GitHub Actions**.
