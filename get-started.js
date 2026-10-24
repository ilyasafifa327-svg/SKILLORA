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

    // Stop if the form is not on the current page.
    if (!form || !statusBox || !submitButton) {
        return;
    }

    // Learning suggestions for each selected skill.
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

    // Handle form submission.
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Browser validation runs before this event.
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

        // Basic extra checks.
        if (fullName.length < 2) {
            showError("Please enter your full name.");
            document.getElementById("full-name").focus();
            return;
        }

        if (!email || !email.includes("@")) {
            showError("Please enter a valid email address.");
            document.getElementById("email").focus();
            return;
        }

        if (!experience || !interest || !goal) {
            showError("Please complete all required fields.");
            return;
        }

        const selectedLearning =
            learningSuggestions[interest] ||
            learningSuggestions.other;

        // Show a visible confirmation.
        showSuccess(fullName, selectedLearning);

        // Update button after a successful local submission.
        submitButton.textContent = "Form Submitted ✓";
        submitButton.disabled = true;

        // Scroll to the confirmation.
        statusBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // This demo does not send the data to a server.
        // Reset the form and button after the user has seen the result.
        window.setTimeout(function () {
            form.reset();
            submitButton.textContent = "Submit Get Started Form";
            submitButton.disabled = false;
        }, 8000);

    });

    // Display an error message.
    function showError(message) {

        statusBox.className =
            "get-started-status is-error";

        statusBox.textContent = message;
    }

    // Display the selected learning path.
    function showSuccess(fullName, learning) {

        statusBox.className =
            "get-started-status is-success";

        // Build the content safely without inserting user text as HTML.
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
            "This is a local demonstration. Your form details have not been sent or saved to an online server.";

        statusBox.appendChild(heading);
        statusBox.appendChild(intro);
        statusBox.appendChild(list);
        statusBox.appendChild(note);
    }

});