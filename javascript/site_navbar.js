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
            <nav id="topnav" class="site-navigation" aria-label="Primary navigation">
                <div class="container site-navigation-container">
                    <a class="site-navigation-brand" href="${basePath}index.html" aria-label="Simon Wang home">
                        <span class="nav-logo"></span>
                        Simon Wang
                    </a>

                    <div class="site-navigation-actions">
                        <button
                            id="theme-toggle"
                            class="navigation-icon-button"
                            type="button"
                            aria-label="Switch to dark theme"
                        >
                            <i id="theme-icon" class="fa-regular fa-lightbulb" aria-hidden="true"></i>
                        </button>
                        <button
                            class="navigation-icon-button navigation-menu-toggle"
                            type="button"
                            aria-label="Open navigation menu"
                            aria-controls="primary-navigation-links"
                            aria-expanded="false"
                        >
                            <i class="fa-solid fa-bars" aria-hidden="true"></i>
                        </button>
                    </div>

                    <div class="site-navigation-links" id="primary-navigation-links">
                        ${navItems.map((item) => this.renderNavItem(item, activePage)).join('')}
                    </div>
                </div>
            </nav>
        `;

        const menuButton = this.querySelector('.navigation-menu-toggle');
        const menu = this.querySelector('#primary-navigation-links');
        if (!menuButton || !menu) return;

        const setMenuOpen = (open) => {
            menu.classList.toggle('is-open', open);
            menuButton.setAttribute('aria-expanded', String(open));
            menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
            const icon = menuButton.querySelector('i');
            icon?.classList.toggle('fa-bars', !open);
            icon?.classList.toggle('fa-xmark', open);
        };

        menuButton.addEventListener('click', () => {
            setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
        });

        menu.addEventListener('click', (event) => {
            if (event.target.closest('a')) setMenuOpen(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
                setMenuOpen(false);
                menuButton.focus();
            }
        });

        window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
            if (event.matches) setMenuOpen(false);
        });
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
        const ariaCurrent = item.key === activePage ? ' aria-current="page"' : '';
        const target = item.external ? ' target="_blank"' : '';
        const rel = item.external ? ' rel="noopener noreferrer"' : '';
        return `<a class="site-navigation-item site-navigation-link${activeClass}" href="${item.href}"${ariaCurrent}${target}${rel}>${item.label}</a>`;
    }
}

customElements.define('site-navbar', SiteNavbar);
