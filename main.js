
/* ==========================================
   SKILLORA — MOBILE HAMBURGER NAVIGATION
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".nav-toggle");
    const navigation = document.querySelector("#primary-nav");

    if (!menuButton || !navigation) {
        console.warn("SKILLORA navigation button or menu was not found.");
        return;
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

    function toggleMenu() {
        const isOpen = navigation.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Open or close the menu when the three lines are pressed.
    menuButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
    });

    // Close the menu after a navigation link is selected.
    navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeMenu();
        });
    });

    // Close the menu when the user presses Escape.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
            menuButton.focus();
        }
    });

    // Close the menu when the user taps outside it.
    document.addEventListener("click", function (event) {
        if (
            !navigation.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Reset the mobile menu when returning to desktop width.
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Start with the menu closed.
    closeMenu();
});
