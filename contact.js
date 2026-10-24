"use strict";

document.addEventListener("DOMContentLoaded", function () {
const contactForm = document.getElementById("contact-form");

// Stop if this page does not contain the contact form.
if (!contactForm) {
return;
}

const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const subjectInput = document.getElementById("contact-subject");
const messageInput = document.getElementById("contact-message");
const statusBox = document.getElementById("contact-status");

const fields = [
{
input: nameInput,
error: document.getElementById("name-error")
},
{
input: emailInput,
error: document.getElementById("email-error")
},
{
input: subjectInput,
error: document.getElementById("subject-error")
},
{
input: messageInput,
error: document.getElementById("message-error")
}
];

// Display a field error and apply the error styling.
function showFieldError(input, errorElement, message) {
const field = input.closest(".field");

errorElement.textContent = message;
input.setAttribute("aria-invalid", "true");

if (field) {
  field.classList.add("has-error");
}

}

// Remove a field's error styling.
function clearFieldError(input, errorElement) {
const field = input.closest(".field");

errorElement.textContent = "";
input.removeAttribute("aria-invalid");

if (field) {
  field.classList.remove("has-error");
}

}

// Validate the name.
function validateName() {
const name = nameInput.value.trim();
const error = document.getElementById("name-error");

clearFieldError(nameInput, error);

if (!name) {
  showFieldError(nameInput, error, "Please enter your name.");
  return false;
}

if (name.length < 2) {
  showFieldError(
    nameInput,
    error,
    "Your name must contain at least 2 characters."
  );
  return false;
}

if (name.length > 80) {
  showFieldError(
    nameInput,
    error,
    "Your name must be 80 characters or fewer."
  );
  return false;
}

return true;

}

// Validate the email address.
function validateEmail() {
const email = emailInput.value.trim();
const error = document.getElementById("email-error");

clearFieldError(emailInput, error);

if (!email) {
  showFieldError(
    emailInput,
    error,
    "Please enter your email address."
  );
  return false;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
  showFieldError(
    emailInput,
    error,
    "Please enter a valid email address."
  );
  return false;
}

if (email.length > 120) {
  showFieldError(
    emailInput,
    error,
    "Your email address is too long."
  );
  return false;
}

return true;

}

// Validate the selected subject.
function validateSubject() {
const error = document.getElementById("subject-error");

clearFieldError(subjectInput, error);

if (!subjectInput.value) {
  showFieldError(
    subjectInput,
    error,
    "Please choose a message topic."
  );
  return false;
}

return true;

}

// Validate the message.
function validateMessage() {
const message = messageInput.value.trim();
const error = document.getElementById("message-error");

clearFieldError(messageInput, error);

if (!message) {
  showFieldError(
    messageInput,
    error,
    "Please write your message."
  );
  return false;
}

if (message.length < 10) {
  showFieldError(
    messageInput,
    error,
    "Please write at least 10 characters."
  );
  return false;
}

if (message.length > 1500) {
  showFieldError(
    messageInput,
    error,
    "Your message must be 1500 characters or fewer."
  );
  return false;
}

return true;

}

// Remove old status messages.
function clearStatus() {
statusBox.textContent = "";
statusBox.classList.remove("is-success", "is-error");
}

// Show a status message.
function showStatus(message, type) {
statusBox.textContent = message;
statusBox.classList.remove("is-success", "is-error");
statusBox.classList.add(type);
}

// Validate fields as the user types.
nameInput.addEventListener("input", function () {
validateName();
clearStatus();
});

emailInput.addEventListener("input", function () {
validateEmail();
clearStatus();
});

subjectInput.addEventListener("change", function () {
validateSubject();
clearStatus();
});

messageInput.addEventListener("input", function () {
validateMessage();
clearStatus();
});

// Handle form submission.
contactForm.addEventListener("submit", function (event) {
event.preventDefault();

clearStatus();

const isNameValid = validateName();
const isEmailValid = validateEmail();
const isSubjectValid = validateSubject();
const isMessageValid = validateMessage();

const isFormValid =
  isNameValid &&
  isEmailValid &&
  isSubjectValid &&
  isMessageValid;

if (!isFormValid) {
  showStatus(
    "Please correct the highlighted fields and try again.",
    "is-error"
  );

  const firstInvalidField = fields.find(function (field) {
    return field.input.getAttribute("aria-invalid") === "true";
  });

  if (firstInvalidField) {
    firstInvalidField.input.focus();
  }

  return;
}

// This is a front-end demo. No email or server request is made.
showStatus(
  "Your form has been validated successfully! This is a demo, so your message has not been sent to a server.",
  "is-success"
);

});

// Reset all validation messages when the form is cleared.
contactForm.addEventListener("reset", function () {
window.setTimeout(function () {
fields.forEach(function (field) {
clearFieldError(field.input, field.error);
});

  clearStatus();
}, 0);

});
});