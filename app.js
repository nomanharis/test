(() => {
  'use strict';

  // ---------- helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const today = () => new Date().toISOString().slice(0, 10);

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  const DIVIDER_COLORS = ['#c0533a', '#2f6f9f', '#d39b2a', '#4f8a3c', '#7a4f9a', '#2a8a80', '#b2476f', '#8a6a3f'];
  // Each section gets its own divider slot, in alphabetical order, so colours never clash.
  function sectionSlot(name) {
    if (!name) return -1;
    const sections = [...new Set(state.entries.map((e) => e.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return sections.indexOf(name);
  }
  function sectionColor(name) {
    const i = sectionSlot(name);
    return i < 0 ? '#9a8f80' : DIVIDER_COLORS[i % DIVIDER_COLORS.length];
  }

  function fileIcon(type) {
    if (type === 'application/pdf') return 'PDF';
    if (type.startsWith('image/')) return 'IMG';
    if (type.startsWith('text/')) return 'TXT';
    if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'XLS';
    if (type.includes('word') || type.includes('document')) return 'DOC';
    return 'FILE';
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  // ---------- object URL cache for attachments ----------
  const urlCache = new Map();
  async function attachmentUrl(id) {
    if (urlCache.has(id)) return urlCache.get(id);
    const rec = await DB.getFile(id);
    if (!rec) return null;
    const url = URL.createObjectURL(rec.blob);
    urlCache.set(id, url);
    return url;
  }
  function forgetUrl(id) {
    const url = urlCache.get(id);
    if (url) URL.revokeObjectURL(url);
    urlCache.delete(id);
  }

  // ---------- state ----------
  const state = {
    entries: [],
    page: 0,
    query: '',
    animating: false,
    name: localStorage.getItem('boxfile.name') || 'My Documents',
  };

  function sortedEntries() {
    return [...state.entries].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.created - a.created);
  }

  function matches(entry, q) {
    if (!q) return true;
    const hay = [entry.title, entry.category, entry.notes, ...(entry.attachments || []).map((a) => a.name)]
      .join(' ')
      .toLowerCase();
    return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  }

  function pages() {
    const list = sortedEntries().filter((e) => matches(e, state.query));
    return [{ type: 'contents', list }, ...list.map((entry) => ({ type: 'entry', entry })), { type: 'blank' }];
  }

  // ---------- page rendering ----------
  const stack = $('#stack');

  function sheet(page, index, total) {
    const front = h('div', { class: 'face front' });
    const paper = h('div', { class: 'paper' });
    front.append(paper);

    if (page.type === 'contents') renderContents(paper, page.list);
    else if (page.type === 'entry') renderEntry(front, paper, page.entry);
    else renderBlank(paper);

    if (index > 0) paper.append(h('div', { class: 'page-number' }, `— ${index} —`));
    if (index < total - 1) {
      front.append(h('button', { class: 'dog-ear', title: 'Turn page', 'aria-label': 'Turn page', onclick: next }));
    }

    const back = h('div', { class: 'face back' });
    return h('div', { class: 'sheet', 'data-type': page.type }, front, back);
  }

  function renderContents(paper, list) {
    paper.append(
      h('div', { class: 'contents-head' },
        h('span', { class: 'stamp' }, 'Index'),
        h('h2', {}, state.name),
        h('p', { class: 'muted' }, state.query
          ? `${list.length} match${list.length === 1 ? '' : 'es'} for “${state.query}”`
          : `${list.length} ${list.length === 1 ? 'entry' : 'entries'} on file`)
      )
    );

    if (!list.length) {
      paper.append(
        h('div', { class: 'empty' },
          h('p', {}, state.query ? 'Nothing in the box matches that search.' : 'This box file is empty.'),
          !state.query && h('button', { class: 'ink-btn', onclick: () => openEditor() }, 'File your first document')
        )
      );
      return;
    }

    // group by section, keep page numbers from the sorted order
    const groups = new Map();
    list.forEach((e, i) => {
      const key = e.category || 'Unsorted';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ e, pageNo: i + 1 });
    });

    const toc = h('div', { class: 'toc' });
    for (const [section, items] of [...groups].sort((a, b) => a[0].localeCompare(b[0]))) {
      toc.append(
        h('h3', { class: 'toc-section' },
          h('span', { class: 'dot', style: `background:${sectionColor(section === 'Unsorted' ? '' : section)}` }),
          section),
        h('ol', {},
          items.map(({ e, pageNo }) =>
            h('li', {},
              h('button', { class: 'toc-row', onclick: () => goTo(pageNo) },
                h('span', { class: 'toc-title' }, e.title),
                h('span', { class: 'toc-leader' }),
                h('span', { class: 'toc-date' }, formatDate(e.date)),
                h('span', { class: 'toc-page' }, pageNo)
              )
            )
          )
        )
      );
    }
    paper.append(toc);
  }

  function renderEntry(front, paper, entry) {
    const color = sectionColor(entry.category);
    // stagger tabs down the edge like real index dividers
    const slot = Math.max(0, sectionSlot(entry.category)) % 5;
    front.append(h('div', { class: 'divider-tab', style: `--tab:${color};--slot:${slot}` }, entry.category || 'Unsorted'));

    paper.append(
      h('div', { class: 'entry-head' },
        h('div', { class: 'entry-meta' },
          h('span', { class: 'entry-date' }, formatDate(entry.date)),
          h('button', { class: 'edit-btn', title: 'Edit entry', onclick: () => openEditor(entry) }, '✎ Edit')
        ),
        h('h2', { class: 'entry-title' }, entry.title)
      )
    );

    if (entry.notes) paper.append(h('div', { class: 'entry-notes' }, entry.notes));

    const atts = entry.attachments || [];
    const images = atts.filter((a) => a.type.startsWith('image/'));
    const others = atts.filter((a) => !a.type.startsWith('image/'));

    if (images.length) {
      const grid = h('div', { class: 'photo-grid' });
      for (const a of images) {
        const img = h('img', { alt: a.name, loading: 'lazy' });
        const fig = h('button', { class: 'photo', title: a.name, onclick: () => openViewer(a) }, img);
        attachmentUrl(a.id).then((url) => url && (img.src = url));
        grid.append(fig);
      }
      paper.append(grid);
    }

    if (others.length) {
      const ul = h('ul', { class: 'file-list' });
      for (const a of others) {
        const link = h('a', { class: 'file', target: '_blank', rel: 'noopener', download: a.name },
          h('span', { class: 'file-icon' }, fileIcon(a.type)),
          h('span', { class: 'file-name' }, a.name),
          h('span', { class: 'file-size' }, formatSize(a.size))
        );
        attachmentUrl(a.id).then((url) => {
          if (!url) return;
          link.href = url;
          // PDFs and text open in a new tab; everything else downloads
          if (a.type === 'application/pdf' || a.type.startsWith('text/')) link.removeAttribute('download');
        });
        ul.append(h('li', {}, link));
      }
      paper.append(ul);
    }

    if (!entry.notes && !atts.length) paper.append(h('p', { class: 'muted' }, 'No notes or attachments yet.'));
  }

  function renderBlank(paper) {
    paper.append(
      h('div', { class: 'empty blank' },
        h('p', {}, 'A fresh sheet.'),
        h('button', { class: 'ink-btn', onclick: () => openEditor() }, 'Add an entry')
      )
    );
  }

  function render() {
    const all = pages();
    state.page = Math.max(0, Math.min(state.page, all.length - 1));
    stack.replaceChildren();

    const under = all[state.page + 1];
    if (under) {
      const s = sheet(under, state.page + 1, all.length);
      s.classList.add('under');
      stack.append(s);
    }
    stack.append(sheet(all[state.page], state.page, all.length));

    const remaining = all.length - 1 - state.page;
    $('#stackDepth').style.setProperty('--depth', Math.min(remaining, 8));

    const cur = all[state.page];
    $('#pageIndicator').textContent =
      cur.type === 'contents' ? 'Contents' : cur.type === 'blank' ? 'Blank sheet' : `Page ${state.page} of ${all.length - 2}`;
    $('#prevBtn').disabled = state.page === 0;
    $('#nextBtn').disabled = state.page >= all.length - 1;

    updateCover();
  }

  function updateCover() {
    $('#coverTitle').textContent = state.name;
    const n = state.entries.length;
    $('#coverMeta').textContent = `${n} ${n === 1 ? 'entry' : 'entries'}`;
    document.title = `${state.name} · Box File`;
  }

  // ---------- page turning ----------
  function afterAnimation(el, cb) {
    if (reducedMotion) return cb();
    let done = false;
    const finish = () => { if (!done) { done = true; cb(); } };
    el.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 1200); // safety net
  }

  function next() {
    const all = pages();
    if (state.animating || state.page >= all.length - 1) return;
    state.animating = true;
    const top = stack.lastElementChild;
    top.classList.remove('riffle');
    top.classList.add('flip-up');
    playRustle();
    afterAnimation(top, () => {
      state.page++;
      state.animating = false;
      render();
    });
  }

  function prev() {
    if (state.animating || state.page <= 0) return;
    state.animating = true;
    const all = pages();
    // current top becomes the under-sheet; the previous page drops back down over it
    stack.querySelector('.under')?.remove();
    stack.lastElementChild.classList.remove('riffle');
    stack.lastElementChild.classList.add('under');
    const s = sheet(all[state.page - 1], state.page - 1, all.length);
    s.classList.add('flip-down');
    stack.append(s);
    playRustle();
    afterAnimation(s, () => {
      state.page--;
      state.animating = false;
      render();
    });
  }

  function goTo(index) {
    if (state.animating || index === state.page) return;
    state.page = index;
    render();
    if (!reducedMotion) {
      const top = stack.lastElementChild;
      top.classList.add('riffle');
      top.addEventListener('animationend', () => top.classList.remove('riffle'), { once: true });
    }
  }

  // A soft paper sound synthesised with WebAudio (no assets needed).
  let audioCtx;
  function playRustle() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const dur = 0.35;
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / data.length;
        data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * (0.6 + 0.4 * Math.random()) * 0.25;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 0.7;
      src.connect(filter).connect(audioCtx.destination);
      src.start();
    } catch { /* audio is optional */ }
  }

  // ---------- open / close the box ----------
  const scene = $('#scene');

  function openBox() {
    if (!scene.classList.contains('is-closed')) return;
    scene.classList.add('is-opening');
    const finish = () => {
      scene.classList.remove('is-closed', 'is-opening');
      $('#cover').hidden = true;
      $('#openBox').hidden = false;
      state.page = 0;
      render();
    };
    if (reducedMotion) finish();
    else setTimeout(finish, 650);
  }

  function closeBox() {
    $('#openBox').hidden = true;
    $('#cover').hidden = false;
    scene.classList.add('is-closed', 'is-closing');
    setTimeout(() => scene.classList.remove('is-closing'), 650);
  }

  // ---------- editor ----------
  const editor = $('#editor');
  const form = $('#editorForm');
  let editing = null;
  let removedAttachments = new Set();

  function openEditor(entry = null) {
    editing = entry;
    removedAttachments = new Set();
    form.reset();
    $('#editorTitle').textContent = entry ? 'Edit entry' : 'New entry';
    form.elements.title.value = entry?.title || '';
    form.elements.date.value = entry?.date || today();
    form.elements.category.value = entry?.category || '';
    form.elements.notes.value = entry?.notes || '';
    $('#deleteEntryBtn').hidden = !entry;

    const cats = [...new Set(state.entries.map((e) => e.category).filter(Boolean))].sort();
    $('#categoryList').replaceChildren(...cats.map((c) => h('option', { value: c })));

    const list = $('#attachEdit');
    list.replaceChildren(
      ...(entry?.attachments || []).map((a) => {
        const li = h('li', {},
          h('span', { class: 'file-icon' }, fileIcon(a.type)),
          h('span', { class: 'file-name' }, a.name),
          h('button', {
            type: 'button', class: 'link',
            onclick: (ev) => {
              const removed = li.classList.toggle('removed');
              removed ? removedAttachments.add(a.id) : removedAttachments.delete(a.id);
              ev.target.textContent = removed ? 'Undo' : 'Remove';
            },
          }, 'Remove')
        );
        return li;
      })
    );

    editor.showModal();
    setTimeout(() => form.elements.title.focus(), 30);
  }

  async function saveEditor() {
    const now = Date.now();
    const entry = editing
      ? { ...editing, attachments: [...(editing.attachments || [])] }
      : { id: uid(), created: now, attachments: [] };

    entry.title = form.elements.title.value.trim();
    entry.date = form.elements.date.value;
    entry.category = form.elements.category.value.trim();
    entry.notes = form.elements.notes.value.trim();
    entry.updated = now;

    for (const id of removedAttachments) {
      await DB.deleteFile(id);
      forgetUrl(id);
    }
    entry.attachments = entry.attachments.filter((a) => !removedAttachments.has(a.id));

    for (const file of form.elements.files.files) {
      const id = uid();
      await DB.putFile(id, file);
      entry.attachments.push({ id, name: file.name, type: file.type || 'application/octet-stream', size: file.size });
    }

    await DB.putEntry(entry);
    await reload();

    // jump to the saved entry
    state.query = '';
    $('#searchInput').value = '';
    const idx = pages().findIndex((p) => p.type === 'entry' && p.entry.id === entry.id);
    state.page = idx;
    render();
    toast(editing ? 'Entry updated' : 'Filed away');
  }

  async function deleteCurrent() {
    if (!editing) return;
    if (!confirm(`Remove “${editing.title}” from the box file? This cannot be undone.`)) return;
    for (const a of editing.attachments || []) {
      await DB.deleteFile(a.id);
      forgetUrl(a.id);
    }
    await DB.deleteEntry(editing.id);
    editor.close();
    await reload();
    render();
    toast('Entry removed');
  }

  // ---------- image viewer ----------
  async function openViewer(a) {
    const url = await attachmentUrl(a.id);
    if (!url) return;
    $('#viewerImg').src = url;
    $('#viewerImg').alt = a.name;
    $('#viewer').showModal();
  }

  // ---------- backup ----------
  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });

  async function exportBackup() {
    const files = {};
    for (const e of state.entries) {
      for (const a of e.attachments || []) {
        const rec = await DB.getFile(a.id);
        if (rec) files[a.id] = await blobToDataUrl(rec.blob);
      }
    }
    const data = { app: 'boxfile', version: 1, name: state.name, exported: new Date().toISOString(), entries: state.entries, files };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `${state.name.replace(/[^\w-]+/g, '_')}-${today()}.json` });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Backup downloaded');
  }

  async function importBackup(file) {
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'boxfile' || !Array.isArray(data.entries)) throw new Error('Not a Box File backup');
      for (const [id, dataUrl] of Object.entries(data.files || {})) {
        const blob = await (await fetch(dataUrl)).blob();
        await DB.putFile(id, blob);
        forgetUrl(id);
      }
      for (const e of data.entries) await DB.putEntry(e);
      await reload();
      render();
      toast(`Imported ${data.entries.length} entries`);
    } catch (err) {
      toast('Import failed: ' + err.message);
    }
  }

  async function reload() {
    state.entries = await DB.allEntries();
  }

  // ---------- wiring ----------
  $('#openBtn').addEventListener('click', openBox);
  $('#cover').addEventListener('click', (e) => { if (e.target.closest('.cover-face')) openBox(); });
  $('#closeBtn').addEventListener('click', closeBox);
  $('#contentsBtn').addEventListener('click', () => goTo(0));
  $('#addBtn').addEventListener('click', () => openEditor());
  $('#prevBtn').addEventListener('click', prev);
  $('#nextBtn').addEventListener('click', next);

  let searchTimer;
  $('#searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = e.target.value.trim();
      state.page = 0;
      render();
    }, 150);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      await saveEditor();
      editor.close();
    } catch (err) {
      toast('Could not save: ' + err.message);
    } finally {
      btn.disabled = false;
    }
  });
  $('#cancelEdit').addEventListener('click', () => editor.close());
  $('#deleteEntryBtn').addEventListener('click', deleteCurrent);

  $('#viewerClose').addEventListener('click', () => $('#viewer').close());
  $('#viewer').addEventListener('click', (e) => { if (e.target.id === 'viewer') $('#viewer').close(); });

  const menu = document.querySelector('.menu');
  $('#renameBtn').addEventListener('click', () => {
    menu.open = false;
    const name = prompt('Name this box file', state.name);
    if (name && name.trim()) {
      state.name = name.trim().slice(0, 40);
      localStorage.setItem('boxfile.name', state.name);
      render();
    }
  });
  $('#exportBtn').addEventListener('click', () => { menu.open = false; exportBackup(); });
  $('#importInput').addEventListener('change', (e) => {
    menu.open = false;
    const f = e.target.files[0];
    if (f) importBackup(f);
    e.target.value = '';
  });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) menu.open = false; });

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (document.querySelector('dialog[open]')) return;
    if (e.target.matches('input, textarea')) return;
    if (scene.classList.contains('is-closed')) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(); }
      return;
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') goTo(0);
    else if (e.key === 'n' || e.key === 'N') openEditor();
    else if (e.key === '/') { e.preventDefault(); $('#searchInput').focus(); }
  });

  // swipe: left = next page, right = previous page
  let touchStart = null;
  stack.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    touchStart = { x: e.clientX, y: e.clientY, t: Date.now() };
  });
  stack.addEventListener('pointerup', (e) => {
    if (!touchStart) return;
    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    const fast = Date.now() - touchStart.t < 600;
    touchStart = null;
    if (fast && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
  });
  stack.addEventListener('pointercancel', () => { touchStart = null; });

  // ---------- installable offline app ----------
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Offline mode unavailable:', err));
    });
  }

  // Android / desktop Chrome offer an install prompt; iOS uses Share → Add to Home Screen.
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
    $('#installBtn').hidden = false;
  });
  $('#installBtn').addEventListener('click', async () => {
    menu.open = false;
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    $('#installBtn').hidden = true;
  });
  window.addEventListener('appinstalled', () => toast('Box File installed'));

  // ---------- boot ----------
  (async () => {
    try {
      await reload();
    } catch (err) {
      toast('Storage unavailable: ' + err.message);
    }
    updateCover();
    // Ask the browser not to evict the box when the phone runs low on space.
    navigator.storage?.persist?.().catch(() => {});
  })();
})();
