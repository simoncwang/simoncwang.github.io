class SiteFooter extends HTMLElement {
    connectedCallback() {
        const basePath = window.location.pathname.includes("/projects/") ? "../" : "./";
        const terminalHint = this.hasAttribute("terminal-hint")
            ? `
                <p class="footer-hint">
                    psst: try typing
                    <a href="${basePath}terminal/" aria-label="Open hidden terminal">simon</a>
                </p>
            `
            : "";

        this.innerHTML = `
            <footer class="footer">
                <p>&copy; Simon Wang, 2024&ndash;2026.</p>
                <p>
                    <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer">
                        <img
                            src="${basePath}images/bootstrap-logo-black.svg"
                            width="35"
                            height="30"
                            alt=""
                            decoding="async"
                            loading="lazy"
                        >
                    </a>
                    &nbsp;
                    Created with Bootstrap. &nbsp;
                    P.s. thanks to the amazing
                    <a href="https://emilywudesigns.myportfolio.com/" target="_blank" rel="noopener noreferrer">Emily Wu</a>
                    for helping with the graphic design!
                </p>
                ${terminalHint}
            </footer>
        `;
    }
}

customElements.define("site-footer", SiteFooter);
