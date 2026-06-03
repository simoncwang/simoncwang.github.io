class SiteNavbar extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || this.getBasePath();
        const activePage = this.getActivePage();
        const navItems = [
            { key: 'home', label: 'Home', href: `${basePath}index.html` },
            { key: 'projects', label: 'Projects', href: `${basePath}projects/projectshome.html` },
            { key: 'courses', label: 'Coursework', href: `${basePath}courses.html` },
            { key: 'playground', label: 'Playground', href: `${basePath}playground.html` },
        ];

        this.innerHTML = `
            <!-- navbar section -->
            <nav id="topnav" class="navbar navbar-expand-lg navbar-light fixed-top">
                <button id="theme-toggle">
                    <i id="theme-icon" class="fa-regular fa-lightbulb"></i>
                </button>

                <div class="container">
                    <a class="navbar-brand" href="${basePath}index.html">
                        <span class="nav-logo"></span>
                        Simon Wang
                    </a>

                    <div class="navbar-nav">
                        ${navItems.map((item) => this.renderNavItem(item, activePage)).join('')}
                    </div>
                </div>
            </nav>
        `;
    }

    getBasePath() {
        return window.location.pathname.includes('/projects/') ? '../' : './';
    }

    getActivePage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';

        if (path.includes('/projects/')) return 'projects';
        if (fileName === 'courses.html') return 'courses';
        if (fileName === 'playground.html') return 'playground';
        if (fileName === 'blog.html') return 'blog';
        return 'home';
    }

    renderNavItem(item, activePage) {
        const activeClass = item.key === activePage ? ' active' : '';
        const target = item.external ? ' target="_blank"' : '';
        const rel = item.external ? ' rel="noopener noreferrer"' : '';
        return `<a class="nav-item nav-link${activeClass}" href="${item.href}"${target}${rel}>${item.label}</a>`;
    }
}

customElements.define('site-navbar', SiteNavbar);
