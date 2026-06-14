document.addEventListener("DOMContentLoaded", () => {
    const index = document.getElementById("blog-index");
    const posts = Array.from(document.querySelectorAll("[data-blog-post]"));
    const openButtons = document.querySelectorAll("[data-blog-open]");
    const closeButtons = document.querySelectorAll("[data-blog-close]");

    if (!index || !posts.length) return;

    let activeTrigger = null;

    const renderIndex = ({ restoreFocus = false } = {}) => {
        posts.forEach((post) => {
            post.hidden = true;
        });
        index.hidden = false;
        activeTrigger?.setAttribute("aria-expanded", "false");
        if (restoreFocus) activeTrigger?.focus();
        activeTrigger = null;
    };

    const renderPost = (postId, trigger = null, { focusHeading = true } = {}) => {
        const post = document.getElementById(postId);
        if (!post) return;

        activeTrigger?.setAttribute("aria-expanded", "false");
        activeTrigger = trigger;
        activeTrigger?.setAttribute("aria-expanded", "true");
        index.hidden = true;
        posts.forEach((candidate) => {
            candidate.hidden = candidate !== post;
        });
        if (focusHeading) post.querySelector("h2")?.focus();
    };

    openButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const postId = button.dataset.blogOpen;
            renderPost(postId, button);
            window.history.pushState({ postId }, "", `#${postId}`);
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            renderIndex({ restoreFocus: true });
            window.history.pushState({}, "", window.location.pathname);
        });
    });

    const renderLocation = ({ focusHeading = false } = {}) => {
        const postId = window.location.hash.slice(1);
        if (postId && document.getElementById(postId)?.matches("[data-blog-post]")) {
            const trigger = document.querySelector(`[data-blog-open="${postId}"]`);
            renderPost(postId, trigger, { focusHeading });
        } else {
            renderIndex();
        }
    };

    window.addEventListener("popstate", () => renderLocation({ focusHeading: true }));
    renderLocation();
});
