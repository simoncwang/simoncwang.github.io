class ProjectNavigation extends HTMLElement {
    connectedCallback() {
        const projects = {
            school: [
                ["mmo.html", "MMO - MLLM Benchmarking"],
                ["disneybrdf.html", "Disney BRDF & Monte Carlo Rendering in PyTorch"],
                ["magicalpet.html", "MagicalPet - A Desktop AI Assistant"],
                ["videogen.html", "Consistent Video Generation"],
                ["vrclass.html", "XR Education"],
                ["emd.html", "Accessibility of Touch Screens for Elderly"],
            ],
            personal: [
                ["huggingfaceagents.html", "Multi-Agent Systems w/ SmolAgents"],
                ["wildlifeanalyzer.html", "Wildlife Analyzer"],
                ["personalrag.html", "RAG Quiz"],
                ["artadvisor.html", "AI Art Advisor"],
            ],
        };
        const currentPage = window.location.pathname.split("/").pop();

        this.innerHTML = `
            <button
                id="project-navigation-open"
                class="project-navigation-open"
                type="button"
                aria-label="Open project navigation"
                aria-controls="project-navigation"
                aria-expanded="false"
            >
                <i class="fa-solid fa-bars" aria-hidden="true"></i>
            </button>

            <button
                id="project-navigation-backdrop"
                class="project-navigation-backdrop"
                type="button"
                aria-label="Close project navigation"
                hidden
            ></button>

            <aside
                id="project-navigation"
                class="sidenav"
                aria-label="Project navigation"
            >
                <div class="project-navigation-header">
                    <h2>Projects</h2>
                    <button
                        id="project-navigation-close"
                        class="project-navigation-close"
                        type="button"
                        aria-label="Close project navigation"
                    >
                        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                </div>

                <nav class="project-navigation-content" aria-label="Portfolio projects">
                    ${this.renderSection("school-projects", "School Projects", projects.school, currentPage)}
                    ${this.renderSection("personal-projects", "Personal Projects", projects.personal, currentPage)}
                </nav>
            </aside>
        `;

        this.initializeDrawer();
    }

    renderSection(id, label, items, currentPage) {
        const isActiveSection = items.some(([href]) => href === currentPage);
        return `
            <section class="project-navigation-section">
                <button
                    class="section-button"
                    type="button"
                    data-project-section-toggle
                    aria-controls="${id}"
                    aria-expanded="${isActiveSection}"
                >
                    <span>${label}</span>
                    <i
                        class="fa-solid ${isActiveSection ? "fa-angle-up" : "fa-angle-down"}"
                        aria-hidden="true"
                    ></i>
                </button>
                <div id="${id}" class="section-content" ${isActiveSection ? "" : "hidden"}>
                    ${items.map(([href, itemLabel]) => {
                        const active = href === currentPage;
                        return `
                            <a
                                class="nav-item nav-link${active ? " active" : ""}"
                                href="./${href}"
                                ${active ? 'aria-current="page"' : ""}
                            >${itemLabel}</a>
                        `;
                    }).join("")}
                </div>
            </section>
        `;
    }

    initializeDrawer() {
        const drawer = this.querySelector("#project-navigation");
        const openButton = this.querySelector("#project-navigation-open");
        const closeButton = this.querySelector("#project-navigation-close");
        const backdrop = this.querySelector("#project-navigation-backdrop");
        const sectionButtons = this.querySelectorAll("[data-project-section-toggle]");
        const focusableSelector = "a[href], button:not([disabled])";

        const openDrawer = () => {
            drawer.classList.add("is-open");
            backdrop.hidden = false;
            document.body.classList.add("project-drawer-open");
            openButton.setAttribute("aria-expanded", "true");
            closeButton.focus();
        };

        const closeDrawer = () => {
            drawer.classList.remove("is-open");
            backdrop.hidden = true;
            document.body.classList.remove("project-drawer-open");
            openButton.setAttribute("aria-expanded", "false");
            openButton.focus();
        };

        openButton.addEventListener("click", openDrawer);
        closeButton.addEventListener("click", closeDrawer);
        backdrop.addEventListener("click", closeDrawer);

        sectionButtons.forEach((button) => {
            const section = this.querySelector(`#${button.getAttribute("aria-controls")}`);
            const icon = button.querySelector("i");
            button.addEventListener("click", () => {
                const expanded = button.getAttribute("aria-expanded") === "true";
                button.setAttribute("aria-expanded", String(!expanded));
                section.hidden = expanded;
                icon.classList.toggle("fa-angle-up", !expanded);
                icon.classList.toggle("fa-angle-down", expanded);
            });
        });

        drawer.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeDrawer();
                return;
            }
            if (event.key !== "Tab") return;

            const focusable = Array.from(drawer.querySelectorAll(focusableSelector))
                .filter((element) => !element.closest("[hidden]"));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer();
        });
    }
}

customElements.define("project-navigation", ProjectNavigation);
