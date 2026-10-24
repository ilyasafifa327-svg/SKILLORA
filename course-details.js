"use strict";

document.addEventListener("DOMContentLoaded", function () {
const courses = {
"web-development": {
title: "Web Development",
category: "Development",
description:
"Discover how websites are structured, styled, and made interactive using HTML, CSS, and JavaScript.",
overview:
"Explore the building blocks of websites and practise creating responsive, interactive web pages.",
basics:
"Understand HTML structure, CSS styling, responsive layouts, and JavaScript fundamentals.",
practice:
"Practise with page layouts, navigation menus, forms, and simple interactive features.",
project:
"Create a responsive website that combines structure, styling, and useful interactions.",
topics: [
{
title: "HTML Fundamentals",
description: "Explore headings, paragraphs, links, images, and semantic page structure."
},
{
title: "CSS and Responsive Design",
description: "Learn styling, layouts, spacing, colours, and mobile-friendly design."
},
{
title: "JavaScript Basics",
description: "Discover variables, functions, events, and DOM manipulation."
},
{
title: "Build a Website",
description: "Combine your skills to create a small, interactive website."
}
]
},

"ui-ux-design": {
  title: "UI/UX Design",
  category: "Design",
  description:
    "Explore how to design clear, attractive, and user-friendly digital experiences.",
  overview:
    "Learn how layout, typography, colour, and user needs influence digital product design.",
  basics:
    "Understand visual hierarchy, spacing, colour choices, and basic user-centred design.",
  practice:
    "Explore sample screens, navigation patterns, and simple wireframe exercises.",
  project:
    "Plan a sample interface for a website or mobile application.",
  topics: [
    {
      title: "Design Fundamentals",
      description: "Explore colour, typography, spacing, and visual hierarchy."
    },
    {
      title: "Understanding Users",
      description: "Consider user needs and the problems a design should solve."
    },
    {
      title: "Wireframes and Layouts",
      description: "Organise content into clear, easy-to-follow screen layouts."
    },
    {
      title: "Interface Mini Project",
      description: "Develop a sample interface concept for a digital product."
    }
  ]
},

"data-analytics": {
  title: "Data Analytics",
  category: "Data",
  description:
    "Discover how information can be organised, explored, and turned into useful insights.",
  overview:
    "Learn the foundations of working with data and communicating simple findings clearly.",
  basics:
    "Understand datasets, rows, columns, data types, and basic data organisation.",
  practice:
    "Explore sample tables, compare values, and identify simple patterns.",
  project:
    "Prepare a small sample report using an example dataset.",
  topics: [
    {
      title: "Introduction to Data",
      description: "Understand what data is and how it can answer questions."
    },
    {
      title: "Organising Information",
      description: "Explore tables, categories, and structured datasets."
    },
    {
      title: "Finding Patterns",
      description: "Practise comparing values and identifying simple trends."
    },
    {
      title: "Sample Data Report",
      description: "Present example findings in a clear and organised format."
    }
  ]
},

"digital-marketing": {
  title: "Digital Marketing",
  category: "Business",
  description:
    "Explore how digital channels help organisations share information and reach audiences.",
  overview:
    "Discover the foundations of online communication, content planning, and audience awareness.",
  basics:
    "Understand digital channels, audiences, content, and basic marketing goals.",
  practice:
    "Plan sample posts, organise content ideas, and explore simple campaign concepts.",
  project:
    "Create a sample digital content plan for a fictional business.",
  topics: [
    {
      title: "Digital Marketing Basics",
      description: "Explore digital channels and the purpose of online marketing."
    },
    {
      title: "Audience and Content",
      description: "Consider who content is for and what information they need."
    },
    {
      title: "Content Planning",
      description: "Organise sample content ideas into a simple schedule."
    },
    {
      title: "Mini Campaign Plan",
      description: "Prepare a sample digital campaign for a fictional organisation."
    }
  ]
},

"graphic-design": {
  title: "Graphic Design",
  category: "Design",
  description:
    "Discover how typography, colour, imagery, and composition communicate ideas visually.",
  overview:
    "Explore the basic principles behind clear and engaging visual communication.",
  basics:
    "Understand contrast, alignment, spacing, typography, and colour combinations.",
  practice:
    "Experiment with simple layouts, posters, and visual content concepts.",
  project:
    "Create a sample poster or social media design for a fictional event.",
  topics: [
    {
      title: "Visual Design Principles",
      description: "Explore contrast, alignment, repetition, and visual balance."
    },
    {
      title: "Colour and Typography",
      description: "Learn how colour and text choices influence readability."
    },
    {
      title: "Layout and Composition",
      description: "Arrange visual elements to communicate a clear message."
    },
    {
      title: "Design Mini Project",
      description: "Plan a sample poster or digital graphic."
    }
  ]
},

"python-programming": {
  title: "Python Programming",
  category: "Development",
  description:
    "Explore programming fundamentals through readable syntax and beginner-friendly examples.",
  overview:
    "Discover how instructions, variables, conditions, and loops are used in programming.",
  basics:
    "Understand values, variables, data types, and simple program structure.",
  practice:
    "Try examples involving conditions, loops, functions, and basic calculations.",
  project:
    "Plan a small program that solves a simple everyday problem.",
  topics: [
    {
      title: "Programming Fundamentals",
      description: "Understand instructions, variables, and basic data types."
    },
    {
      title: "Conditions and Loops",
      description: "Explore how programs make decisions and repeat instructions."
    },
    {
      title: "Functions",
      description: "Learn how reusable blocks of code organise a program."
    },
    {
      title: "Mini Programming Project",
      description: "Create a small sample program using the concepts you explored."
    }
  ]
}

};

const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id") || "web-development";

const course = courses[requestedId];

const titleElement = document.getElementById("course-title");
const categoryElement = document.getElementById("course-category");
const descriptionElement = document.getElementById("course-description");
const overviewElement = document.getElementById("overview-description");
const basicsElement = document.getElementById("overview-basics");
const practiceElement = document.getElementById("overview-practice");
const projectElement = document.getElementById("overview-project");
const topicsContainer = document.getElementById("course-topics");

// Display a friendly message if the course ID is unknown.
if (!course) {
document.title = "Course Not Found | SKILLORA";

categoryElement.textContent = "Explore SKILLORA";

titleElement.textContent = "Course Not Found";

descriptionElement.textContent =
  "We couldn't find that sample course. Explore the available courses to discover another learning journey.";

overviewElement.textContent =
  "Browse the available sample courses and choose a topic that interests you.";

basicsElement.textContent =
  "Explore the available digital skill categories.";

practiceElement.textContent =
  "Open a course to view its sample topics and project ideas.";

projectElement.textContent =
  "Choose a learning topic and discover a possible mini project.";

topicsContainer.replaceChildren();

const message = document.createElement("article");
message.className = "card feature reveal";

const heading = document.createElement("h3");
heading.textContent = "Find Your Next Course";

const paragraph = document.createElement("p");
paragraph.textContent =
  "Visit Explore to browse the sample learning categories.";

const link = document.createElement("a");
link.className = "btn btn-primary";
link.href = "explore.html";
link.textContent = "Explore Courses";

message.append(heading, paragraph, link);
topicsContainer.appendChild(message);

return;

}

// Update the page with the selected course.
document.title = course.title + " | SKILLORA";

titleElement.textContent = course.title;
categoryElement.textContent = course.category;
descriptionElement.textContent = course.description;
overviewElement.textContent = course.overview;
basicsElement.textContent = course.basics;
practiceElement.textContent = course.practice;
projectElement.textContent = course.project;

// Create the topic cards safely using DOM elements.
topicsContainer.replaceChildren();

course.topics.forEach(function (topic, index) {
const article = document.createElement("article");
article.className = "card feature reveal";

const number = document.createElement("span");
number.className = "journey-num";
number.textContent = String(index + 1).padStart(2, "0");

const heading = document.createElement("h3");
heading.textContent = topic.title;

const paragraph = document.createElement("p");
paragraph.textContent = topic.description;

article.append(number, heading, paragraph);
topicsContainer.appendChild(article);

});
});