document.addEventListener("DOMContentLoaded", () => {
    const infoButton = document.getElementById("info-button");
    const infoPopup = document.getElementById("info-popup");
    const closeButton = document.getElementById("close-popup");
    const interest = document.getElementById("interest");

    if (infoButton && infoPopup && closeButton) {
        const openPopup = () => {
            infoPopup.hidden = false;
            infoButton.setAttribute("aria-expanded", "true");
            closeButton.focus();
        };

        const closePopup = ({ restoreFocus = true } = {}) => {
            infoPopup.hidden = true;
            infoButton.setAttribute("aria-expanded", "false");
            if (restoreFocus) infoButton.focus();
        };

        infoButton.addEventListener("click", () => {
            if (infoPopup.hidden) {
                openPopup();
            } else {
                closePopup();
            }
        });

        closeButton.addEventListener("click", () => closePopup());

        document.addEventListener("click", (event) => {
            if (
                !infoPopup.hidden
                && !infoPopup.contains(event.target)
                && !infoButton.contains(event.target)
            ) {
                closePopup({ restoreFocus: false });
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !infoPopup.hidden) closePopup();
        });
    }

    if (!interest) return;

    const interests = [
        "Machine Learning",
        "MLOps",
        "HCI",
        "Data Interaction",
        "Generative AI",
    ];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let currentIndex = interests.indexOf(interest.textContent.trim());
    window.setInterval(() => {
        interest.classList.add("fade-out");
        window.setTimeout(() => {
            currentIndex = (currentIndex + 1) % interests.length;
            interest.textContent = interests[currentIndex];
            interest.classList.remove("fade-out");
        }, 500);
    }, 3000);
});
