(() => {
    "use strict";

    const projects = window.PORTFOLIO_PROJECTS || [];
    const featuredEntries = window.PORTFOLIO_FEATURED_ENTRIES || [];

    const externalAttributes = (external) => external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";

    const projectHref = (entry, fromRoot = false) => {
        if (entry.href && /^https?:/.test(entry.href)) return entry.href;
        if (entry.href) return fromRoot ? `./${entry.href}` : `../${entry.href}`;
        return fromRoot ? `./projects/${entry.file}` : `./${entry.file}`;
    };

    class ProjectHighlights extends HTMLElement {
        connectedCallback() {
            const entries = [...projects, ...featuredEntries]
                .filter((entry) => entry.highlight)
                .sort((a, b) => a.highlight.order - b.highlight.order);
            const rows = [];

            for (let index = 0; index < entries.length; index += 2) {
                rows.push(`
                    <div class="project-highlight-row">
                        ${entries.slice(index, index + 2).map((entry) => this.renderCard(entry)).join("")}
                    </div>
                `);
            }

            this.innerHTML = `
                <div id="project-highlights" class="container-fluid">
                    <h2>Project Highlights</h2>
                    <p>
                        Check out some of my project highlights! See my
                        <a href="./projects/projectshome.html">Projects</a> page and my
                        <a href="https://github.com/simoncwang" target="_blank" rel="noopener noreferrer">GitHub</a>
                        for complete details and code.
                    </p>
                    <hr>
                    ${rows.join("<hr>")}
                </div>
            `;
        }

        renderCard(entry) {
            const highlight = entry.highlight;
            const href = projectHref(entry, true);
            const image = highlight.image;
            const sizes = "(max-width: 575px) 60vw, (max-width: 991px) 45vw, 30vw";
            const sourceSet = (extension) => image.widths
                .map((width) => `images/generated/${image.generated}-${width}.${extension} ${width}w`)
                .join(", ");

            return `
                <div class="project-highlight-column">
                    <a class="highlight-link" href="${href}"${externalAttributes(entry.external)}>
                        <h3>${entry.highlightTitle || entry.title}</h3>
                    </a>
                    <div class="tag-group">
                        ${highlight.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                    <p class="date">${highlight.date}</p>
                    <picture>
                        <source type="image/avif" srcset="${sourceSet("avif")}" sizes="${sizes}">
                        <source type="image/webp" srcset="${sourceSet("webp")}" sizes="${sizes}">
                        <img
                            src="${image.source}"
                            class="highlight-image rounded mx-auto d-block"
                            alt="${image.alt}"
                            width="${image.width}"
                            height="${image.height}"
                            decoding="async"
                            loading="lazy"
                        >
                    </picture>
                    <p class="image-caption centered-caption">${highlight.caption}</p>
                    <br>
                    <p>${highlight.description}</p>
                    <a
                        href="${href}"
                        class="button-1"
                        data-theme-target
                        ${externalAttributes(entry.external)}
                    >Read more!</a>
                </div>
            `;
        }
    }

    class ProjectIndex extends HTMLElement {
        connectedCallback() {
            const entries = [...projects, ...featuredEntries];
            const categories = ["AI/ML", "Computer Graphics", "HCI"];

            this.innerHTML = `
                <div class="project-index-row">
                    ${categories.map((category) => `
                        <div class="project-index-column project-group">
                            <h3>${category}</h3>
                            <hr>
                            <ul class="project-list">
                                ${entries
                                    .filter((entry) => entry.category === category)
                                    .sort((a, b) => a.indexOrder - b.indexOrder)
                                    .map((entry) => `
                                        <li>
                                            <a href="${projectHref(entry)}"${externalAttributes(entry.external)}>
                                                ${entry.title}
                                            </a>
                                        </li>
                                    `)
                                    .join("")}
                            </ul>
                        </div>
                    `).join("")}
                </div>
            `;
        }
    }

    customElements.define("project-highlights", ProjectHighlights);
    customElements.define("project-index", ProjectIndex);
})();
