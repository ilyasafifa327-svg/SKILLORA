/* ==========================================================
   SKILLORA — get-started.js
   Form validation, welcome panel, My Learning summary
   Storage keys (same on every page):
     skillora:profile   -> {name, category, level, goal}
     skillora:path      -> a path id such as "frontend"
     skillora:favorites -> ["course-id", ...]   (read only here)
   ========================================================== */
(function () {
  'use strict';

  const PROFILE_KEY = 'skillora:profile';
  const PATH_KEY = 'skillora:path';
  const FAVORITES_KEY = 'skillora:favorites';

  const CATEGORIES = { development: 'Development', design: 'Design', data: 'Data', business: 'Business' };
  const LEVELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  const PATHS = {
    frontend: 'Front-End Development',
    uiux: 'UI/UX Design',
    data: 'Data Fundamentals',
    business: 'Digital Business'
  };
  const COURSES = {
    'web-development': 'Web Development Foundations',
    'javascript-essentials': 'JavaScript Essentials',
    'frontend-development': 'Front-End Development',
    'uiux-design': 'UI/UX Design Fundamentals',
    'graphic-design': 'Graphic Design Essentials',
    'data-fundamentals': 'Data Fundamentals',
    'digital-marketing': 'Digital Marketing Foundations',
    'digital-business': 'Digital Business Essentials'
  };

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ----- Page elements (stop quietly on the wrong page) -----
  const form = document.getElementById('start-form');
  if (!form) { return; }

  const formCard = document.getElementById('form-card');
  const panel = document.getElementById('welcome-panel');
  const panelTitle = document.getElementById('welcome-title');
  const savedStatus = document.getElementById('saved-status');
  const statusBox = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const editBtn = document.getElementById('edit-btn');
  const pathLink = document.getElementById('path-link');
  const favList = document.getElementById('fav-list');
  const favEmpty = document.getElementById('fav-empty');
  const sum = {
    name: document.getElementById('sum-name'),
    category: document.getElementById('sum-category'),
    level: document.getElementById('sum-level'),
    path: document.getElementById('sum-path'),
    goal: document.getElementById('sum-goal')
  };

  // ----- Safe helpers -----
  function has(map, key) {
    return typeof key === 'string' && Object.prototype.hasOwnProperty.call(map, key);
  }

  function cleanText(value, maxLength) {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, maxLength) : '';
  }

  // ----- localStorage with error handling -----
  function readText(key) {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  }
  function writeText(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (error) { return false; }
  }
  function removeKey(key) {
    try { window.localStorage.removeItem(key); return true; } catch (error) { return false; }
  }

  function readProfile() {
    try {
      const raw = readText(PROFILE_KEY);
      if (!raw) { return null; }
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) { return null; }

      const name = cleanText(data.name, 60);
      const goal = cleanText(data.goal, 300);
      if (!name || !goal || !has(CATEGORIES, data.category) || !has(LEVELS, data.level)) { return null; }
      return { name: name, category: data.category, level: data.level, goal: goal };
    } catch (error) {
      return null; // damaged data is ignored
    }
  }

  function readPath() {
    const raw = readText(PATH_KEY);
    if (!raw) { return ''; }
    const id = raw.replace(/^"+|"+$/g, '').trim();
    return has(PATHS, id) ? id : '';
  }

  function readFavorites() {
    try {
      const raw = readText(FAVORITES_KEY);
      if (!raw) { return []; }
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) { return []; }
      const clean = [];
      list.forEach(function (id) {
        if (has(COURSES, id) && clean.indexOf(id) === -1) { clean.push(id); }
      });
      return clean;
    } catch (error) {
      return [];
    }
  }

  // ----- Toast message -----
  let toastTimer = null;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3000);
  }

  // ----- Form fields and their rules -----
  const fields = [
    {
      key: 'name', id: 'full-name',
      validate: function (value) {
        if (!value) { return 'Please enter your full name.'; }
        if (value.length < 2) { return 'Your name needs at least 2 characters.'; }
        if (value.length > 60) { return 'Please keep your name under 60 characters.'; }
        return '';
      }
    },
    {
      key: 'email', id: 'email',
      validate: function (value) {
        if (!value) { return 'Please enter your email address.'; }
        if (!EMAIL_PATTERN.test(value)) { return 'Please enter a valid email, like name@example.com.'; }
        return '';
      }
    },
    {
      key: 'category', id: 'category',
      validate: function (value) {
        return has(CATEGORIES, value) ? '' : 'Please choose a learning category.';
      }
    },
    {
      key: 'level', id: 'level',
      validate: function (value) {
        return has(LEVELS, value) ? '' : 'Please choose your experience level.';
      }
    },
    {
      key: 'goal', id: 'goal',
      validate: function (value) {
        if (!value) { return 'Please tell us your learning goal.'; }
        if (value.length < 10) { return 'Please describe your goal in at least 10 characters.'; }
        if (value.length > 300) { return 'Please keep your goal under 300 characters.'; }
        return '';
      }
    },
    {
      key: 'path', id: 'path',
      validate: function (value) {
        // Optional: empty is fine, but anything else must be a real path
        return value === '' || has(PATHS, value) ? '' : 'Please choose one of the listed paths.';
      }
    },
    {
      key: 'agree', id: 'agree',
      validate: function (value) {
        return value === true ? '' : 'Please tick this box to continue.';
      }
    }
  ];

  fields.forEach(function (field) {
    field.input = document.getElementById(field.id);
    field.wrapper = field.input ? field.input.closest('.field') : null;
    field.errorEl = document.getElementById(field.id + '-error');
  });

  function getValue(field) {
    if (field.input.type === 'checkbox') { return field.input.checked; }
    if (field.key === 'name' || field.key === 'goal') { return cleanText(field.input.value, 1000); }
    return field.input.value.trim();
  }

  function setError(field, message) {
    if (field.wrapper) { field.wrapper.classList.toggle('has-error', message !== ''); }
    if (field.errorEl) { field.errorEl.textContent = message; }
    field.input.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
  }

  function validateField(field) {
    const message = field.validate(getValue(field));
    setError(field, message);
    return message === '';
  }

  function validateAll() {
    let count = 0;
    let first = null;
    fields.forEach(function (field) {
      if (!validateField(field)) {
        count += 1;
        if (!first) { first = field; }
      }
    });
    return { valid: count === 0, count: count, first: first };
  }

  function setStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = 'form-status' + (type ? ' is-' + type : '');
  }

  // Live feedback while typing, but never before the learner has started
  fields.forEach(function (field) {
    const isChoice = field.input.tagName === 'SELECT' || field.input.type === 'checkbox';

    if (isChoice) {
      field.input.addEventListener('change', function () { validateField(field); });
    } else {
      field.input.addEventListener('blur', function () {
        if (field.input.value.trim() !== '') { validateField(field); }
      });
      field.input.addEventListener('input', function () {
        if (field.wrapper && field.wrapper.classList.contains('has-error')) { validateField(field); }
      });
    }
  });

  // ----- Screens: form <-> welcome panel -----
  let currentProfile = null;
  let currentPathId = '';

  function fillForm(profile, pathId) {
    const byKey = {};
    fields.forEach(function (field) { byKey[field.key] = field; });

    byKey.name.input.value = profile ? profile.name : '';
    byKey.category.input.value = profile ? profile.category : '';
    byKey.level.input.value = profile ? profile.level : '';
    byKey.goal.input.value = profile ? profile.goal : '';
    byKey.path.input.value = has(PATHS, pathId) ? pathId : '';
    byKey.agree.input.checked = Boolean(profile); // already agreed when editing saved details
  }

  function showForm() {
    panel.hidden = true;
    formCard.hidden = false;
  }

  function showPanel(moveFocus) {
    formCard.hidden = true;
    panel.hidden = false;
    if (moveFocus) {
      panelTitle.focus({ preventScroll: true });
      panel.scrollIntoView();
    }
  }

  function renderFavorites() {
    while (favList.firstChild) { favList.removeChild(favList.firstChild); }
    const favorites = readFavorites();

    favEmpty.hidden = favorites.length > 0;
    favorites.forEach(function (id) {
      const link = document.createElement('a');
      link.className = 'btn btn-outline-light btn-sm';
      link.setAttribute('href', 'course-details.html?id=' + id); // id was checked against COURSES
      link.textContent = COURSES[id];
      favList.appendChild(link);
    });
  }

  function renderPanel(profile, pathId, message) {
    currentProfile = profile;
    currentPathId = has(PATHS, pathId) ? pathId : '';

    const firstName = profile.name.split(' ')[0];
    panelTitle.textContent = 'Welcome, ' + firstName + '!';
    savedStatus.textContent = message;

    sum.name.textContent = profile.name;
    sum.category.textContent = CATEGORIES[profile.category];
    sum.level.textContent = LEVELS[profile.level];
    sum.goal.textContent = profile.goal;

    if (currentPathId) {
      sum.path.textContent = PATHS[currentPathId];
      pathLink.textContent = 'View my path';
      pathLink.setAttribute('href', 'learning-paths.html?path=' + currentPathId);
    } else {
      sum.path.textContent = 'None selected yet';
      pathLink.textContent = 'Choose a path';
      pathLink.setAttribute('href', 'learning-paths.html');
    }

    renderFavorites();
  }

  // ----- Submit -----
  let submitting = false;

  function handleSubmit(event) {
    event.preventDefault(); // never let the browser send the form
    if (submitting) { return; }

    const result = validateAll();
    if (!result.valid) {
      setStatus('Please fix ' + result.count + (result.count === 1 ? ' field' : ' fields') + ' below and try again.', 'error');
      result.first.input.focus();
      return;
    }

    submitting = true;
    submitBtn.disabled = true;
    setStatus('', '');

    const values = {};
    fields.forEach(function (field) { values[field.key] = getValue(field); });

    // The email was checked above but is deliberately not stored
    const profile = { name: values.name, category: values.category, level: values.level, goal: values.goal };
    const existing = readProfile();
    const savedPath = readPath();

    const profileChanged = !existing ||
      existing.name !== profile.name ||
      existing.category !== profile.category ||
      existing.level !== profile.level ||
      existing.goal !== profile.goal;
    const pathChanged = values.path !== '' && values.path !== savedPath;

    let message;
    if (!profileChanged && !pathChanged) {
      message = 'Nothing changed. Your details are already saved in this browser.';
    } else {
      let ok = true;
      if (profileChanged) { ok = writeText(PROFILE_KEY, JSON.stringify(profile)) && ok; }
      if (pathChanged) { ok = writeText(PATH_KEY, values.path) && ok; }
      message = ok
        ? 'Your details were saved in this browser only. Nothing was sent to a server.'
        : 'Your browser blocked saving, so these details will be lost when you leave this page.';
    }

    renderPanel(profile, values.path || savedPath, message);
    showPanel(true);

    submitting = false;
    submitBtn.disabled = false;
  }

  form.addEventListener('submit', handleSubmit);

  // ----- Edit and clear -----
  editBtn.addEventListener('click', function () {
    fillForm(currentProfile, currentPathId);
    fields.forEach(function (field) { setError(field, ''); });
    setStatus('', '');
    showForm();
    fields[0].input.focus();
  });

  function clearAll() {
    const sure = window.confirm('Remove your saved details, selected path and favorites from this browser?');
    if (!sure) { return; }

    [PROFILE_KEY, PATH_KEY, FAVORITES_KEY].forEach(removeKey);
    form.reset();
    fields.forEach(function (field) { setError(field, ''); });
    setStatus('', '');
    currentProfile = null;
    currentPathId = '';

    showForm();
    fields[0].input.focus();
    showToast('Saved demo information cleared.');
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('.js-clear')) { clearAll(); }
  });

  // If something changes in another tab, refresh the summary
  window.addEventListener('storage', function (event) {
    const watched = [PROFILE_KEY, PATH_KEY, FAVORITES_KEY];
    if (watched.indexOf(event.key) === -1 || panel.hidden) { return; }
    const profile = readProfile();
    if (profile) {
      renderPanel(profile, readPath(), 'Your summary was updated from another tab.');
    } else {
      showForm();
    }
  });

  // ----- Start-up -----
  const storedProfile = readProfile();
  const storedPath = readPath();

  // Pre-select a path chosen earlier on the Learning Paths page
  const pathField = fields.filter(function (field) { return field.key === 'path'; })[0];
  if (pathField && storedPath) { pathField.input.value = storedPath; }

  if (storedProfile) {
    renderPanel(storedProfile, storedPath, 'Welcome back! Your details were loaded from this browser.');
    showPanel(false);
  } else {
    showForm();
  }
})();
