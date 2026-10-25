document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".nav-toggle");
    const navigation = document.querySelector("#primary-nav");
    const scrollTopButton = document.querySelector(".scroll-top");
    const currentYear = document.querySelector("#current-year");

    // Update the year in the footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Responsive mobile navigation
    if (menuButton && navigation) {
        function isMobileView() {
            return window.matchMedia("(max-width: 980px)").matches;
        }

        function openMenu() {
            navigation.classList.add("is-open");
            menuButton.setAttribute("aria-expanded", "true");
            menuButton.setAttribute("aria-label", "Close menu");
        }

        function closeMenu() {
            navigation.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open menu");
        }

        menuButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (navigation.classList.contains("is-open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close the menu after clicking a navigation link
        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        // Close with the Escape key
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();

                if (isMobileView()) {
                    menuButton.focus();
                }
            }
        });

        // Close when clicking outside the menu
        document.addEventListener("click", function (event) {
            if (
                navigation.classList.contains("is-open") &&
                !navigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close the mobile menu when returning to desktop size
        window.addEventListener("resize", function () {
            if (!isMobileView()) {
                closeMenu();
            }
        });

        closeMenu();
    }

    // Scroll-to-top button (if present in the HTML)
    if (scrollTopButton) {
        function updateScrollButton() {
            if (window.scrollY > 350) {
                scrollTopButton.classList.add("is-visible");
            } else {
                scrollTopButton.classList.remove("is-visible");
            }
        }

        scrollTopButton.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        window.addEventListener("scroll", updateScrollButton, {
            passive: true
        });

        updateScrollButton();
    }

    // Gentle animation for learning cards
    const cards = document.querySelectorAll(
        ".feature-card, .skill-card, .path-card, .learning-point-card"
    );

    cards.forEach(function (card, index) {
        card.classList.add("js-reveal");
        card.style.animationDelay = Math.min(index * 60, 300) + "ms";
        card.classList.add("is-animated");
    });
});
