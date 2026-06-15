# Adding Content

## Add a Project

1. Copy `templates/project-page.html` into `projects/`.
2. Replace the placeholder title, heading, subtitle, links, and article content.
3. Add one entry to `javascript/project_data.js`.
4. Add any live raster sources to `scripts/image-manifest.json`.
5. Run `npm run images:build`.
6. Run `npm test`.

The project manifest automatically updates:

- the Projects page;
- project-page navigation;
- the terminal project filesystem;
- homepage highlights when the entry has a `highlight` object.

Every project entry requires:

- `id`: stable terminal and code identifier;
- `file`: HTML filename inside `projects/`;
- `title`: Projects-page label;
- `navLabel`: shorter drawer label;
- `navGroup`: `school` or `personal`;
- `category`: `AI/ML`, `Computer Graphics`, or `HCI`;
- `terminalDescription`: short terminal listing description.

## Add a Regular Page

Copy `templates/content-page.html` to the repository root. Keep the shared
navbar, footer, theme initialization, and script paths intact.

## Add a Blog Entry

For the current single-page blog, copy the index button and article patterns
from `templates/blog-post.html` into `blog.html`. The button's
`data-blog-open` value must match the article `id`.

Distinct blog URLs are intentionally deferred to Phase 2.5.

## Images

Original images remain in `images/`. Generated AVIF and WebP files are written
to `images/generated/` and committed for GitHub Pages.

```sh
npm run images:build
```

Only add images that are referenced by live markup or project highlight data.
The image check rejects stale manifest entries and derivatives larger than
their source.

## Validation

```sh
npm test
```

Individual checks are also available:

```sh
npm run check:js
npm run check:links
npm run check:html
npm run check:images
```

Pull requests run the same checks and verify that generated images are current.

CSS is edited in `styles/` and compiled into the single deployed stylesheet:

```sh
npm run css:build
```
