/* ==========================================================
   SKILLORA — js/learning-paths.js
   Path explorer, details popup, and saving the chosen path
   ========================================================== */
(function () {
  'use strict';

  // The chosen path is saved as a plain id, for example: frontend
  const PATH_KEY = 'skillora:path';

  const COURSE_TITLES = {
    'web-development': 'Web Development Foundations',
    'javascript-essentials': 'JavaScript Essentials',
    'frontend-development': 'Front-End Development',
    'uiux-design': 'UI/UX Design Fundamentals',
    'graphic-design': 'Graphic Design Essentials',
    'data-fundamentals': 'Data Fundamentals',
    'digital-marketing': 'Digital Marketing Foundations',
    'digital-business': 'Digital Business Essentials'
  };

  const ICONS = {
    development: 'M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14',
    design: 'M4 20l1-4L16 5l3 3L8 19l-4 1zM14 7l3 3',
    data: 'M4 20h16M7 16v-5M12 16V6M17 16v-8',
    business: 'M3 9h18v11H3zM9 9V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M3 14h18',
    flag: 'M5 21V4M5 4h11l-2 4 2 4H5'
  };

  // All path information lives here. Change text here and it updates the page.
  const PATHS = {
    frontend: {
      title: 'Front-End Development',
      category: 'development',
      level: 'Beginner',
      duration: 'Est. 14 weeks',
      description: 'Learn to structure, style, and add interactivity to websites.',
      stages: [
        { name: 'HTML', text: 'Structure a web page with headings, links, images, lists and forms.' },
        { name: 'CSS', text: 'Style pages with colour, spacing and typography, and make layouts adapt to any screen.' },
        { name: 'JavaScript', text: 'Add interactivity with variables, functions, events and the DOM.' },
        { name: 'Build a Website', text: 'Combine HTML, CSS and JavaScript to plan and build a complete multi-page site.' }
      ],
      project: 'Build a responsive multi-page personal website.',
      courses: ['web-development', 'javascript-essentials', 'frontend-development']
    },
    uiux: {
      title: 'UI/UX Design',
      category: 'design',
      level: 'Beginner',
      duration: 'Est. 10 weeks',
      description: 'Explore the process of creating useful and intuitive digital experiences.',
      stages: [
        { name: 'Design Principles', text: 'Study layout, hierarchy, colour and typography that make interfaces clear.' },
        { name: 'Wireframes', text: 'Sketch simple screen layouts and user flows before adding visual detail.' },
        { name: 'Prototypes', text: 'Turn wireframes into clickable prototypes so ideas can be tested early.' },
        { name: 'Portfolio Project', text: 'Design and present a complete app concept that shows your process.' }
      ],
      project: 'Design a mobile app prototype for your portfolio.',
      courses: ['uiux-design', 'graphic-design']
    },
    data: {
      title: 'Data Fundamentals',
      category: 'data',
      level: 'Beginner',
      duration: 'Est. 8 weeks',
      description: 'Learn to organise, interpret, and present information.',
      stages: [
        { name: 'Data Basics', text: 'Understand rows, columns and data types, and how to organise information.' },
        { name: 'Spreadsheets', text: 'Sort, filter and summarise data using spreadsheet tools.' },
        { name: 'Charts', text: 'Choose and build simple charts that show patterns clearly.' },
        { name: 'Data Project', text: 'Bring everything together in a short, clear data summary.' }
      ],
      project: 'Create a simple data summary dashboard.',
      courses: ['data-fundamentals']
    },
    business: {
      title: 'Digital Business',
      category: 'business',
      level: 'Beginner',
      duration: 'Est. 8 weeks',
      description: 'Explore the digital skills used to communicate, promote, and understand businesses.',
      stages: [
        { name: 'Business Basics', text: 'Learn how digital businesses define audiences and the value they offer.' },
        { name: 'Digital Marketing', text: 'Plan content and channels that help reach those audiences.' },
        { name: 'Analytics', text: 'Read basic measures to understand what is and is not working.' },
        { name: 'Campaign Project', text: 'Plan a sample campaign from idea to measurement.' }
      ],
      project: 'Plan a sample digital marketing campaign for a fictional business.',
      courses: ['digital-business', 'digital-marketing']
    }
  };

  function isPathId(id) {
    return typeof id === 'string' && Object.prototype.hasOwnProperty.call(PATHS, id);
  }

  // ----- Page elements (stop quietly on the wrong page) -----
  const explorer = document.getElementById('explorer');
  if (!explorer) { return; }

  const chips = Array.from(explorer.querySelectorAll('.chip[data-path]'));
  const panel = document.getElementById('explorer-panel');
  const panelIcon = document.getElementById('panel-icon');
  const panelTitle = document.getElementById('panel-title');
  const panelBadges = document.getElementById('panel-badges');
  const panelDesc = document.getElementById('panel-desc');
  const panelStepper = document.getElementById('panel-stepper');
  const panelStage = document.getElementById('panel-stage');
  const panelProject = document.getElementById('panel-project');
  const panelFlag = document.getElementById('panel-flag');
  const panelDetails = document.getElementById('panel-details');
  const panelStart = document.getElementById('panel-start');
  const banner = document.getElementById('selected-banner');
  const selectedName = document.getElementById('selected-name');
  const clearSelectionBtn = document.getElementById('clear-selection');
  const modal = document.getElementById('path-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const cards = Array.from(document.querySelectorAll('.path-card[data-path]'));

  // ----- Small helpers that build elements safely (no innerHTML) -----
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined && text !== null) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function makeIcon(pathData) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const shape = document.createElementNS(SVG_NS, 'path');
    shape.setAttribute('d', pathData);
    svg.appendChild(shape);
    return svg;
  }

  function makeTile(path) {
    const tile = el('span', 'icon-tile icon-tile--lg tile--' + path.category);
    tile.appendChild(makeIcon(ICONS[path.category]));
    return tile;
  }

  function makeBadges(container, path) {
    clear(container);
    container.appendChild(el('span', 'badge badge--level', path.level));
    container.appendChild(el('span', 'badge badge--level', path.duration));
  }

  // ----- Saved path (localStorage, with safe checks) -----
  function readSelected() {
    try {
      const raw = window.localStorage.getItem(PATH_KEY);
      if (!raw) { return ''; }
      const id = raw.replace(/^"+|"+$/g, '').trim();
      return isPathId(id) ? id : '';
    } catch (error) {
      return '';
    }
  }

  function saveSelected(id) {
    try { window.localStorage.setItem(PATH_KEY, id); return true; } catch (error) { return false; }
  }

  function removeSelected() {
    try { window.localStorage.removeItem(PATH_KEY); return true; } catch (error) { return false; }
  }

  // ----- State -----
  let selectedId = readSelected(); // the path the learner chose and saved
  let activeId = 'frontend';       // the path currently shown in the explorer
  let stageIndex = 0;              // the stage currently explained
  let lastTrigger = null;          // button that opened the popup

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
    }, 3200);
  }

  // ----- Explorer -----
  function renderStage() {
    const path = PATHS[activeId];
    const stage = path.stages[stageIndex];
    if (!stage) { return; }

    Array.from(panelStepper.children).forEach(function (item, index) {
      const isActive = index === stageIndex;
      item.classList.toggle('is-active', isActive);
      const dot = item.querySelector('.step-dot');
      if (dot) {
        if (isActive) { dot.setAttribute('aria-current', 'step'); } else { dot.removeAttribute('aria-current'); }
      }
    });

    clear(panelStage);
    panelStage.appendChild(el('strong', null, 'Stage ' + (stageIndex + 1) + ': ' + stage.name + '. '));
    panelStage.appendChild(document.createTextNode(stage.text));
  }

  function renderExplorer() {
    const path = PATHS[activeId];

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.path === activeId));
    });

    clear(panelIcon);
    panelIcon.appendChild(makeTile(path));
    panelTitle.textContent = path.title;
    makeBadges(panelBadges, path);
    panelDesc.textContent = path.description;
    panelProject.textContent = path.project;
    panelDetails.dataset.path = activeId;
    panelStart.dataset.path = activeId;

    clear(panelStepper);
    path.stages.forEach(function (stage, index) {
      const item = el('li', 'step');
      const dot = el('button', 'step-dot', String(index + 1));
      dot.setAttribute('type', 'button');
      dot.dataset.index = String(index);
      dot.setAttribute('aria-label', 'Stage ' + (index + 1) + ': ' + stage.name);
      item.appendChild(dot);
      item.appendChild(el('span', 'step-label', stage.name));
      panelStepper.appendChild(item);
    });

    stageIndex = 0;
    renderStage();
    renderSelected();
  }

  function setActivePath(id) {
    if (!isPathId(id)) { return; }
    activeId = id;
    renderExplorer();
    updateUrl();
  }

  function updateUrl() {
    // Keeps the address bar in step. Some browsers block this on local files, so errors are ignored.
    try {
      window.history.replaceState(null, '', window.location.pathname + '?path=' + activeId);
    } catch (error) {
      /* nothing to do */
    }
  }

  // ----- Selected-path display (banner, cards, buttons) -----
  function renderSelected() {
    const selected = selectedId ? PATHS[selectedId] : null;

    banner.hidden = !selected;
    if (selected) { selectedName.textContent = selected.title; }

    cards.forEach(function (card) {
      card.classList.toggle('is-selected', card.dataset.path === selectedId);
    });

    const isActiveSelected = Boolean(selectedId) && activeId === selectedId;
    panel.classList.toggle('is-selected', isActiveSelected);
    panelFlag.hidden = !isActiveSelected;

    document.querySelectorAll('.js-start').forEach(function (button) {
      const label = button.querySelector('.btn-label');
      if (label) {
        label.textContent = button.dataset.path === selectedId ? 'Selected' : 'Start This Path';
      }
    });
  }

  function selectPath(id) {
    if (!isPathId(id)) { return; }
    const path = PATHS[id];

    if (id === selectedId) {
      closeModal();
      showToast(path.title + ' is already your selected path.');
      return;
    }

    selectedId = id;
    const saved = saveSelected(id);
    renderSelected();
    closeModal();

    if (saved) {
      showToast('Path selected: ' + path.title + '. You can find it in My Learning on Get Started.');
    } else {
      showToast('Path selected for now, but your browser blocked saving it.');
    }
  }

  function clearSelection() {
    selectedId = '';
    removeSelected();
    renderSelected();
    showToast('Your selected path was cleared.');
  }

  // ----- Details popup -----
  function buildModal(path) {
    modalTitle.textContent = path.title;
    clear(modalBody);

    const badges = el('div', 'badge-row');
    makeBadges(badges, path);
    modalBody.appendChild(badges);

    modalBody.appendChild(el('p', 'course-desc', path.description));

    // Stages
    const stageBlock = el('div', 'detail-block');
    stageBlock.appendChild(el('h4', null, 'What you would learn, stage by stage'));
    const stageList = el('div');
    path.stages.forEach(function (stage, index) {
      const details = el('details', 'module');
      details.open = true;
      const summary = el('summary');
      summary.appendChild(el('span', 'module-num', String(index + 1)));
      summary.appendChild(el('span', null, stage.name));
      details.appendChild(summary);
      const body = el('div', 'module-body');
      body.appendChild(el('p', null, stage.text));
      details.appendChild(body);
      stageList.appendChild(details);
    });
    stageBlock.appendChild(stageList);
    modalBody.appendChild(stageBlock);

    // Final project
    const project = el('div', 'path-project');
    project.appendChild(makeIcon(ICONS.flag));
    const projectText = el('div');
    projectText.appendChild(el('p', null)).appendChild(el('strong', null, 'Final project'));
    projectText.appendChild(el('p', null, path.project));
    project.appendChild(projectText);
    modalBody.appendChild(project);

    // Related courses (links use fixed ids from this file, never from the address bar)
    const courseBlock = el('div', 'detail-block');
    courseBlock.appendChild(el('h4', null, 'Sample courses that support this path'));
    const courseList = el('ul', 'link-list');
    path.courses.forEach(function (courseId) {
      const item = el('li');
      const link = el('a', null, COURSE_TITLES[courseId]);
      link.setAttribute('href', 'course-details.html?id=' + courseId);
      item.appendChild(link);
      courseList.appendChild(item);
    });
    courseBlock.appendChild(courseList);
    modalBody.appendChild(courseBlock);

    modalBody.appendChild(el('p', 'notice', 'This is a sample path outline for a demonstration. SKILLORA does not track whether you have completed a stage.'));

    // Actions
    const actions = el('div', 'path-actions');
    const startBtn = el('button', 'btn btn-primary js-start');
    startBtn.setAttribute('type', 'button');
    startBtn.dataset.path = activeModalId;
    startBtn.appendChild(el('span', 'btn-label', 'Start This Path'));
    const closeBtn = el('button', 'btn btn-text js-close', 'Close');
    closeBtn.setAttribute('type', 'button');
    actions.appendChild(startBtn);
    actions.appendChild(closeBtn);
    modalBody.appendChild(actions);
  }

  let activeModalId = '';

  function openModal(id, trigger) {
    if (!modal || !isPathId(id)) { return; }
    activeModalId = id;
    lastTrigger = trigger || null;
    buildModal(PATHS[id]);
    renderSelected(); // sets the right label on the new Start button

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function onModalClosed() {
    document.body.style.overflow = '';
    if (lastTrigger && document.body.contains(lastTrigger)) { lastTrigger.focus(); }
  }

  function closeModal() {
    if (!modal) { return; }
    if (typeof modal.close === 'function') {
      if (modal.open) { modal.close(); } // the "close" event below does the rest
    } else if (modal.hasAttribute('open')) {
      modal.removeAttribute('open');
      onModalClosed();
    }
  }

  if (modal) {
    modal.addEventListener('close', onModalClosed);
    // Clicking the dark area outside the popup closes it
    modal.addEventListener('click', function (event) {
      if (event.target === modal) { closeModal(); }
    });
  }

  // ----- Events -----
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { setActivePath(chip.dataset.path); });
  });

  panelStepper.addEventListener('click', function (event) {
    const dot = event.target.closest('.step-dot');
    if (!dot) { return; }
    const index = Number(dot.dataset.index);
    if (Number.isInteger(index) && index >= 0 && index < PATHS[activeId].stages.length) {
      stageIndex = index;
      renderStage();
    }
  });

  if (clearSelectionBtn) { clearSelectionBtn.addEventListener('click', clearSelection); }

  // One listener handles every Start / Details / Close button on the page
  document.addEventListener('click', function (event) {
    const startBtn = event.target.closest('.js-start');
    if (startBtn) { selectPath(startBtn.dataset.path); return; }

    const detailsBtn = event.target.closest('.js-details');
    if (detailsBtn) { openModal(detailsBtn.dataset.path, detailsBtn); return; }

    if (event.target.closest('.js-close')) { closeModal(); }
  });

  // If the choice changes in another tab, update this page too
  window.addEventListener('storage', function (event) {
    if (event.key === PATH_KEY) {
      selectedId = readSelected();
      renderSelected();
    }
  });

  // ----- Start-up -----
  const params = new URLSearchParams(window.location.search);
  const pathFromUrl = (params.get('path') || '').toLowerCase();
  const hasUrlPath = isPathId(pathFromUrl);

  if (hasUrlPath) {
    activeId = pathFromUrl;
  } else if (selectedId) {
    activeId = selectedId;
  }

  explorer.hidden = false;
  document.querySelectorAll('.path-actions').forEach(function (box) { box.hidden = false; });
  renderExplorer();

  if (hasUrlPath) { explorer.scrollIntoView(); }
})();