/* ============================================================
   LIFE DASHBOARD — app.js
   Features: Greeting, Clock, Focus Timer, To-Do List (CRUD),
             Quick Links, Light/Dark Mode, Custom Name, No Duplicates
   Storage: LocalStorage only
   ============================================================ */

'use strict';

/* ── STORAGE KEYS ── */
const KEYS = {
  theme:  'ld_theme',
  name:   'ld_name',
  todos:  'ld_todos',
  links:  'ld_links',
  timer:  'ld_timer_minutes',
};

/* ── STATE ── */
const state = {
  theme:         localStorage.getItem(KEYS.theme)  || 'light',
  name:          localStorage.getItem(KEYS.name)   || '',
  todos:         JSON.parse(localStorage.getItem(KEYS.todos) || '[]'),
  links:         JSON.parse(localStorage.getItem(KEYS.links) || '[]'),
  timerMinutes:  parseInt(localStorage.getItem(KEYS.timer)   || '25', 10),
  timerSeconds:  0,
  timerRunning:  false,
  timerInterval: null,
  editingId:     null,
  sortMode:      'default',
};

/* ── SAVE HELPERS ── */
const save = {
  theme:  () => localStorage.setItem(KEYS.theme, state.theme),
  name:   () => localStorage.setItem(KEYS.name,  state.name),
  todos:  () => localStorage.setItem(KEYS.todos, JSON.stringify(state.todos)),
  links:  () => localStorage.setItem(KEYS.links, JSON.stringify(state.links)),
  timer:  () => localStorage.setItem(KEYS.timer, state.timerMinutes),
};

/* ── UNIQUE ID ── */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/* ============================================================
   CLOCK & DATE & GREETING
   ============================================================ */
const greetingEl = document.getElementById('greeting');
const clockEl    = document.getElementById('clock');
const dateEl     = document.getElementById('date');
const displayNameEl = document.getElementById('displayName');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getGreeting(hour) {
  if (hour < 5)  return { text: 'Good Night',    emoji: '🌙' };
  if (hour < 12) return { text: 'Good Morning',  emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  if (hour < 21) return { text: 'Good Evening',  emoji: '🌆' };
  return           { text: 'Good Night',          emoji: '🌙' };
}

function updateClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2, '0');
  const m    = String(now.getMinutes()).padStart(2, '0');
  const s    = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${h}:${m}:${s}`;

  const day  = DAYS[now.getDay()];
  const date = now.getDate();
  const mon  = MONTHS[now.getMonth()];
  const yr   = now.getFullYear();
  dateEl.textContent = `${day}, ${mon} ${date}, ${yr}`;

  const { text, emoji } = getGreeting(now.getHours());
  const nameTag = state.name ? `, ${state.name}` : '!';
  const suffix  = state.name ? '!' : '';
  greetingEl.textContent = `${text}${nameTag}${suffix} ${emoji}`;
}

setInterval(updateClock, 1000);
updateClock();

/* ============================================================
   CUSTOM NAME
   ============================================================ */
const nameModal    = document.getElementById('nameModal');
const nameInput    = document.getElementById('nameInput');
const editNameBtn  = document.getElementById('editNameBtn');
const saveNameBtn  = document.getElementById('saveNameBtn');
const cancelNameBtn = document.getElementById('cancelNameBtn');

function renderName() {
  displayNameEl.textContent = state.name || 'Stranger';
  updateClock(); // refresh greeting
}

editNameBtn.addEventListener('click', () => {
  nameInput.value = state.name;
  nameModal.classList.remove('hidden');
  nameInput.focus();
});

saveNameBtn.addEventListener('click', saveName);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveName(); });
cancelNameBtn.addEventListener('click', () => nameModal.classList.add('hidden'));
nameModal.addEventListener('click', e => { if (e.target === nameModal) nameModal.classList.add('hidden'); });

function saveName() {
  const val = nameInput.value.trim();
  state.name = val;
  save.name();
  renderName();
  nameModal.classList.add('hidden');
}

renderName();

/* ============================================================
   LIGHT / DARK THEME
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

function applyTheme() {
  htmlEl.setAttribute('data-theme', state.theme);
  themeIcon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  themeToggle.title = state.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  save.theme();
  applyTheme();
});

applyTheme();

/* ============================================================
   FOCUS TIMER
   ============================================================ */
const timerDisplay   = document.getElementById('timerDisplay');
const timerDuration  = document.getElementById('timerDuration');
const startBtn       = document.getElementById('startBtn');
const stopBtn        = document.getElementById('stopBtn');
const resetBtn       = document.getElementById('resetBtn');
const timerStatus    = document.getElementById('timerStatus');

timerDuration.value  = state.timerMinutes;

function formatTime(min, sec) {
  return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function renderTimer() {
  const totalSec   = state.timerMinutes * 60 - state.timerSeconds;
  const remaining  = Math.max(totalSec, 0);
  const dispMin    = Math.floor(remaining / 60);
  const dispSec    = remaining % 60;
  timerDisplay.textContent = formatTime(dispMin, dispSec);
}

function setTimerStatus(text) { timerStatus.textContent = text; }

function startTimer() {
  if (state.timerRunning) return;

  // Update minutes from input if timer hasn't started
  const inputVal = parseInt(timerDuration.value, 10);
  if (!isNaN(inputVal) && inputVal >= 1 && inputVal <= 99 && state.timerSeconds === 0) {
    state.timerMinutes = inputVal;
    save.timer();
  }

  state.timerRunning = true;
  startBtn.disabled  = true;
  stopBtn.disabled   = false;
  timerDuration.disabled = true;
  timerDisplay.classList.add('running');
  setTimerStatus('Focus! 🎯');

  state.timerInterval = setInterval(() => {
    state.timerSeconds++;
    const total = state.timerMinutes * 60;

    if (state.timerSeconds >= total) {
      state.timerSeconds = total;
      renderTimer();
      clearInterval(state.timerInterval);
      state.timerRunning = false;
      timerDisplay.classList.remove('running');
      startBtn.disabled  = false;
      stopBtn.disabled   = true;
      timerDuration.disabled = false;
      setTimerStatus('⏰ Time is up! Great job!');
      // Browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('Focus Timer', { body: 'Time is up! Great job! 🎉' });
      }
    } else {
      renderTimer();
    }
  }, 1000);
}

function stopTimer() {
  if (!state.timerRunning) return;
  clearInterval(state.timerInterval);
  state.timerRunning = false;
  startBtn.disabled  = false;
  stopBtn.disabled   = true;
  timerDisplay.classList.remove('running');
  setTimerStatus('Paused. Resume when ready.');
}

function resetTimer() {
  clearInterval(state.timerInterval);
  state.timerRunning = false;
  state.timerSeconds = 0;

  const inputVal = parseInt(timerDuration.value, 10);
  if (!isNaN(inputVal) && inputVal >= 1 && inputVal <= 99) {
    state.timerMinutes = inputVal;
    save.timer();
  }

  timerDuration.disabled = false;
  startBtn.disabled  = false;
  stopBtn.disabled   = true;
  timerDisplay.classList.remove('running');
  renderTimer();
  setTimerStatus('Ready to focus?');
}

timerDuration.addEventListener('change', () => {
  if (!state.timerRunning && state.timerSeconds === 0) {
    const v = parseInt(timerDuration.value, 10);
    if (!isNaN(v) && v >= 1 && v <= 99) {
      state.timerMinutes = v;
      save.timer();
      renderTimer();
    }
  }
});

startBtn.addEventListener('click', () => {
  // Request notification permission on first start
  if (Notification.permission === 'default') Notification.requestPermission();
  startTimer();
});
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

renderTimer();

/* ============================================================
   TO-DO LIST
   ============================================================ */
const todoInput    = document.getElementById('todoInput');
const addTodoBtn   = document.getElementById('addTodoBtn');
const todoListEl   = document.getElementById('todoList');
const duplicateMsg = document.getElementById('duplicateMsg');
const taskCountEl  = document.getElementById('taskCount');
const sortSelect   = document.getElementById('sortSelect');

/* Edit modal */
const editModal    = document.getElementById('editModal');
const editInput    = document.getElementById('editInput');
const saveEditBtn  = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

function isDuplicate(text, excludeId = null) {
  return state.todos.some(t =>
    t.id !== excludeId &&
    t.text.trim().toLowerCase() === text.trim().toLowerCase()
  );
}

function getSortedTodos() {
  const todos = [...state.todos];
  switch (state.sortMode) {
    case 'asc':  return todos.sort((a,b) => a.text.localeCompare(b.text));
    case 'desc': return todos.sort((a,b) => b.text.localeCompare(a.text));
    case 'done': return todos.sort((a,b) => Number(a.done) - Number(b.done));
    default:     return todos;
  }
}

function renderTodos() {
  const sorted = getSortedTodos();
  taskCountEl.textContent = `${state.todos.length} task${state.todos.length !== 1 ? 's' : ''}`;
  todoListEl.innerHTML = '';

  if (sorted.length === 0) {
    todoListEl.innerHTML = '<li class="empty-state">No tasks yet. Add one above! 🎉</li>';
    return;
  }

  sorted.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <input type="checkbox" ${todo.done ? 'checked' : ''} aria-label="Mark task done" />
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button class="btn-sm edit-btn" title="Edit task">✏️</button>
        <button class="btn-sm danger delete-btn" title="Delete task">🗑️</button>
      </div>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    li.querySelector('.edit-btn').addEventListener('click', () => openEditModal(todo.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

    todoListEl.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  if (isDuplicate(text)) {
    duplicateMsg.classList.remove('hidden');
    todoInput.focus();
    setTimeout(() => duplicateMsg.classList.add('hidden'), 3000);
    return;
  }

  duplicateMsg.classList.add('hidden');
  state.todos.push({ id: uid(), text, done: false });
  save.todos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) { todo.done = !todo.done; save.todos(); renderTodos(); }
}

function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  save.todos();
  renderTodos();
}

function openEditModal(id) {
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;
  state.editingId = id;
  editInput.value = todo.text;
  editModal.classList.remove('hidden');
  editInput.focus();
}

function saveEdit() {
  const text = editInput.value.trim();
  if (!text) return;

  if (isDuplicate(text, state.editingId)) {
    editInput.style.borderColor = 'var(--danger)';
    editInput.placeholder = 'Duplicate task!';
    setTimeout(() => { editInput.style.borderColor = ''; editInput.placeholder = ''; }, 2500);
    return;
  }

  const todo = state.todos.find(t => t.id === state.editingId);
  if (todo) { todo.text = text; save.todos(); renderTodos(); }
  editModal.classList.add('hidden');
  state.editingId = null;
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
saveEditBtn.addEventListener('click', saveEdit);
editInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveEdit(); });
cancelEditBtn.addEventListener('click', () => { editModal.classList.add('hidden'); state.editingId = null; });
editModal.addEventListener('click', e => { if (e.target === editModal) { editModal.classList.add('hidden'); state.editingId = null; } });

sortSelect.addEventListener('change', () => {
  state.sortMode = sortSelect.value;
  renderTodos();
});

renderTodos();

/* ============================================================
   QUICK LINKS
   ============================================================ */
const linkLabel  = document.getElementById('linkLabel');
const linkUrl    = document.getElementById('linkUrl');
const addLinkBtn = document.getElementById('addLinkBtn');
const linksListEl = document.getElementById('linksList');

function getFavicon(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?sz=16&domain_url=${origin}`;
  } catch { return ''; }
}

function renderLinks() {
  linksListEl.innerHTML = '';

  if (state.links.length === 0) {
    linksListEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No links yet. Add one above!</p>';
    return;
  }

  state.links.forEach(link => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const faviconSrc = getFavicon(link.url);
    const favicon = faviconSrc
      ? `<img src="${faviconSrc}" alt="" width="16" height="16" style="flex-shrink:0;border-radius:2px;" onerror="this.style.display='none'" />`
      : '';

    chip.innerHTML = `
      ${favicon}
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>
      <button class="link-delete" data-id="${link.id}" title="Remove link">✕</button>
    `;

    chip.querySelector('.link-delete').addEventListener('click', () => deleteLink(link.id));
    linksListEl.appendChild(chip);
  });
}

function addLink() {
  const label = linkLabel.value.trim();
  let   url   = linkUrl.value.trim();
  if (!label || !url) return;

  // Auto-prepend https if missing
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  try { new URL(url); } catch { linkUrl.style.borderColor = 'var(--danger)'; setTimeout(() => linkUrl.style.borderColor = '', 2500); return; }

  state.links.push({ id: uid(), label, url });
  save.links();
  renderLinks();
  linkLabel.value = '';
  linkUrl.value   = '';
  linkLabel.focus();
}

function deleteLink(id) {
  state.links = state.links.filter(l => l.id !== id);
  save.links();
  renderLinks();
}

addLinkBtn.addEventListener('click', addLink);
linkUrl.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });
linkLabel.addEventListener('keydown', e => { if (e.key === 'Enter') linkUrl.focus(); });

renderLinks();

/* ============================================================
   UTILITY
   ============================================================ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
