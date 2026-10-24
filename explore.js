/* ==========================================================
   SKILLORA — js/explore.js
   Search + category filters + favorites for explore.html
   ========================================================== */
(function () {
  'use strict';

  // Same key and format on every page: a JSON array of course ids
  const FAVORITES_KEY = 'skillora:favorites';

  // The only categories we accept (also protects against odd URL values)
  const CATEGORY_LABELS = {
    all: 'All Courses',
    development: 'Development',
    design: 'Design',
    data: 'Data',
    business: 'Business'
  };

  // ----- Find the page elements (stop quietly if this is the wrong page) -----
  const grid = document.getElementById('course-grid');
  if (!grid) { return; }

  const toolbar = document.getElementById('filter-toolbar');
  const resultBar = document.getElementById('result-bar');
  const searchInput = document.getElementById('course-search');
  const chips = Array.from(document.querySelectorAll('.chip[data-category]'));
  const countEl = document.getElementById('result-count');
  const clearBtn = document.getElementById('clear-filters');
  const emptyState = document.getElementById('empty-state');
  const emptyClearBtn = document.getElementById('empty-clear');
  const favButtons = Array.from(grid.querySelectorAll('.btn-favorite'));

  // ----- Read the course cards from the page -----
  function textOf(element) {
    return element ? element.textContent.trim() : '';
  }

  function buildCourse(card) {
    const title = textOf(card.querySelector('.course-title'));
    const description = textOf(card.querySelector('.course-desc'));
    const skills = Array.from(card.querySelectorAll('.tag')).map(textOf).join(' ');
    const category = (card.dataset.category || '').toLowerCase();
    const keywords = card.dataset.keywords || '';

    return {
      el: card,
      id: card.dataset.courseId || '',
      title: title,
      category: category,
      // One lowercase string we search inside
      haystack: [title, category, description, skills, keywords].join(' ').toLowerCase()
    };
  }

  const courses = Array.from(grid.querySelectorAll('.course-card')).map(buildCourse);
  const validIds = courses.map(function (course) { return course.id; });

  // ----- Favorites (localStorage, with safe checks) -----
  function readFavorites() {
    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY);
      if (!raw) { return []; }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) { return []; }

      const clean = [];
      parsed.forEach(function (id) {
        const isKnown = typeof id === 'string' && validIds.indexOf(id) !== -1;
        if (isKnown && clean.indexOf(id) === -1) { clean.push(id); }
      });
      return clean;
    } catch (error) {
      return []; // storage blocked or data damaged
    }
  }

  function writeFavorites(list) {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
      return true;
    } catch (error) {
      return false;
    }
  }

  let favorites = readFavorites();

  function findCourse(id) {
    return courses.find(function (course) { return course.id === id; });
  }

  function renderFavorites() {
    favButtons.forEach(function (button) {
      const course = findCourse(button.dataset.courseId);
      if (!course) { return; }
      const isSaved = favorites.indexOf(course.id) !== -1;
      button.setAttribute('aria-pressed', String(isSaved));
      button.setAttribute(
        'aria-label',
        (isSaved ? 'Remove ' : 'Save ') + course.title + (isSaved ? ' from favorites' : ' to favorites')
      );
    });
  }

  function toggleFavorite(id) {
    const course = findCourse(id);
    if (!course) { return; }

    const adding = favorites.indexOf(id) === -1;
    favorites = adding
      ? favorites.concat(id)
      : favorites.filter(function (savedId) { return savedId !== id; });

    const saved = writeFavorites(favorites);
    renderFavorites();

    if (!saved) {
      showToast('Your browser blocked saving, so this will reset when you leave the page.');
    } else if (adding) {
      showToast('Saved to favorites: ' + course.title);
    } else {
      showToast('Removed from favorites: ' + course.title);
    }
  }

  // ----- Small toast message -----
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
    }, 2600);
  }

  // ----- Search + filter state -----
  const state = { query: '', category: 'all' };

  function isValidCategory(value) {
    return Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, value);
  }

  function applyFilters() {
    const terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    let visibleCount = 0;

    courses.forEach(function (course) {
      const categoryMatches = state.category === 'all' || course.category === state.category;
      // Every typed word must appear somewhere in the course text
      const textMatches = terms.every(function (term) { return course.haystack.indexOf(term) !== -1; });
      const show = categoryMatches && textMatches;

      course.el.hidden = !show;
      if (show) { visibleCount += 1; }
    });

    // Chips: show which one is selected
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.category === state.category));
    });

    // Result text (textContent keeps it safe)
    let message = 'Showing ' + visibleCount + ' of ' + courses.length + ' courses';
    if (state.category !== 'all') { message += ' in ' + CATEGORY_LABELS[state.category]; }
    if (terms.length) { message += ' matching \u201C' + state.query.trim() + '\u201D'; }
    if (countEl) { countEl.textContent = message; }

    const filtersActive = state.category !== 'all' || terms.length > 0;
    if (clearBtn) { clearBtn.disabled = !filtersActive; }

    grid.hidden = visibleCount === 0;
    if (emptyState) { emptyState.hidden = visibleCount !== 0; }

    updateUrl();
  }

  function updateUrl() {
    // Keeps the address bar in step so a filtered page can be shared.
    // Some browsers block this on local files, so errors are ignored.
    try {
      const params = new URLSearchParams();
      if (state.category !== 'all') { params.set('category', state.category); }
      if (state.query.trim()) { params.set('q', state.query.trim()); }
      const queryString = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (queryString ? '?' + queryString : ''));
    } catch (error) {
      /* nothing to do */
    }
  }

  function clearFilters() {
    state.query = '';
    state.category = 'all';
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    applyFilters();
  }

  // ----- Start-up: read ?category= and ?q= from the address -----
  const params = new URLSearchParams(window.location.search);
  const categoryFromUrl = (params.get('category') || '').toLowerCase();
  if (isValidCategory(categoryFromUrl)) { state.category = categoryFromUrl; }

  const queryFromUrl = params.get('q');
  if (queryFromUrl) {
    state.query = queryFromUrl.slice(0, 80);
    if (searchInput) { searchInput.value = state.query; }
  }

  // ----- Events -----
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.query = searchInput.value;
      applyFilters();
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const category = chip.dataset.category;
      if (isValidCategory(category)) {
        state.category = category;
        applyFilters();
      }
    });
  });

  if (clearBtn) { clearBtn.addEventListener('click', clearFilters); }
  if (emptyClearBtn) { emptyClearBtn.addEventListener('click', clearFilters); }

  // One listener for all 8 hearts
  grid.addEventListener('click', function (event) {
    const button = event.target.closest('.btn-favorite');
    if (button && grid.contains(button)) {
      toggleFavorite(button.dataset.courseId);
    }
  });

  // If favorites change in another tab, update this page too
  window.addEventListener('storage', function (event) {
    if (event.key === FAVORITES_KEY) {
      favorites = readFavorites();
      renderFavorites();
    }
  });

  // ----- Reveal the controls (they stay hidden without JavaScript) -----
  if (toolbar) { toolbar.hidden = false; }
  if (resultBar) { resultBar.hidden = false; }
  favButtons.forEach(function (button) { button.hidden = false; });

  renderFavorites();
  applyFilters();
})();