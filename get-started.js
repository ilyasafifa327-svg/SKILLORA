/* ==========================================
   SKILLORA - GET STARTED FORM
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("get-started-form");
    const statusBox = document.getElementById("get-started-status");

    const submitButton = form
        ? form.querySelector('button[type="submit"]')
        : null;

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // This script is safe to load on pages without this form.
    if (!form || !statusBox || !submitButton) return;

    const learningSuggestions = {
        "web-development": {
            title: "Web Development",
            steps: [
                "Learn HTML to structure web pages.",
                "Practise CSS to style your website.",
                "Use JavaScript to add interactivity.",
                "Build a small personal website."
            ]
        },

        "ui-ux-design": {
            title: "UI/UX Design",
            steps: [
                "Learn the basics of user interface design.",
                "Explore layouts, colours, and typography.",
                "Practise creating simple wireframes.",
                "Design a sample app or website screen."
            ]
        },

        "graphic-design": {
            title: "Graphic Design",
            steps: [
                "Learn basic design principles.",
                "Explore colour combinations and typography.",
                "Practise creating posters and social media designs.",
                "Build a small design portfolio."
            ]
        },

        "python-programming": {
            title: "Python Programming",
            steps: [
                "Understand variables and data types.",
                "Practise conditions and loops.",
                "Learn functions and basic problem-solving.",
                "Create a small Python project."
            ]
        },

        "data-analytics": {
            title: "Data Analytics",
            steps: [
                "Understand what data analytics means.",
                "Practise organising information in spreadsheets.",
                "Learn basic charts and data interpretation.",
                "Create a simple data report."
            ]
        },

        "digital-marketing": {
            title: "Digital Marketing",
            steps: [
                "Understand digital marketing basics.",
                "Explore social media content planning.",
                "Learn about audiences and engagement.",
                "Create a sample marketing campaign."
            ]
        },

        "other": {
            title: "Exploring New Skills",
            steps: [
                "Choose one skill that interests you.",
                "Learn the basic concepts.",
                "Practise with a small activity.",
                "Review your progress and choose your next step."
            ]
        }
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);

        const fullName = String(
            formData.get("fullName") || ""
        ).trim();

        const email = String(
            formData.get("email") || ""
        ).trim();

        const experience = String(
            formData.get("experience") || ""
        );

        const interest = String(
            formData.get("interest") || ""
        );

        const goal = String(
            formData.get("goal") || ""
        );

        if (fullName.length < 2) {
            showError("Please enter your full name.");

            const nameInput = document.getElementById("full-name");

            if (nameInput) nameInput.focus();

            return;
        }

        if (!email || !email.includes("@")) {
            showError("Please enter a valid email address.");

            const emailInput = document.getElementById("email");

            if (emailInput) emailInput.focus();

            return;
        }

        if (!experience || !interest || !goal) {
            showError("Please complete all required fields.");
            return;
        }

        const selectedLearning =
            learningSuggestions[interest] ||
            learningSuggestions.other;

        showSuccess(fullName, selectedLearning);

        submitButton.textContent = "Form Submitted ✓";
        submitButton.disabled = true;

        statusBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // Demonstration only: no information is sent to a server.
        window.setTimeout(function () {
            form.reset();

            submitButton.textContent = "Submit Get Started Form";
            submitButton.disabled = false;

            statusBox.className = "get-started-status";
            statusBox.replaceChildren();
        }, 8000);
    });

    function showError(message) {
        statusBox.className = "get-started-status is-error";
        statusBox.textContent = message;
    }

    function showSuccess(fullName, learning) {
        statusBox.className = "get-started-status is-success";
        statusBox.replaceChildren();

        const heading = document.createElement("h3");

        heading.textContent =
            "You're ready to get started, " + fullName + "!";

        const intro = document.createElement("p");

        intro.textContent =
            "Your selected learning area is " +
            learning.title +
            ". Here is a simple starting plan:";

        const list = document.createElement("ol");

        learning.steps.forEach(function (step) {
            const item = document.createElement("li");

            item.textContent = step;
            list.appendChild(item);
        });

        const note = document.createElement("p");

        note.textContent =
            "This is a local demonstration. Your form details " +
            "have not been sent or saved to an online server.";

        statusBox.append(heading, intro, list, note);
    }
});
