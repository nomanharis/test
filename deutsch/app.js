(() => {
  'use strict';

  const LESSONS = window.LESSONS || [];
  const lessonById = (id) => LESSONS.find((l) => l.id === id);
  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------- tiny DOM helper ----------
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  // append / replaceChildren that skip null and false (used for optional pieces).
  const keep = (kids) => kids.flat(Infinity).filter((c) => c != null && c !== false);
  const put = (el, ...kids) => el.append(...keep(kids));
  const fill = (el, ...kids) => el.replaceChildren(...keep(kids));

  const ICON = {
    lesen: '<path d="M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1V19c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1z"/><path d="M12 6.5V20"/>',
    hoeren: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    schreiben: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    sprechen: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    grammatik: '<path d="M4 7h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7z"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    camera: '<path d="M4 8h3l1.6-2.2h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.2" r="3.6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  };
  const icon = (name, cls = 'ic') => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ICON[name];
    return s;
  };

  const MODULES = [
    { key: 'lesen', name: 'Lesen', en: 'Reading' },
    { key: 'hoeren', name: 'Hören', en: 'Listening' },
    { key: 'schreiben', name: 'Schreiben', en: 'Writing' },
    { key: 'sprechen', name: 'Sprechen', en: 'Speaking' },
    { key: 'grammatik', name: 'Grammatik', en: 'Grammar' },
  ];
  const modName = (k) => (MODULES.find((m) => m.key === k) || {}).name || k;

  // ---------- dates ----------
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseDay = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const fmtLong = (d) => d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  // ---------- persistent state (localStorage) ----------
  const KEY = 'alltagb1.v1';
  const defaults = () => ({
    progress: {},           // lessonId -> module -> { score, best, at, tries }
    log: {},                // YYYY-MM-DD -> { sec, acts: [{l, m, s}] }
    plan: null,             // { date, lessonId }
    writings: [],           // { lessonId, text, score, date }
    stats: { words: 0, spoken: 0, photos: 0, camTasks: 0 },
    settings: { goal: 15, rate: 0.95 },
  });
  let S = defaults();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        S = Object.assign(defaults(), d);
        S.stats = Object.assign(defaults().stats, d.stats);
        S.settings = Object.assign(defaults().settings, d.settings);
      }
    } catch (e) { /* private mode: work in memory */ }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  load();

  function todayLog() {
    const k = dayKey();
    if (!S.log[k]) S.log[k] = { sec: 0, acts: [] };
    return S.log[k];
  }

  function recordModule(lessonId, mod, score) {
    const p = (S.progress[lessonId] = S.progress[lessonId] || {});
    const prev = p[mod];
    p[mod] = {
      score,
      best: Math.max(score, prev ? prev.best : 0),
      at: Date.now(),
      tries: (prev ? prev.tries : 0) + 1,
    };
    todayLog().acts.push({ l: lessonId, m: mod, s: score });
    save();
    updateStreakChip();
  }
  const modDone = (lid, m) => !!(S.progress[lid] && S.progress[lid][m]);
  const lessonDoneCount = (lid) => MODULES.filter((m) => modDone(lid, m.key)).length;
  const lessonComplete = (lid) => lessonDoneCount(lid) === MODULES.length;
  function lessonAvg(lid) {
    const p = S.progress[lid] || {};
    const vals = MODULES.map((m) => (p[m.key] ? p[m.key].best : 0));
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  // Today's lesson: fixed for the whole day once chosen.
  function todaysLesson() {
    const today = dayKey();
    if (S.plan && S.plan.date === today && lessonById(S.plan.lessonId)) return lessonById(S.plan.lessonId);
    let pick = LESSONS.find((l) => !lessonComplete(l.id));
    if (!pick) {
      // Everything done once: review the weakest scene that wasn't yesterday's.
      const prevId = S.plan && S.plan.lessonId;
      pick = [...LESSONS].sort((a, b) => lessonAvg(a.id) - lessonAvg(b.id)).find((l) => l.id !== prevId) || LESSONS[0];
    }
    S.plan = { date: today, lessonId: pick.id };
    save();
    return pick;
  }

  function activeDays() {
    return Object.keys(S.log).filter((k) => S.log[k].acts.length || S.log[k].sec >= 60).sort();
  }
  function streak() {
    const days = new Set(activeDays());
    let d = new Date();
    if (!days.has(dayKey(d))) d = addDays(d, -1); // today not done yet: streak still alive from yesterday
    let n = 0;
    while (days.has(dayKey(d))) { n++; d = addDays(d, -1); }
    return n;
  }
  function updateStreakChip() {
    const n = streak();
    const chip = $('#streakChip');
    chip.textContent = n;
    chip.title = `${n} ${n === 1 ? 'Tag' : 'Tage'} in Folge`;
    chip.classList.toggle('hot', !!(S.log[dayKey()] && S.log[dayKey()].acts.length));
  }

  // ---------- practice-time tracking ----------
  let lastInteraction = Date.now();
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((ev) =>
    window.addEventListener(ev, () => { lastInteraction = Date.now(); }, { passive: true }));
  setInterval(() => {
    const practising = /^#\/(l|kamera)/.test(location.hash);
    const speaking = window.speechSynthesis && speechSynthesis.speaking;
    if (document.visibilityState === 'visible' && practising && (Date.now() - lastInteraction < 120000 || speaking)) {
      todayLog().sec += 15;
      save();
    }
  }, 15000);

  // ---------- toast & popover ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }
  const pop = $('#popover');
  function showPopover(anchor, content) {
    fill(pop, ...(Array.isArray(content) ? content : [content]));
    pop.hidden = false;
    const r = anchor.getBoundingClientRect();
    const pw = pop.offsetWidth;
    let left = r.left + r.width / 2 - pw / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - pw - 12));
    let top = r.bottom + 8;
    if (top + pop.offsetHeight > window.innerHeight - 80) top = r.top - pop.offsetHeight - 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }
  document.addEventListener('pointerdown', (e) => {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('.gloss, .word')) pop.hidden = true;
  });
  window.addEventListener('scroll', () => { pop.hidden = true; }, { passive: true });

  // ---------- text normalising ----------
  const norm = (s) => s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = (s) => (s.match(/[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)*/g) || []);

  // ---------- speech synthesis ----------
  const Speech = (() => {
    const supported = 'speechSynthesis' in window;
    let voices = [];
    const FEMALE = /(anna|petra|helena|katja|marlene|vicki|hedda|amala|seraphina|elke|klara|louisa|tanja|female|frau|google deutsch)/i;
    const MALE = /(markus|yannick|hans|conrad|stefan|killian|florian|jonas|ralf|bernd|male|mann)/i;
    function refresh() {
      if (!supported) return;
      voices = speechSynthesis.getVoices().filter((v) => /^de(-|_|$)/i.test(v.lang));
    }
    if (supported) {
      refresh();
      speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', refresh);
    }
    function pickVoice(gender) {
      if (!voices.length) return null;
      const de = voices.filter((v) => /de-DE/i.test(v.lang));
      const pool = de.length ? de : voices;
      const re = gender === 'm' ? MALE : FEMALE;
      return pool.find((v) => re.test(v.name)) || (gender === 'm' && pool[1]) || pool[0];
    }
    function speak(text, { gender = 'f', rate } = {}) {
      return new Promise((resolve) => {
        if (!supported) return resolve(false);
        const u = new SpeechSynthesisUtterance(text.replace(/…/g, ', '));
        u.lang = 'de-DE';
        const v = pickVoice(gender);
        if (v) u.voice = v;
        u.rate = rate || S.settings.rate;
        // If we only have one voice, shift the pitch so two speakers still sound different.
        const sameVoice = v && pickVoice('m') === pickVoice('f');
        u.pitch = sameVoice ? (gender === 'm' ? 0.8 : 1.15) : 1;
        // Some browsers occasionally never fire onend; don't let a dialogue hang on that.
        let done = false;
        const finish = (ok) => { if (!done) { done = true; clearTimeout(guard); resolve(ok); } };
        const guard = setTimeout(() => finish(false), 2500 + text.length * 110 / u.rate);
        u.onend = () => finish(true);
        u.onerror = () => finish(false);
        speechSynthesis.speak(u);
      });
    }
    function stop() { if (supported) speechSynthesis.cancel(); }
    return { supported, speak, stop, hasGerman: () => voices.length > 0 };
  })();

  // ---------- speech recognition ----------
  const Recog = (() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    let active = null;
    function listen({ onInterim } = {}) {
      return new Promise((resolve, reject) => {
        if (!Ctor) return reject(new Error('unsupported'));
        const r = new Ctor();
        active = r;
        r.lang = 'de-DE';
        r.interimResults = true;
        r.continuous = false;
        r.maxAlternatives = 1;
        let finalText = '';
        r.onresult = (e) => {
          let interim = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
          }
          onInterim && onInterim((finalText + ' ' + interim).trim());
        };
        r.onerror = (e) => { active = null; reject(new Error(e.error || 'error')); };
        r.onend = () => { active = null; resolve(finalText.trim()); };
        r.start();
      });
    }
    function stop() { if (active) active.stop(); }
    return { supported: !!Ctor, listen, stop };
  })();

  // Mic button that records into a callback; falls back to a hint when unsupported.
  function micButton({ label = 'Sprechen', onText, onStart }) {
    const live = h('span', { class: 'mic-live' });
    const btn = h('button', { class: 'mic', type: 'button' }, icon('sprechen'), h('span', { class: 'mic-label' }, label));
    let listening = false;
    btn.addEventListener('click', async () => {
      if (!Recog.supported) {
        toast('Spracherkennung gibt es in diesem Browser nicht – bitte tippen Sie Ihre Antwort.');
        return;
      }
      if (listening) { Recog.stop(); return; }
      Speech.stop();
      listening = true;
      btn.classList.add('on');
      btn.querySelector('.mic-label').textContent = 'Ich höre zu …';
      onStart && onStart();
      try {
        const text = await Recog.listen({ onInterim: (t) => { live.textContent = t; } });
        if (text) onText(text);
        else toast('Ich habe nichts gehört. Noch einmal?');
      } catch (e) {
        toast(e.message === 'not-allowed' ? 'Bitte erlauben Sie den Zugriff auf das Mikrofon.' : 'Das hat nicht geklappt. Noch einmal versuchen?');
      } finally {
        listening = false;
        live.textContent = '';
        btn.classList.remove('on');
        btn.querySelector('.mic-label').textContent = label;
      }
    });
    return h('div', { class: 'mic-wrap' }, btn, live);
  }

  // ---------- router ----------
  const view = $('#view');
  function route() {
    Speech.stop();
    pop.hidden = true;
    const parts = (location.hash.replace(/^#\/?/, '') || 'heute').split('/');
    const [a, b, c] = parts;
    document.querySelectorAll('.tabbar a').forEach((x) => {
      const tab = x.dataset.tab;
      x.classList.toggle('active', tab === a || (a === 'l' && tab === 'linie'));
    });
    fill(view, );
    window.scrollTo(0, 0);
    if (a === 'linie') renderLine();
    else if (a === 'l' && lessonById(b) && c) renderModule(lessonById(b), c);
    else if (a === 'l' && lessonById(b)) renderLesson(lessonById(b));
    else if (a === 'kamera' && b) renderPhoto(b);
    else if (a === 'kamera') renderCamera();
    else if (a === 'fortschritt') renderTracker();
    else renderHome();
    view.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  // ---------- shared pieces ----------
  function placeSign(lesson, small) {
    return h('div', { class: 'ortsschild' + (small ? ' small' : '') },
      h('span', { class: 'os-top' }, 'Szene ' + (LESSONS.indexOf(lesson) + 1)),
      h('span', { class: 'os-place' }, lesson.place));
  }
  function ring(frac, label, size = 44) {
    const r = 18, c = 2 * Math.PI * r;
    const wrap = h('span', { class: 'ring', style: `width:${size}px;height:${size}px` });
    wrap.innerHTML = `<svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="${r}" class="ring-bg"/>${frac > 0 ? '' : '<!--'}<circle cx="22" cy="22" r="${r}" class="ring-fg" stroke-dasharray="${(c * Math.max(0, Math.min(1, frac))).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 22 22)"/>${frac > 0 ? '' : '-->'}</svg>`;
    if (label != null) wrap.append(h('span', { class: 'ring-label' }, label));
    return wrap;
  }
  function nextModule(lesson) {
    return MODULES.find((m) => !modDone(lesson.id, m.key));
  }
  function skillDoors(lesson) {
    return h('div', { class: 'doors' }, MODULES.map((m) => {
      const p = (S.progress[lesson.id] || {})[m.key];
      return h('a', { class: 'door' + (p ? ' done' : ''), href: `#/l/${lesson.id}/${m.key}` },
        h('span', { class: 'door-icon' }, icon(m.key)),
        h('span', { class: 'door-name' }, m.name),
        h('span', { class: 'door-sub' }, p ? `${Math.round(p.best * 100)} %` : m.en));
    }));
  }
  function backLink(href, text) {
    return h('a', { class: 'back', href }, '‹ ', text);
  }
  function greeting() {
    const hr = new Date().getHours();
    return hr < 11 ? 'Guten Morgen' : hr < 18 ? 'Guten Tag' : 'Guten Abend';
  }

  // ---------- HOME ----------
  const PHOTO_PROMPTS = [
    'Fotografieren Sie heute ein Schild an einer Haltestelle oder am Bahnhof.',
    'Fotografieren Sie ein Etikett im Supermarkt – Zutaten, Pfand oder Angebot.',
    'Fotografieren Sie einen Aushang im Treppenhaus, im Büro oder an der Uni.',
    'Fotografieren Sie eine Situation auf der Straße und beschreiben Sie sie auf Deutsch.',
    'Fotografieren Sie einen englischen Text und übersetzen Sie ihn ins Deutsche.',
    'Fotografieren Sie eine Speisekarte oder eine Tafel vor einem Café.',
    'Fotografieren Sie einen Brief oder eine Rechnung (ohne persönliche Daten).',
  ];

  function renderHome() {
    const lesson = todaysLesson();
    const now = new Date();
    const goalSec = S.settings.goal * 60;
    const sec = (S.log[dayKey()] || {}).sec || 0;
    const nm = nextModule(lesson);
    const doneN = lessonDoneCount(lesson.id);

    const week = h('div', { class: 'weekstrip', 'aria-label': 'Diese Woche' });
    const monday = addDays(now, -((now.getDay() + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const d = addDays(monday, i);
      const k = dayKey(d);
      const lg = S.log[k];
      const on = lg && (lg.acts.length || lg.sec >= 60);
      week.append(h('span', { class: 'wd' + (on ? ' on' : '') + (k === dayKey() ? ' today' : ''), title: on ? `${Math.round((lg.sec || 0) / 60)} Min. geübt` : '' },
        h('b', {}, WD[d.getDay()]), h('i', {})));
    }

    put(view, 
      h('section', { class: 'hello' },
        h('p', { class: 'kicker' }, fmtLong(now)),
        h('h1', {}, greeting() + '!'),
        h('div', { class: 'goal-row' },
          ring(sec / goalSec, `${Math.floor(sec / 60)}`, 56),
          h('div', {},
            h('b', {}, sec >= goalSec ? 'Tagesziel geschafft.' : `Ihr Tagesziel: ${S.settings.goal} Minuten`),
            h('span', { class: 'muted' }, sec >= goalSec ? ' Sehr gut – alles Weitere ist Bonus.' : ` Noch ${Math.max(1, Math.ceil((goalSec - sec) / 60))} Min.`)),
        ),
        week),

      h('section', { class: 'today-card', style: `--accent:${lesson.color}` },
        h('div', { class: 'today-head' },
          placeSign(lesson),
          h('div', { class: 'today-meta' },
            h('span', { class: 'kicker' }, lessonComplete(lesson.id) ? 'Heute: Wiederholung' : 'Ihre Szene für heute'),
            h('h2', {}, lesson.title),
            h('span', { class: 'chip' }, lesson.grammar.title))),
        h('p', { class: 'scene' }, lesson.scene),
        skillDoors(lesson),
        h('div', { class: 'today-cta' },
          nm
            ? h('a', { class: 'btn primary', href: `#/l/${lesson.id}/${nm.key}` }, doneN ? `Weiter mit ${nm.name}` : `Los geht's: ${nm.name}`)
            : h('a', { class: 'btn primary', href: '#/linie' }, 'Szene geschafft – nächste Szene wählen'),
          h('span', { class: 'muted' }, `${doneN} von ${MODULES.length} Teilen`))),

      h('a', { class: 'photo-card', href: '#/kamera' },
        h('span', { class: 'pc-icon' }, icon('camera')),
        h('span', {},
          h('b', {}, 'Foto-Aufgabe des Tages'),
          h('span', {}, PHOTO_PROMPTS[(now.getDate() + now.getMonth()) % PHOTO_PROMPTS.length])))
    );
  }

  // ---------- LINE (lesson route) ----------
  function renderLine() {
    const today = todaysLesson();
    const line = h('ol', { class: 'line', 'aria-label': 'Alle Szenen' });
    LESSONS.forEach((l, i) => {
      const n = lessonDoneCount(l.id);
      line.append(h('li', { class: 'station' + (n === MODULES.length ? ' done' : n ? ' started' : '') + (l.id === today.id ? ' current' : ''), style: `--accent:${l.color}` },
        h('a', { href: `#/l/${l.id}` },
          h('span', { class: 'stop' }, ring(n / MODULES.length, String(i + 1), 40)),
          h('span', { class: 'st-body' },
            h('span', { class: 'st-place' }, l.place, l.id === today.id ? h('em', { class: 'today-badge' }, 'Heute') : null),
            h('span', { class: 'st-title' }, l.title),
            h('span', { class: 'st-gram' }, l.grammar.title)))));
    });
    put(view, 
      h('section', { class: 'page-head' },
        h('p', { class: 'kicker' }, 'Ihre Linie'),
        h('h1', {}, 'Zwölf Szenen aus dem Alltag'),
        h('p', { class: 'muted' }, 'Jede Haltestelle ist eine Alltagssituation mit Lesen, Hören, Schreiben, Sprechen und einem Grammatik-Schwerpunkt. Jeden Tag wartet eine Szene auf Sie; wenn alle geschafft sind, wiederholen Sie die schwächsten.')),
      line);
  }

  // ---------- LESSON OVERVIEW ----------
  function renderLesson(lesson) {
    put(view, 
      backLink('#/linie', 'Alle Szenen'),
      h('section', { class: 'lesson-hero', style: `--accent:${lesson.color}` },
        placeSign(lesson),
        h('h1', {}, lesson.title),
        h('p', { class: 'scene' }, lesson.scene)),
      skillDoors(lesson),
      h('section', { class: 'card gram-note' },
        h('p', { class: 'kicker' }, 'Grammatik in dieser Szene'),
        h('h3', {}, lesson.grammar.title),
        h('p', { html: lesson.grammar.explain }),
        h('p', { class: 'ref' }, 'Zum Nachschlagen: ', lesson.grammar.ref)));
  }

  // ---------- MODULE SHELL ----------
  function renderModule(lesson, key) {
    const idx = MODULES.findIndex((m) => m.key === key);
    if (idx < 0) { location.hash = `#/l/${lesson.id}`; return; }
    const m = MODULES[idx];
    put(view, 
      backLink(`#/l/${lesson.id}`, lesson.title),
      h('header', { class: 'mod-head', style: `--accent:${lesson.color}` },
        h('span', { class: 'mod-icon' }, icon(key)),
        h('div', {},
          h('p', { class: 'kicker' }, `${lesson.place} · ${m.en}`),
          h('h1', {}, m.name)),
        h('div', { class: 'mod-steps' }, MODULES.map((x) =>
          h('a', { href: `#/l/${lesson.id}/${x.key}`, class: (x.key === key ? 'cur ' : '') + (modDone(lesson.id, x.key) ? 'ok' : ''), title: x.name, 'aria-label': x.name })))));
    const body = h('div', { class: 'mod-body' });
    put(view, body);
    const finish = (score) => {
      recordModule(lesson.id, key, score);
      const nextM = MODULES.slice(idx + 1).find((x) => !modDone(lesson.id, x.key)) || MODULES.find((x) => !modDone(lesson.id, x.key));
      const bar = h('div', { class: 'finish' },
        h('div', { class: 'finish-score' }, ring(score, `${Math.round(score * 100)}`, 64),
          h('div', {}, h('b', {}, verdict(score)), h('span', { class: 'muted' }, ` ${m.name} ist gespeichert.`))),
        nextM
          ? h('a', { class: 'btn primary', href: `#/l/${lesson.id}/${nextM.key}` }, `Weiter: ${nextM.name}`)
          : h('a', { class: 'btn primary', href: '#/fortschritt' }, 'Szene geschafft! Fortschritt ansehen'));
      const old = body.querySelector('.finish');
      if (old) old.replaceWith(bar); else put(body, bar);
      bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    ({ lesen: modReading, hoeren: modListening, schreiben: modWriting, sprechen: modSpeaking, grammatik: modGrammar })[key](lesson, body, finish);
  }
  const verdict = (s) => s >= 0.9 ? 'Ausgezeichnet!' : s >= 0.7 ? 'Gut gemacht!' : s >= 0.5 ? 'Nicht schlecht.' : 'Weiter üben – das wird!';

  // ---------- questions (reading & listening) ----------
  function questionBlock(questions) {
    const answers = new Array(questions.length).fill(null);
    let checked = false;
    const items = questions.map((q, i) => {
      const opts = q.type === 'rf' ? ['richtig', 'falsch'] : q.options;
      const btns = opts.map((o, j) => h('button', {
        type: 'button', class: 'opt',
        onclick: () => {
          if (checked) return;
          answers[i] = j;
          btns.forEach((b, k) => b.classList.toggle('sel', k === j));
        },
      }, o));
      const el = h('div', { class: 'q' + (q.type === 'rf' ? ' rf' : '') },
        h('p', { class: 'q-text' }, h('span', { class: 'q-n' }, i + 1), q.q),
        h('div', { class: 'opts' }, btns));
      return { el, btns, q };
    });
    function check() {
      if (answers.some((a) => a === null)) { toast('Bitte beantworten Sie zuerst alle Fragen.'); return null; }
      checked = true;
      let right = 0;
      items.forEach(({ el, btns, q }, i) => {
        const correct = q.type === 'rf' ? (q.a ? 0 : 1) : q.a;
        btns.forEach((b, k) => {
          b.disabled = true;
          if (k === correct) b.classList.add('right');
          else if (k === answers[i]) b.classList.add('wrong');
        });
        if (answers[i] === correct) right++;
        el.classList.add(answers[i] === correct ? 'is-right' : 'is-wrong');
      });
      return right / questions.length;
    }
    return { el: h('div', { class: 'questions' }, items.map((x) => x.el)), check };
  }

  // ---------- READING ----------
  function glossed(text) {
    const frag = document.createDocumentFragment();
    text.split(/\n\n/).forEach((para) => {
      const p = h('p', {});
      const parts = para.split(/(\[\[[^\]]+\]\])/);
      parts.forEach((part) => {
        const m = part.match(/^\[\[([^|\]]+)\|([^\]]+)\]\]$/);
        if (m) {
          p.append(h('button', { type: 'button', class: 'gloss', onclick: (e) => showPopover(e.currentTarget, [h('b', {}, m[1]), ' – ', m[2], ' ', speakBtn(m[1])]) }, m[1]));
        } else {
          part.split('\n').forEach((line, i) => { if (i) p.append(h('br')); p.append(line); });
        }
      });
      frag.append(p);
    });
    return frag;
  }
  function speakBtn(text, gender = 'f', label) {
    return h('button', { type: 'button', class: 'say', title: 'Vorlesen', 'aria-label': 'Vorlesen', onclick: (e) => { e.stopPropagation(); Speech.stop(); Speech.speak(text, { gender }); } }, icon('speaker'), label || null);
  }

  function modReading(lesson, body, finish) {
    const r = lesson.reading;
    const doc = h('article', { class: 'doc doc-' + r.kind },
      r.kind === 'email'
        ? h('div', { class: 'doc-mailhead' }, h('span', {}, h('b', {}, 'Von: '), r.from), h('span', {}, h('b', {}, 'Betreff: '), r.subject))
        : h('div', { class: 'doc-head' }, h('span', { class: 'doc-src' }, r.from), h('h2', {}, r.subject)),
      h('div', { class: 'doc-text' }, glossed(r.text)));
    const qb = questionBlock(r.questions);
    const btn = h('button', { class: 'btn primary', onclick: () => {
      const s = qb.check();
      if (s == null) return;
      btn.remove();
      finish(s);
    } }, 'Auswerten');
    put(body, 
      h('p', { class: 'lead' }, 'Lesen Sie den Text. Unterstrichene Wörter können Sie antippen, um die Bedeutung zu sehen.'),
      doc,
      h('h3', { class: 'section-title' }, 'Haben Sie alles verstanden?'),
      qb.el, btn);
  }

  // ---------- LISTENING ----------
  function modListening(lesson, body, finish) {
    const L = lesson.listening;
    let playing = false, plays = 0, slow = false;
    const status = h('span', { class: 'player-status' }, 'Bereit');
    const bar = h('span', { class: 'player-bar' }, h('i', {}));
    const playBtn = h('button', { class: 'play', type: 'button', 'aria-label': 'Abspielen' }, icon('play'));
    const slowBtn = h('button', { type: 'button', class: 'toggle', 'aria-pressed': 'false', onclick: () => {
      slow = !slow;
      slowBtn.setAttribute('aria-pressed', String(slow));
    } }, 'Langsamer');
    async function playAll() {
      if (playing) { playing = false; Speech.stop(); return; }
      if (!Speech.supported) { toast('Ihr Browser kann keinen Text vorlesen. Sie können das Transkript lesen.'); return; }
      playing = true; plays++;
      fill(playBtn, icon('stop'));
      for (let i = 0; i < L.lines.length && playing; i++) {
        const [g, who] = L.lines[i];
        status.textContent = `${who} spricht … (${i + 1}/${L.lines.length})`;
        bar.firstChild.style.width = `${((i + 1) / L.lines.length) * 100}%`;
        await Speech.speak(L.lines[i][2], { gender: g, rate: slow ? 0.78 : S.settings.rate });
        await new Promise((r) => setTimeout(r, 250));
      }
      playing = false;
      fill(playBtn, icon('play'));
      status.textContent = plays === 1 ? 'Einmal gehört. Noch einmal?' : `${plays}× gehört`;
    }
    playBtn.addEventListener('click', playAll);

    const transcript = h('div', { class: 'transcript', hidden: true },
      h('h3', { class: 'section-title' }, 'Transkript'),
      h('p', { class: 'muted small' }, 'Tippen Sie auf eine Zeile, um sie noch einmal zu hören.'),
      L.lines.map(([g, who, text]) => h('button', { type: 'button', class: 'line-say ' + g, onclick: () => { Speech.stop(); Speech.speak(text, { gender: g }); } },
        h('b', {}, who), h('span', {}, text))));

    const qb = questionBlock(L.questions);
    const btn = h('button', { class: 'btn primary', onclick: () => {
      const s = qb.check();
      if (s == null) return;
      btn.remove();
      transcript.hidden = false;
      finish(s);
    } }, 'Auswerten');

    put(body, 
      h('p', { class: 'lead' }, L.intro, ' Hören Sie zuerst ohne Text – so wie im echten Leben. Das Transkript sehen Sie nach dem Auswerten.'),
      h('div', { class: 'player' }, playBtn, h('div', { class: 'player-mid' }, status, bar), slowBtn),
      !Speech.supported ? h('p', { class: 'warn' }, 'Hinweis: Dieser Browser hat keine Sprachausgabe. Öffnen Sie die App in Chrome, Edge oder Safari, um die Dialoge zu hören.') : null,
      h('h3', { class: 'section-title' }, 'Was haben Sie gehört?'),
      qb.el, btn, transcript);
    if (!Speech.supported) {
      put(body, h('button', { class: 'btn ghost', onclick: (e) => { transcript.hidden = false; e.target.remove(); } }, 'Transkript trotzdem zeigen'));
    }
  }

  // ---------- WRITING ----------
  const CONNECTORS = ['weil', 'obwohl', 'deshalb', 'trotzdem', 'denn', 'dass', 'wenn', 'außerdem', 'damit', 'aber', 'falls', 'als', 'daher', 'sondern', 'danach', 'zuerst', 'allerdings', 'jedoch', 'also'];
  function analyseWriting(text, W) {
    const lower = text.toLowerCase();
    const wc = words(text).length;
    const points = W.points.map((p) => new RegExp(p.re, 'i').test(text));
    const used = CONNECTORS.filter((c) => new RegExp(`(^|[^a-zäöüß])${c}([^a-zäöüß]|$)`, 'i').test(lower));
    let form = { ok: true, notes: [] };
    if (W.format === 'formal') {
      const greet = /sehr geehrte|guten tag/i.test(text);
      const close = /mit freundlichen grüßen|freundliche grüße|mit besten grüßen/i.test(text);
      const du = /\b(du|dich|dir|dein|deine)\b/i.test(text);
      if (!greet) form.notes.push('Formelle Anrede fehlt (z. B. „Sehr geehrte Frau …“).');
      if (!close) form.notes.push('Formeller Gruß fehlt („Mit freundlichen Grüßen“).');
      if (du) form.notes.push('Sie verwenden „du“ – in einem formellen Brief schreibt man „Sie“.');
      form.ok = greet && close && !du;
    } else if (W.format === 'informal') {
      const greet = /^\s*(liebe|lieber|hallo|hi|servus|moin)\b/im.test(text);
      const close = /grüße|grüß|bis bald|bis dann|bis morgen|bis freitag|bis samstag|tschüss/i.test(text);
      if (!greet) form.notes.push('Eine persönliche Anrede fehlt (z. B. „Liebe Anna,“ oder „Hallo …,“).');
      if (!close) form.notes.push('Ein Gruß am Ende fehlt (z. B. „Viele Grüße“).');
      form.ok = greet && close;
    }
    const pointScore = points.filter(Boolean).length / points.length;
    const lenScore = Math.min(1, wc / W.minWords);
    const conScore = Math.min(1, used.length / 3);
    const score = pointScore * 0.55 + lenScore * 0.2 + conScore * 0.15 + (form.ok ? 0.1 : 0);
    return { wc, points, used, form, score };
  }

  function modWriting(lesson, body, finish) {
    const W = lesson.writing;
    const draftKey = `alltagb1.draft.${lesson.id}`;
    let draft = '';
    try { draft = localStorage.getItem(draftKey) || ''; } catch (e) { /* ignore */ }
    const ta = h('textarea', { class: 'paper-input', rows: 12, spellcheck: 'false', lang: 'de', placeholder: W.format === 'formal' ? 'Sehr geehrte …' : W.format === 'informal' ? 'Liebe … / Hallo …' : 'Ihre Meinung …' });
    ta.value = draft;
    const counter = h('span', { class: 'wc' });
    const pointEls = W.points.map((p) => h('span', { class: 'point' }, h('i', {}), p.t));
    function live() {
      const a = analyseWriting(ta.value, W);
      counter.textContent = `${a.wc} / ${W.minWords}+ Wörter`;
      counter.classList.toggle('ok', a.wc >= W.minWords);
      a.points.forEach((ok, i) => pointEls[i].classList.toggle('hit', ok));
      try { localStorage.setItem(draftKey, ta.value); } catch (e) { /* ignore */ }
    }
    ta.addEventListener('input', live);
    live();

    const feedback = h('div', { class: 'feedback' });
    const btn = h('button', { class: 'btn primary', onclick: () => {
      if (words(ta.value).length < 15) { toast('Schreiben Sie bitte noch etwas mehr.'); return; }
      const a = analyseWriting(ta.value, W);
      fill(feedback, 
        h('h3', { class: 'section-title' }, 'Rückmeldung'),
        h('div', { class: 'fb-grid' },
          fbTile('Inhalt', `${a.points.filter(Boolean).length} von ${a.points.length} Punkten`, a.points.every(Boolean)),
          fbTile('Länge', `${a.wc} Wörter`, a.wc >= W.minWords),
          fbTile('Verbindungen', a.used.length ? a.used.join(', ') : 'noch keine', a.used.length >= 3),
          W.format !== 'forum' ? fbTile('Form', a.form.ok ? 'Anrede und Gruß passen' : 'bitte prüfen', a.form.ok) : null),
        a.points.some((x) => !x) ? h('p', { class: 'hint' }, 'Diese Punkte konnte ich nicht sicher finden: ', W.points.filter((_, i) => !a.points[i]).map((p) => p.t).join(' ')) : null,
        a.form.notes.length ? h('p', { class: 'hint' }, a.form.notes.join(' ')) : null,
        a.used.length < 3 ? h('p', { class: 'hint' }, 'Tipp: Verbinden Sie Ihre Sätze mit weil, deshalb, obwohl, außerdem oder trotzdem – das klingt nach B1.') : null,
        h('details', { class: 'model', open: true },
          h('summary', {}, 'So könnte eine gute Antwort aussehen'),
          h('div', { class: 'model-text' }, W.model.split('\n').map((l) => [l, h('br')])),
          speakBtn(W.model.replace(/\[Ihr Name\]/g, ''), 'f', ' Vorlesen')),
        h('p', { class: 'muted small' }, 'Die automatische Rückmeldung prüft Inhalt, Länge und Form. Rechtschreibung und Grammatik vergleichen Sie am besten selbst mit dem Mustertext.'));
      S.writings.unshift({ lessonId: lesson.id, text: ta.value, score: a.score, date: dayKey() });
      S.writings = S.writings.slice(0, 60);
      S.stats.words += a.wc;
      btn.textContent = 'Neue Version abgeben';
      finish(a.score);
    } }, 'Abgeben');

    put(body, 
      h('div', { class: 'task-card' },
        h('p', { class: 'kicker' }, 'Ihre Aufgabe'),
        h('p', { class: 'task' }, W.task),
        h('p', { class: 'muted small' }, 'Denken Sie an diese Punkte – sie leuchten auf, sobald Ihr Text sie enthält:'),
        h('div', { class: 'points' }, pointEls)),
      h('div', { class: 'paper' }, ta, counter),
      btn, feedback);
  }
  function fbTile(title, value, ok) {
    return h('div', { class: 'fb' + (ok ? ' ok' : ' todo') }, h('span', {}, title), h('b', {}, value));
  }

  // ---------- SPEAKING ----------
  function matchKeys(text, keys) {
    const t = ' ' + norm(text) + ' ';
    return keys.map((group) => group.some((k) => t.includes(norm(k)) || t.includes(' ' + norm(k).trim() + ' ')));
  }
  function similarity(said, target) {
    const tw = norm(target).split(' ');
    const sw = new Set(norm(said).split(' '));
    const hits = tw.map((w) => sw.has(w));
    return { score: hits.filter(Boolean).length / tw.length, hits, tw: target.split(/\s+/) };
  }

  function modSpeaking(lesson, body, finish) {
    const SP = lesson.speaking;
    const chat = h('div', { class: 'chat' });
    const stage = h('div', { class: 'stage' });
    const turnScores = new Array(SP.turns.length).fill(null);
    let shadowScores = [];

    const startBtn = h('button', { class: 'btn primary', onclick: () => { startBtn.remove(); turn(0); } }, 'Gespräch beginnen');
    put(body, 
      h('p', { class: 'lead' }, SP.intro, ` Sie sprechen mit ${SP.partner}. Hören Sie zu, lesen Sie Ihre Aufgabe und antworten Sie laut.`),
      !Recog.supported ? h('p', { class: 'warn' }, 'In diesem Browser gibt es keine Spracherkennung. Sprechen Sie Ihre Antwort trotzdem laut und tippen Sie sie danach ein – oder öffnen Sie die App in Chrome oder Safari.') : null,
      chat, stage, startBtn);

    function bubble(who, text, cls) {
      const b = h('div', { class: 'bubble ' + cls }, h('b', {}, who), h('span', {}, text));
      chat.append(b);
      b.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return b;
    }

    async function turn(i) {
      const T = SP.turns[i];
      const pb = bubble(SP.partner, T.say, 'them');
      pb.append(speakBtn(T.say, SP.voice));
      const goal = h('div', { class: 'goal' }, h('span', { class: 'kicker' }, `Ihre Aufgabe ${i + 1}/${SP.turns.length}`), h('p', {}, T.goal));
      const typed = h('input', { type: 'text', class: 'type-answer', placeholder: 'Oder hier tippen …', lang: 'de', enterkeyhint: 'send' });
      const fb = h('div', { class: 'turn-fb' });
      const nextBtn = h('button', { class: 'btn primary', hidden: true, onclick: () => { fill(stage, ); i + 1 < SP.turns.length ? turn(i + 1) : shadowing(); } }, i + 1 < SP.turns.length ? 'Weiter' : 'Zum Nachsprechen');
      const handle = (text, spoken) => {
        bubble('Sie', text, 'me');
        const hits = matchKeys(text, T.keys);
        const sc = hits.filter(Boolean).length / hits.length;
        turnScores[i] = Math.max(turnScores[i] || 0, sc);
        if (spoken) S.stats.spoken++;
        fill(fb, 
          h('p', { class: sc === 1 ? 'ok' : 'hint' }, sc === 1 ? 'Passt! Sie haben die Aufgabe erfüllt.' : sc > 0 ? 'Fast – es fehlt noch ein Teil der Aufgabe.' : 'Das passt noch nicht ganz zur Aufgabe. Versuchen Sie es noch einmal.'),
          h('div', { class: 'model-line' }, h('span', { class: 'muted small' }, 'Zum Beispiel: '), h('i', {}, T.model), speakBtn(T.model, 'f')));
        nextBtn.hidden = false;
        save();
      };
      typed.addEventListener('keydown', (e) => { if (e.key === 'Enter' && typed.value.trim()) { handle(typed.value.trim(), false); typed.value = ''; } });
      fill(stage, goal,
        h('div', { class: 'answer-row' }, micButton({ label: 'Antworten', onText: (t) => handle(t, true) }), typed),
        fb, nextBtn);
      await Speech.speak(T.say, { gender: SP.voice });
    }

    function shadowing() {
      bubble(SP.partner, 'Danke für das Gespräch!', 'them');
      shadowScores = new Array(SP.shadow.length).fill(null);
      const cards = SP.shadow.map((sent, k) => {
        const out = h('p', { class: 'shadow-out' });
        const card = h('div', { class: 'shadow-card' },
          h('p', { class: 'shadow-sent' }, sent),
          h('div', { class: 'answer-row' },
            speakBtn(sent, 'f', ' Anhören'),
            micButton({ label: 'Nachsprechen', onText: (t) => {
              const sim = similarity(t, sent);
              shadowScores[k] = Math.max(shadowScores[k] || 0, sim.score);
              S.stats.spoken++;
              fill(out, h('span', { class: 'muted small' }, `Erkannt: „${t}“ – `), h('b', {}, `${Math.round(sim.score * 100)} %`), h('br'),
                ...sim.tw.map((w, j) => h('span', { class: sim.hits[j] ? 'w-ok' : 'w-miss' }, w + ' ')));
              save();
            } })),
          out);
        return card;
      });
      const doneBtn = h('button', { class: 'btn primary', onclick: () => {
        const turns = turnScores.map((x) => x || 0);
        const tAvg = turns.reduce((a, b) => a + b, 0) / turns.length;
        const sh = shadowScores.filter((x) => x != null);
        const score = sh.length ? tAvg * 0.7 + (sh.reduce((a, b) => a + b, 0) / sh.length) * 0.3 : tAvg;
        doneBtn.remove();
        finish(score);
      } }, 'Sprechen abschließen');
      fill(stage, 
        h('h3', { class: 'section-title' }, 'Aussprache: Hören und nachsprechen'),
        h('p', { class: 'muted' }, 'Hören Sie jeden Satz an und sprechen Sie ihn nach. Wörter, die die Spracherkennung nicht verstanden hat, werden rot markiert.'),
        cards, doneBtn);
    }
  }

  // ---------- GRAMMAR ----------
  function modGrammar(lesson, body, finish) {
    const G = lesson.grammar;
    const inputs = [];
    const items = G.items.map((it) => {
      const [before, after] = it.q.split('___');
      const inp = h('input', { type: 'text', class: 'gap', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'de', 'aria-label': 'Lücke' });
      inputs.push(inp);
      const sol = h('span', { class: 'sol' });
      return { el: h('div', { class: 'gap-item' }, h('p', {}, before, inp, after), it.hint ? h('span', { class: 'gap-hint' }, it.hint) : null, sol), inp, sol, it };
    });
    const btn = h('button', { class: 'btn primary', onclick: () => {
      if (inputs.some((x) => !x.value.trim())) { toast('Bitte füllen Sie alle Lücken.'); return; }
      let right = 0;
      items.forEach(({ inp, sol, it, el }) => {
        const ok = it.a.some((a) => a.toLowerCase() === inp.value.trim().toLowerCase());
        if (ok) right++;
        inp.disabled = true;
        el.classList.add(ok ? 'is-right' : 'is-wrong');
        sol.textContent = ok ? '✓' : `→ ${it.a[0]}`;
      });
      btn.remove();
      finish(right / items.length);
    } }, 'Prüfen');
    put(body, 
      h('section', { class: 'card gram-note' }, h('h3', {}, G.title), h('p', { html: G.explain }), h('p', { class: 'ref' }, 'Mehr dazu in Ihren Büchern: ', G.ref)),
      h('p', { class: 'lead' }, 'Alle Sätze kommen aus der heutigen Szene. Ergänzen Sie die Lücken.'),
      h('div', { class: 'gaps' }, items.map((x) => x.el)), btn);
  }

  // ---------- TRACKER ----------
  function renderTracker() {
    const days = activeDays();
    const totalSec = Object.values(S.log).reduce((a, d) => a + (d.sec || 0), 0);
    const complete = LESSONS.filter((l) => lessonComplete(l.id)).length;

    const skill = MODULES.map((m) => {
      const vals = LESSONS.map((l) => (S.progress[l.id] || {})[m.key]).filter(Boolean).map((p) => p.best);
      return { m, n: vals.length, avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0 };
    });

    put(view, 
      h('section', { class: 'page-head' },
        h('p', { class: 'kicker' }, 'Fortschritt'),
        h('h1', {}, streak() ? `${streak()} ${streak() === 1 ? 'Tag' : 'Tage'} in Folge` : 'Heute ist ein guter Tag zum Anfangen'),
        h('p', { class: 'muted' }, `Sie haben an ${days.length} ${days.length === 1 ? 'Tag' : 'Tagen'} geübt, insgesamt ${Math.round(totalSec / 60)} Minuten.`)),

      h('section', { class: 'tiles' },
        stat(`${complete}/${LESSONS.length}`, 'Szenen geschafft'),
        stat(Math.round(totalSec / 60), 'Minuten geübt'),
        stat(S.stats.words, 'Wörter geschrieben'),
        stat(S.stats.spoken, 'Antworten gesprochen'),
        stat(S.stats.photos, 'Fotos analysiert')),

      h('section', { class: 'card' },
        h('h3', {}, 'Ihre Fertigkeiten'),
        h('p', { class: 'muted small' }, 'Durchschnitt Ihrer besten Ergebnisse pro Szene.'),
        h('div', { class: 'skills' }, skill.map(({ m, n, avg }) =>
          h('div', { class: 'skill', title: `${m.name}: ${n} Szenen, Ø ${Math.round(avg * 100)} %` },
            h('span', { class: 'skill-top' }, icon(m.key), h('b', {}, m.name), h('span', { class: 'skill-val' }, n ? `${Math.round(avg * 100)} %` : '–')),
            h('span', { class: 'meter' }, h('i', { style: `width:${Math.round(avg * 100)}%` })),
            h('span', { class: 'muted small' }, `${n} von ${LESSONS.length} Szenen`))))),

      h('section', { class: 'card' },
        h('h3', {}, 'Die letzten sieben Tage'),
        h('p', { class: 'muted small' }, `Minuten pro Tag. Die Linie ist Ihr Tagesziel (${S.settings.goal} Min.).`),
        weekChart()),

      h('section', { class: 'card' },
        h('h3', {}, 'Ihr Lernkalender'),
        h('p', { class: 'muted small' }, 'Die letzten 16 Wochen – je dunkler, desto länger geübt.'),
        heatmap()),

      writingsCard(),
      settingsCard());
  }
  const stat = (v, l) => h('div', { class: 'tile' }, h('b', {}, String(v)), h('span', {}, l));

  function weekChart() {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(new Date(), -i);
      data.push({ d, min: Math.round(((S.log[dayKey(d)] || {}).sec || 0) / 60) });
    }
    const max = Math.max(S.settings.goal * 1.25, ...data.map((x) => x.min), 1);
    const W = 320, H = 150, padB = 22, padT = 8, bw = 26, gap = (W - bw * 7) / 7;
    const y = (v) => padT + (H - padB - padT) * (1 - v / max);
    let svg = `<svg viewBox="0 0 ${W} ${H}" class="weekchart" role="img" aria-label="Übungsminuten der letzten sieben Tage">`;
    svg += `<line x1="0" x2="${W}" y1="${H - padB}" y2="${H - padB}" class="axis"/>`;
    data.forEach((x, i) => {
      const cx = gap / 2 + i * (bw + gap);
      const top = y(x.min);
      const hgt = H - padB - top;
      if (x.min > 0) {
        svg += `<path class="bar${x.min >= S.settings.goal ? ' met' : ''}" d="M${cx},${H - padB} V${top + 4} q0,-4 4,-4 h${bw - 8} q4,0 4,4 V${H - padB} z"><title>${WD[x.d.getDay()]}, ${x.d.getDate()}.${x.d.getMonth() + 1}.: ${x.min} Min.</title></path>`;
      }
      svg += `<rect x="${cx - gap / 2}" y="0" width="${bw + gap}" height="${H}" fill="transparent"><title>${WD[x.d.getDay()]}, ${x.d.getDate()}.${x.d.getMonth() + 1}.: ${x.min} Min.</title></rect>`;
      svg += `<text x="${cx + bw / 2}" y="${H - 6}" class="lbl">${WD[x.d.getDay()]}</text>`;
    });
    svg += `<line x1="0" x2="${W}" y1="${y(S.settings.goal)}" y2="${y(S.settings.goal)}" class="goal-line"/>`;
    svg += '</svg>';
    return h('div', { class: 'chart', html: svg });
  }

  function heatmap() {
    const weeks = 16;
    const today = new Date();
    const end = addDays(today, 6 - ((today.getDay() + 6) % 7)); // Sunday of this week
    const start = addDays(end, -(weeks * 7) + 1);
    const grid = h('div', { class: 'heat', role: 'img', 'aria-label': 'Lernkalender der letzten 16 Wochen' });
    for (let w = 0; w < weeks; w++) {
      const col = h('div', { class: 'heat-col' });
      for (let d = 0; d < 7; d++) {
        const day = addDays(start, w * 7 + d);
        const k = dayKey(day);
        const min = Math.round(((S.log[k] || {}).sec || 0) / 60);
        const acts = (S.log[k] || {}).acts ? S.log[k].acts.length : 0;
        const lvl = day > today ? -1 : !min && !acts ? 0 : min < 5 ? 1 : min < 15 ? 2 : min < 30 ? 3 : 4;
        col.append(h('span', { class: `cell l${lvl}`, title: day > today ? '' : `${day.toLocaleDateString('de-DE')}: ${min} Min., ${acts} Teile` }));
      }
      grid.append(col);
    }
    return h('div', { class: 'heat-wrap' },
      h('div', { class: 'heat-days' }, ['Mo', '', 'Mi', '', 'Fr', '', 'So'].map((x) => h('span', {}, x))),
      grid,
      h('div', { class: 'heat-legend' }, h('span', {}, 'weniger'), [0, 1, 2, 3, 4].map((l) => h('span', { class: `cell l${l}` })), h('span', {}, 'mehr')));
  }

  function writingsCard() {
    if (!S.writings.length) return null;
    return h('section', { class: 'card' },
      h('h3', {}, 'Ihre Texte'),
      h('div', { class: 'sheets' }, S.writings.slice(0, 8).map((w) => {
        const l = lessonById(w.lessonId);
        return h('details', { class: 'sheet' },
          h('summary', {}, h('b', {}, l ? l.title : w.lessonId), h('span', { class: 'muted small' }, ` ${parseDay(w.date).toLocaleDateString('de-DE')} · ${Math.round(w.score * 100)} %`)),
          h('div', { class: 'sheet-text' }, w.text));
      })));
  }

  function settingsCard() {
    const goalSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Tagesziel' }, [10, 15, 20, 30].map((g) =>
      h('button', { type: 'button', class: S.settings.goal === g ? 'on' : '', onclick: () => { S.settings.goal = g; save(); route(); } }, `${g} Min.`)));
    const rateSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Sprechtempo' }, [[0.8, 'langsam'], [0.95, 'normal'], [1.1, 'schnell']].map(([r, n]) =>
      h('button', { type: 'button', class: S.settings.rate === r ? 'on' : '', onclick: () => { S.settings.rate = r; save(); Speech.speak('So klingt dieses Tempo.', { rate: r }); route(); } }, n)));
    const importInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, onchange: async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const d = JSON.parse(await f.text());
        if (!d || typeof d !== 'object' || !d.progress) throw new Error('bad');
        S = Object.assign(defaults(), d);
        save();
        toast('Sicherung wiederhergestellt.');
        route();
      } catch (err) { toast('Diese Datei ist keine gültige Sicherung.'); }
    } });
    return h('section', { class: 'card settings' },
      h('h3', {}, 'Einstellungen'),
      h('label', { class: 'set-row' }, h('span', {}, 'Tagesziel'), goalSeg),
      h('label', { class: 'set-row' }, h('span', {}, 'Sprechtempo der Stimmen'), rateSeg),
      h('div', { class: 'set-row' },
        h('span', {}, 'Ihre Daten bleiben auf diesem Gerät.'),
        h('div', { class: 'row-btns' },
          h('button', { class: 'btn ghost', onclick: () => {
            const json = JSON.stringify(S, null, 1);
            const name = `alltag-b1-${dayKey()}.json`;
            if (window.AndroidBridge) { window.AndroidBridge.saveText(name, json); return; }
            const blob = new Blob([json], { type: 'application/json' });
            const a = h('a', { href: URL.createObjectURL(blob), download: name });
            document.body.append(a); a.click(); a.remove();
          } }, 'Sicherung speichern'),
          h('button', { class: 'btn ghost', onclick: () => importInput.click() }, 'Sicherung laden'),
          importInput)),
      h('p', { class: 'muted small' }, 'Grammatik-Verweise beziehen sich auf „Essential German Grammar“ (Durrell u. a.) und „German Grammar Drills“ (Swick).'));
  }

  // ---------- CAMERA ----------
  const PhotoDB = (() => {
    let p;
    function open() {
      if (p) return p;
      p = new Promise((res, rej) => {
        const r = indexedDB.open('alltagb1', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('photos', { keyPath: 'id' });
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      return p;
    }
    async function run(mode, fn) {
      const db = await open();
      return new Promise((res, rej) => {
        const t = db.transaction('photos', mode);
        const req = fn(t.objectStore('photos'));
        t.oncomplete = () => res(req && req.result);
        t.onerror = () => rej(t.error);
      });
    }
    return {
      all: () => run('readonly', (s) => s.getAll()),
      get: (id) => run('readonly', (s) => s.get(id)),
      put: (rec) => run('readwrite', (s) => s.put(rec)),
      del: (id) => run('readwrite', (s) => s.delete(id)),
    };
  })();
  const urls = new Map();
  const blobUrl = (rec) => {
    if (!urls.has(rec.id)) urls.set(rec.id, URL.createObjectURL(rec.blob));
    return urls.get(rec.id);
  };

  async function downscale(file, max = 1600) {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    return new Promise((res) => c.toBlob((b) => res(b || file), 'image/jpeg', 0.86));
  }

  async function addPhoto(file) {
    if (!file) return;
    toast('Foto wird vorbereitet …');
    try {
      const blob = await downscale(file);
      const id = 'p' + Date.now().toString(36);
      await PhotoDB.put({ id, blob, created: Date.now(), text: null, lang: null, response: '', ocr: 'pending' });
      S.stats.photos++;
      save();
      location.hash = `#/kamera/${id}`;
    } catch (e) {
      toast('Dieses Bild konnte nicht geöffnet werden.');
    }
  }
  $('#camInput').addEventListener('change', (e) => { addPhoto(e.target.files[0]); e.target.value = ''; });
  $('#galleryInput').addEventListener('change', (e) => { addPhoto(e.target.files[0]); e.target.value = ''; });

  async function renderCamera() {
    const album = h('div', { class: 'album' }, h('p', { class: 'muted' }, 'Lade Ihre Fotos …'));
    put(view, 
      h('section', { class: 'page-head' },
        h('p', { class: 'kicker' }, 'Kamera'),
        h('h1', {}, 'Deutsch um Sie herum'),
        h('p', { class: 'muted' }, 'Fotografieren Sie Schilder, Briefe, Etiketten oder ganze Situationen. Die App erkennt den Text, liest Deutsch vor, erklärt Wörter und macht aus jedem Foto eine kleine Übung. Englische Texte übersetzen Sie selbst ins Deutsche.')),
      h('div', { class: 'cam-actions' },
        h('button', { class: 'btn primary big', onclick: () => $('#camInput').click() }, icon('camera'), ' Foto aufnehmen'),
        h('button', { class: 'btn ghost big', onclick: () => $('#galleryInput').click() }, icon('image'), ' Bild auswählen')),
      h('h3', { class: 'section-title' }, 'Ihr Fotoalbum'),
      album);
    try {
      const all = (await PhotoDB.all()).sort((a, b) => b.created - a.created);
      if (!all.length) {
        fill(album, h('div', { class: 'empty' }, h('p', {}, 'Noch keine Fotos. Ihr erstes Foto könnte das Schild an Ihrer Haltestelle sein – oder der Aushang in Ihrem Treppenhaus.')));
        return;
      }
      fill(album, ...all.map((p) => h('a', { class: 'polaroid', href: `#/kamera/${p.id}` },
        h('img', { src: blobUrl(p), alt: '' }),
        h('span', { class: 'pol-cap' }, p.text ? p.text.slice(0, 40).replace(/\s+/g, ' ') : p.lang === 'none' ? 'Bildbeschreibung' : 'Foto'),
        h('span', { class: 'pol-tag ' + (p.response ? 'done' : '') }, p.response ? 'geübt' : LANG_LABEL[p.lang] || 'neu'))));
    } catch (e) {
      fill(album, h('p', { class: 'warn' }, 'Das Fotoalbum ist in diesem Browser-Modus nicht verfügbar.'));
    }
  }

  const LANG_LABEL = { de: 'Deutsch', en: 'Englisch', none: 'Situation' };
  function detectLang(text) {
    const t = ' ' + (text || '').toLowerCase().replace(/[^a-zäöüß\s]/g, ' ') + ' ';
    const de = (t.match(/ (der|die|das|und|ist|nicht|ein|eine|mit|für|auf|ich|sie|zu|den|von|bitte|im|wir|sind|bei|oder|nur|ab|uhr|zum|zur) /g) || []).length + (t.match(/[äöüß]/g) || []).length * 0.5;
    const en = (t.match(/ (the|and|is|are|of|to|you|for|with|this|not|please|your|we|in|on|at|or|only|from|by|be|it|our) /g) || []).length;
    if (words(text || '').length < 2) return 'none';
    return de >= en ? 'de' : 'en';
  }

  // Tesseract.js is loaded on demand from a CDN (needs internet the first time).
  let ocrWorker = null;
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = () => rej(new Error('load'));
      document.head.append(s);
    });
  }
  async function recognise(blob, onProgress) {
    if (!window.Tesseract) await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js');
    if (!ocrWorker) {
      ocrWorker = await window.Tesseract.createWorker(['deu', 'eng'], 1, {
        logger: (m) => { if (m.status === 'recognizing text') onProgress && onProgress(m.progress); },
      });
    }
    const { data } = await ocrWorker.recognize(blob);
    return (data.text || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  // Small built-in dictionary: every glossed word from the lessons plus words you meet on signs.
  const SIGN_DICT = {
    ausgang: 'exit', eingang: 'entrance', notausgang: 'emergency exit', drücken: 'push', ziehen: 'pull', geöffnet: 'open', geschlossen: 'closed',
    öffnungszeiten: 'opening hours', ruhetag: 'closing day', kasse: 'checkout', pfand: 'deposit (on bottles)', angebot: 'special offer', sonderangebot: 'special offer',
    gleis: 'platform/track', abfahrt: 'departure', ankunft: 'arrival', verspätung: 'delay', ausfall: 'cancellation', fällt: 'is cancelled (fällt aus)', haltestelle: 'stop',
    umleitung: 'diversion', baustelle: 'construction site', achtung: 'attention', vorsicht: 'caution', rauchen: 'smoking', verboten: 'forbidden', gestattet: 'permitted',
    zutritt: 'access', unbefugte: 'unauthorised persons', privat: 'private', einfahrt: 'driveway', freihalten: 'keep clear', parken: 'parking', anwohner: 'residents',
    lieferung: 'delivery', abholung: 'pick-up', briefkasten: 'mailbox', müll: 'rubbish', restmüll: 'general waste', biomüll: 'organic waste', papier: 'paper', glas: 'glass',
    gelbe: 'yellow (Gelber Sack = packaging)', hausordnung: 'house rules', treppenhaus: 'stairwell', keller: 'cellar', aufzug: 'lift', außer: 'out of', betrieb: 'operation',
    zutaten: 'ingredients', enthält: 'contains', haltbar: 'best before', mindestens: 'at least', kühl: 'cool', lagern: 'store', vegan: 'vegan', bio: 'organic',
    preis: 'price', stück: 'piece', rabatt: 'discount', reduziert: 'reduced', ermäßigt: 'reduced fare', fahrkarte: 'ticket', entwerten: 'validate', gültig: 'valid',
    ausverkauft: 'sold out', geschäftsführung: 'management', mitarbeiter: 'staff', toilette: 'toilet', herren: 'men', damen: 'women', bitte: 'please', danke: 'thank you',
    termin: 'appointment', rechnung: 'invoice/bill', mahnung: 'reminder (payment)', frist: 'deadline', kündigung: 'cancellation/notice', vertrag: 'contract',
    nebenkosten: 'service charges', kaution: 'deposit', miete: 'rent', anmeldung: 'registration / reception', wartezimmer: 'waiting room', sprechzeiten: 'consulting hours',
    apotheke: 'pharmacy', notdienst: 'emergency service', feuerwehr: 'fire brigade', polizei: 'police', krankenhaus: 'hospital', fahrrad: 'bicycle', abstellen: 'to park/leave',
    hunde: 'dogs', leine: 'lead/leash', spielplatz: 'playground', ruhe: 'quiet', nachtruhe: 'night-time quiet hours', tür: 'door', schließen: 'to close', halten: 'to keep/stop',
  };
  let DICT = null;
  function dict() {
    if (DICT) return DICT;
    DICT = Object.assign({}, SIGN_DICT);
    LESSONS.forEach((l) => {
      for (const m of l.reading.text.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)) DICT[m[1].toLowerCase()] = m[2];
    });
    return DICT;
  }
  function lookup(word) {
    const d = dict();
    const w = word.toLowerCase();
    if (d[w]) return d[w];
    for (const suf of ['en', 'n', 'e', 'es', 's', 'er', 'em']) {
      if (w.endsWith(suf) && d[w.slice(0, -suf.length)]) return d[w.slice(0, -suf.length)];
    }
    return null;
  }
  const translateUrl = (text, from, to) => `https://www.deepl.com/translator#${from}/${to}/${encodeURIComponent(text.slice(0, 1500))}`;

  const DESCRIBE_PROMPTS = [
    'Wo ist das? Beschreiben Sie den Ort.',
    'Wer oder was ist auf dem Bild zu sehen?',
    'Was passiert gerade – und was ist vielleicht vorher passiert?',
    'Wie würden Sie sich in dieser Situation fühlen oder verhalten?',
    'Gibt es so eine Situation auch in Ihrem Heimatland? Was ist anders?',
  ];
  const REDEMITTEL = ['Auf dem Foto sieht man …', 'Im Vordergrund …', 'Im Hintergrund …', 'Es sieht so aus, als ob …', 'Ich vermute, dass …', 'Wahrscheinlich …', 'Mir fällt auf, dass …', 'In meinem Heimatland …'];

  async function renderPhoto(id) {
    let rec;
    try { rec = await PhotoDB.get(id); } catch (e) { rec = null; }
    if (!rec) { put(view, backLink('#/kamera', 'Fotoalbum'), h('p', { class: 'warn' }, 'Dieses Foto gibt es nicht mehr.')); return; }

    const textBox = h('textarea', { class: 'ocr-text', rows: 5, lang: 'de', placeholder: 'Hier erscheint der erkannte Text. Sie können ihn korrigieren oder selbst eintippen.' });
    const status = h('p', { class: 'ocr-status muted small' });
    const langSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Was ist auf dem Foto?' });
    const work = h('div', { class: 'photo-work' });

    const persist = () => PhotoDB.put(rec).catch(() => {});
    function setLang(lang) {
      rec.lang = lang;
      fill(langSeg, ...[['de', 'Deutscher Text'], ['en', 'Englischer Text'], ['none', 'Situation']].map(([k, n]) =>
        h('button', { type: 'button', class: rec.lang === k ? 'on' : '', onclick: () => { setLang(k); persist(); } }, n)));
      renderWork();
    }
    textBox.addEventListener('input', () => { rec.text = textBox.value; persist(); });
    textBox.addEventListener('change', () => { if (rec.lang !== 'none') renderWork(); });

    function responseArea(placeholder, withMic) {
      const ta = h('textarea', { class: 'paper-input', rows: 6, lang: 'de', placeholder });
      ta.value = rec.response || '';
      const wc = h('span', { class: 'wc' });
      const upd = () => { wc.textContent = `${words(ta.value).length} Wörter`; };
      ta.addEventListener('input', upd); upd();
      const saveBtn = h('button', { class: 'btn primary', onclick: async () => {
        const n = words(ta.value).length;
        if (n < 5) { toast('Schreiben oder sprechen Sie bitte etwas mehr.'); return; }
        const first = !rec.response;
        const prevWords = words(rec.response || '').length;
        rec.response = ta.value;
        await persist();
        S.stats.words += Math.max(0, n - prevWords);
        if (first) { S.stats.camTasks++; todayLog().acts.push({ l: 'kamera', m: rec.lang === 'none' ? 'sprechen' : 'schreiben', s: 1 }); }
        save(); updateStreakChip();
        toast('Gespeichert. Gut gemacht!');
      } }, 'Speichern');
      const chips = withMic ? h('div', { class: 'chips' }, REDEMITTEL.map((r) => h('button', { type: 'button', class: 'chip-btn', onclick: () => {
        ta.value += (ta.value && !/\s$/.test(ta.value) ? ' ' : '') + r.replace(' …', ' ');
        ta.focus(); upd();
      } }, r))) : null;
      return [chips,
        h('div', { class: 'paper' }, ta, wc),
        h('div', { class: 'answer-row' },
          withMic ? micButton({ label: 'Diktieren', onText: (t) => { ta.value += (ta.value ? ' ' : '') + t + '.'; upd(); S.stats.spoken++; save(); } }) : null,
          saveBtn)];
    }

    function renderWork() {
      const text = (rec.text || '').trim();
      if (rec.lang === 'de') {
        const words_ = h('div', { class: 'tapwords', lang: 'de' });
        text.split(/(\s+)/).forEach((tok) => {
          const w = (tok.match(/[A-Za-zÄÖÜäöüß-]+/) || [])[0];
          if (!w) { words_.append(tok); return; }
          words_.append(h('button', { type: 'button', class: 'word', onclick: (e) => {
            const g = lookup(w);
            showPopover(e.currentTarget, [h('b', {}, w), ' – ', g || 'nicht im eingebauten Wörterbuch', ' ', speakBtn(w), h('br'),
              h('a', { href: translateUrl(w, 'de', 'en'), target: '_blank', rel: 'noopener' }, 'In DeepL nachschlagen ↗')]);
          } }, tok));
        });
        fill(work, 
          h('div', { class: 'task-card' },
            h('p', { class: 'kicker' }, 'Verstehen'),
            h('p', {}, 'Tippen Sie auf Wörter, die Sie nicht kennen. Hören Sie sich den Text an und sprechen Sie ihn nach.'),
            text ? words_ : h('p', { class: 'muted' }, 'Noch kein Text.'),
            h('div', { class: 'row-btns' },
              text ? speakBtn(text, 'f', ' Vorlesen') : null,
              text ? h('a', { class: 'btn ghost', href: translateUrl(text, 'de', 'en'), target: '_blank', rel: 'noopener' }, 'Übersetzung prüfen ↗') : null)),
          h('div', { class: 'task-card' },
            h('p', { class: 'kicker' }, 'Ihre Aufgabe'),
            h('p', { class: 'task' }, 'Eine Freundin ist neu in Deutschland und fragt Sie: „Was steht da? Was muss ich tun?“ Erklären Sie es ihr auf Deutsch in zwei bis vier Sätzen – mit eigenen Worten.')),
          ...responseArea('Hier steht, dass …', true));
      } else if (rec.lang === 'en') {
        fill(work, 
          h('div', { class: 'task-card' },
            h('p', { class: 'kicker' }, 'Ihre Aufgabe'),
            h('p', { class: 'task' }, 'Übersetzen Sie den englischen Text ins Deutsche. Achten Sie auf die Wortstellung – das Verb steht auf Position 2, im Nebensatz am Ende.'),
            h('blockquote', { class: 'source', lang: 'en' }, text || 'Noch kein Text.')),
          ...responseArea('Ihre Übersetzung …', false),
          text ? h('a', { class: 'btn ghost', href: translateUrl(text, 'en', 'de'), target: '_blank', rel: 'noopener' }, 'Mit DeepL vergleichen ↗') : null);
      } else {
        fill(work, 
          h('div', { class: 'task-card' },
            h('p', { class: 'kicker' }, 'Bildbeschreibung'),
            h('p', { class: 'task' }, 'Beschreiben Sie das Foto, als würden Sie es jemandem am Telefon erklären. Sprechen Sie oder schreiben Sie etwa eine Minute lang.'),
            h('div', { class: 'prompts' }, DESCRIBE_PROMPTS.map((p, i) => h('span', { class: 'prompt' }, h('i', {}, i + 1), p)))),
          ...responseArea('Auf dem Foto sieht man …', true));
      }
    }

    put(view, 
      backLink('#/kamera', 'Fotoalbum'),
      h('div', { class: 'photo-hero' }, h('img', { src: blobUrl(rec), alt: 'Ihr Foto' })),
      h('section', { class: 'card' },
        h('h3', {}, 'Was ist auf dem Foto?'),
        langSeg, status, textBox),
      work,
      h('button', { class: 'btn ghost danger', onclick: async () => {
        if (!confirm('Dieses Foto löschen?')) return;
        await PhotoDB.del(rec.id);
        location.hash = '#/kamera';
      } }, 'Foto löschen'));

    textBox.value = rec.text || '';
    setLang(rec.lang || 'none');

    if (rec.ocr === 'pending') {
      status.textContent = 'Texterkennung läuft … (beim ersten Mal werden die Sprachdaten geladen)';
      try {
        const text = await recognise(rec.blob, (p) => { status.textContent = `Texterkennung … ${Math.round(p * 100)} %`; });
        rec.text = text;
        rec.ocr = 'done';
        rec.lang = detectLang(text);
        textBox.value = text;
        status.textContent = text ? `Erkannt als: ${LANG_LABEL[rec.lang]}. Stimmt das nicht? Wählen Sie oben aus.` : 'Kein Text gefunden – beschreiben Sie die Situation.';
        await persist();
        if (location.hash === `#/kamera/${rec.id}`) setLang(rec.lang);
      } catch (e) {
        rec.ocr = 'failed';
        await persist();
        status.textContent = 'Die Texterkennung braucht beim ersten Mal eine Internetverbindung. Tippen Sie den Text ab oder wählen Sie „Situation“.';
      }
    } else if (rec.ocr === 'failed') {
      status.append('Keine automatische Texterkennung. ', h('button', { type: 'button', class: 'link', onclick: () => { rec.ocr = 'pending'; persist().then(route); } }, 'Erneut versuchen'));
    }
  }

  // ---------- boot ----------
  updateStreakChip();
  route();

  if ('serviceWorker' in navigator && location.protocol !== 'file:' && !window.AndroidBridge) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
