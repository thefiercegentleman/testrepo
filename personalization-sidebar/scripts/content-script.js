(() => {
  const ROOT_ID = 'personalization-notes-sidebar-root';
  const STORAGE_KEYS = {
    NOTES: 'notes',
    UI_STATE: 'uiState'
  };

  if (document.getElementById(ROOT_ID)) {
    return;
  }

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.style.all = 'initial';
  root.style.position = 'fixed';
  root.style.zIndex = '2147483646';
  root.style.top = '0';
  root.style.left = '0';
  root.style.height = '100%';
  root.style.width = 'auto';
  root.style.pointerEvents = 'auto';

  const shadow = root.attachShadow({ mode: 'open' });
  document.documentElement.appendChild(root);

  const styles = document.createElement('style');
  styles.textContent = `
    :host {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      color: #101828;
    }

    .container {
      position: relative;
      width: 320px;
      height: 100vh;
      pointer-events: auto;
      transition: transform 0.25s ease-in-out;
      transform: translateX(-270px);
    }

    .container.expanded {
      transform: translateX(0);
    }

    .panel {
      background: #ffffff;
      border-right: 1px solid rgba(16, 24, 40, 0.1);
      box-shadow: 2px 0 12px rgba(15, 23, 42, 0.12);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    header {
      padding: 16px 16px 8px;
      border-bottom: 1px solid rgba(16, 24, 40, 0.1);
    }

    header h1 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px;
    }

    header p {
      margin: 0;
      color: #475467;
      font-size: 13px;
    }

    .toggle {
      position: absolute;
      right: -44px;
      top: 32px;
      width: 44px;
      height: 120px;
      background: #1d4ed8;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      cursor: pointer;
      box-shadow: 2px 0 8px rgba(15, 23, 42, 0.2);
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .toggle span {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 12px;
    }

    form {
      padding: 16px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-weight: 500;
      color: #344054;
    }

    input[type="email"],
    textarea {
      width: 100%;
      border: 1px solid rgba(16, 24, 40, 0.16);
      border-radius: 6px;
      padding: 8px 10px;
      font-family: inherit;
      font-size: 14px;
      color: inherit;
      box-sizing: border-box;
    }

    textarea {
      min-height: 140px;
      resize: vertical;
      line-height: 1.4;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .chip {
      padding: 4px 8px;
      border-radius: 12px;
      background: rgba(29, 78, 216, 0.1);
      color: #1d4ed8;
      cursor: pointer;
      font-size: 12px;
    }

    .chip.active {
      background: #1d4ed8;
      color: #ffffff;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .actions button {
      flex: 1;
      border: none;
      border-radius: 6px;
      padding: 10px 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .primary {
      background: #1d4ed8;
      color: #ffffff;
    }

    .secondary {
      background: #e2e8f0;
      color: #1e293b;
    }

    .danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    .status {
      font-size: 12px;
      color: #475467;
      min-height: 18px;
    }

    .empty-state {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }

    .footer {
      padding: 12px 16px;
      border-top: 1px solid rgba(16, 24, 40, 0.1);
      font-size: 12px;
      color: #64748b;
      background: #f8fafc;
    }

    .footer button {
      border: none;
      background: transparent;
      color: #1d4ed8;
      cursor: pointer;
      font-weight: 600;
      padding: 0;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      background: rgba(29, 78, 216, 0.08);
      color: #1d4ed8;
      border-radius: 999px;
      padding: 4px 10px;
    }

    .detected-title {
      font-size: 12px;
      color: #475467;
      margin: 0;
      font-weight: 500;
    }

    .muted {
      color: #94a3b8;
    }
  `;

  shadow.appendChild(styles);

  const container = document.createElement('div');
  container.className = 'container';

  const toggle = document.createElement('div');
  toggle.className = 'toggle';
  toggle.innerHTML = '<span>Notes</span>';
  container.appendChild(toggle);

  const panel = document.createElement('div');
  panel.className = 'panel';
  container.appendChild(panel);

  const header = document.createElement('header');
  header.innerHTML = `
    <h1>Personalization Notes</h1>
    <p>Detected emails & quick notes for outreach.</p>
  `;
  panel.appendChild(header);

  const form = document.createElement('form');
  panel.appendChild(form);

  const emailLabel = document.createElement('label');
  emailLabel.innerHTML = `
    Email address
    <input type="email" name="email" placeholder="name@example.com" autocomplete="off" />
  `;
  form.appendChild(emailLabel);

  const detectedEmailsWrapper = document.createElement('div');
  detectedEmailsWrapper.innerHTML = `
    <p class="detected-title">Detected on page <span class="muted">(pick one)</span></p>
    <div class="chips" data-role="detected-chips"></div>
  `;
  form.appendChild(detectedEmailsWrapper);

  const notesLabel = document.createElement('label');
  notesLabel.innerHTML = `
    Notes
    <textarea name="note" placeholder="Personal hooks, mutual connections, recent news…"></textarea>
  `;
  form.appendChild(notesLabel);

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.innerHTML = `
    <button class="primary" type="submit">Save</button>
    <button class="secondary" data-action="copy" type="button">Copy</button>
    <button class="danger" data-action="delete" type="button">Delete</button>
  `;
  form.appendChild(actions);

  const status = document.createElement('div');
  status.className = 'status';
  status.textContent = '';
  form.appendChild(status);

  const footer = document.createElement('div');
  footer.className = 'footer';
  footer.innerHTML = `
    <span class="badge">Local storage</span>
    ·
    <button type="button" data-action="open-options">Manage all notes</button>
  `;
  panel.appendChild(footer);

  shadow.appendChild(container);

  const emailInput = form.querySelector('input[name="email"]');
  const noteInput = form.querySelector('textarea[name="note"]');
  const chipsContainer = form.querySelector('[data-role="detected-chips"]');

  let detectedEmails = [];
  let selectedEmail = '';
  let isExpanded = false;
  let manualEmailTouched = false;

  const debounce = (fn, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const storageGet = (keys) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(keys, (items) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(items);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const storageSet = (items) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  let statusTimer;
  const setStatus = (message, timeout = 3000) => {
    status.textContent = message;
    if (statusTimer) {
      clearTimeout(statusTimer);
    }
    if (timeout) {
      statusTimer = setTimeout(() => {
        if (status.textContent === message) {
          status.textContent = '';
        }
      }, timeout);
    }
  };

  const updateToggleState = async (expanded) => {
    isExpanded = expanded;
    container.classList.toggle('expanded', expanded);
    const uiState = await getUiState();
    await storageSet({
      [STORAGE_KEYS.UI_STATE]: {
        ...uiState,
        expanded
      }
    }).catch(() => {});
  };

  const getUiState = async () => {
    const { [STORAGE_KEYS.UI_STATE]: uiState = { expanded: false } } = await storageGet([STORAGE_KEYS.UI_STATE]).catch(() => ({}));
    return uiState || { expanded: false };
  };

  const renderDetectedChips = () => {
    chipsContainer.innerHTML = '';
    if (!detectedEmails.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No email detected. Paste one above to save notes.';
      chipsContainer.appendChild(empty);
      return;
    }

    detectedEmails.forEach((email) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (email === selectedEmail ? ' active' : '');
      chip.textContent = email;
      chip.addEventListener('click', () => {
        manualEmailTouched = false;
        setSelectedEmail(email, { fromChip: true });
      });
      chipsContainer.appendChild(chip);
    });
  };

  const findEmailsOnPage = () => {
    const emailSet = new Set();

    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      const email = link.getAttribute('href')
        .replace(/^mailto:/i, '')
        .split('?')[0]
        .trim();
      if (email) emailSet.add(email);
    });

    const metaEmail = document.querySelector('meta[name="email" i]');
    if (metaEmail && metaEmail.content) {
      emailSet.add(metaEmail.content.trim());
    }

    const bodyText = document.body ? document.body.innerText : '';
    if (bodyText) {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      let match;
      while ((match = emailRegex.exec(bodyText)) !== null && emailSet.size < 10) {
        emailSet.add(match[0]);
      }
    }

    return Array.from(emailSet);
  };

  const loadNoteForEmail = async (email) => {
    if (!email) {
      noteInput.value = '';
      noteInput.disabled = true;
      setStatus('Add or detect an email to start.');
      return;
    }

    noteInput.disabled = false;
    const { [STORAGE_KEYS.NOTES]: notes = {} } = await storageGet([STORAGE_KEYS.NOTES]).catch(() => ({}));
    const entry = notes[email];

    noteInput.value = entry?.note || '';
    if (entry?.updatedAt) {
      const lastUpdated = new Date(entry.updatedAt);
      setStatus(`Auto-filled saved note · Updated ${lastUpdated.toLocaleString()}`);
    } else if (noteInput.value) {
      setStatus('Loaded saved note.');
    } else {
      setStatus('No saved note yet — jot something down.');
    }
  };

  const setSelectedEmail = async (email, { fromChip = false } = {}) => {
    selectedEmail = email;
    emailInput.value = email;
    renderDetectedChips();
    await loadNoteForEmail(email);

    if (!fromChip) {
      manualEmailTouched = true;
    }
  };

  const refreshDetectedEmails = async () => {
    const emails = findEmailsOnPage();
    const existing = detectedEmails.join('||');
    const incoming = emails.join('||');

    detectedEmails = emails;
    renderDetectedChips();

    if (!manualEmailTouched || !selectedEmail) {
      const emailToUse = emails.includes(selectedEmail) ? selectedEmail : emails[0] || '';
      if (emailToUse && emailToUse !== selectedEmail) {
        manualEmailTouched = false;
        await setSelectedEmail(emailToUse, { fromChip: true });
      } else if (!selectedEmail && !emailToUse) {
        await setSelectedEmail('', { fromChip: true });
      }
    } else if (existing !== incoming) {
      renderDetectedChips();
    }
  };

  const debouncedRefresh = debounce(() => {
    refreshDetectedEmails().catch((error) => {
      console.error('Failed to refresh emails', error);
    });
  }, 600);

  toggle.addEventListener('click', () => {
    updateToggleState(!isExpanded).catch((error) => {
      console.error('Failed to update toggle state', error);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const note = noteInput.value.trim();

    if (!email) {
      setStatus('Please enter an email before saving.');
      return;
    }

    const { [STORAGE_KEYS.NOTES]: notes = {} } = await storageGet([STORAGE_KEYS.NOTES]).catch(() => ({}));
    if (!note) {
      if (notes[email]) {
        delete notes[email];
        await storageSet({ [STORAGE_KEYS.NOTES]: notes });
        setStatus('Cleared the saved note.');
      } else {
        setStatus('Nothing to save.');
      }
    } else {
      notes[email] = {
        note,
        updatedAt: Date.now()
      };
      await storageSet({ [STORAGE_KEYS.NOTES]: notes });
      setStatus('Note saved locally.');
    }
    selectedEmail = email;
    manualEmailTouched = true;
    renderDetectedChips();
  });

  form.addEventListener('click', async (event) => {
    const action = event.target?.dataset?.action;
    if (!action) return;

    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();

    if (!email && action !== 'open-options') {
      setStatus('No email selected.');
      return;
    }

    if (action === 'delete') {
      const { [STORAGE_KEYS.NOTES]: notes = {} } = await storageGet([STORAGE_KEYS.NOTES]).catch(() => ({}));
      if (notes[email]) {
        delete notes[email];
        await storageSet({ [STORAGE_KEYS.NOTES]: notes });
        noteInput.value = '';
        setStatus('Note deleted.');
      } else {
        setStatus('Nothing to delete.');
      }
    } else if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(noteInput.value);
        setStatus('Copied note to clipboard.');
      } catch (error) {
        console.error('Failed to copy note', error);
        setStatus('Could not copy — try selecting the text manually.');
      }
    } else if (action === 'open-options') {
      chrome.runtime.openOptionsPage();
    }
  });

  emailInput.addEventListener('input', debounce(async () => {
    manualEmailTouched = true;
    await setSelectedEmail(emailInput.value.trim().toLowerCase(), { fromChip: false });
  }, 300));

  const observer = new MutationObserver(() => debouncedRefresh());
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;

    if (changes[STORAGE_KEYS.NOTES]) {
      const newNotes = changes[STORAGE_KEYS.NOTES].newValue || {};
      const currentEntry = newNotes[selectedEmail];
      if (currentEntry) {
        noteInput.value = currentEntry.note;
        setStatus('Note refreshed from another tab.');
      }
    }

    if (changes[STORAGE_KEYS.UI_STATE]) {
      const expanded = Boolean(changes[STORAGE_KEYS.UI_STATE].newValue?.expanded);
      container.classList.toggle('expanded', expanded);
      isExpanded = expanded;
    }
  });

  (async () => {
    const uiState = await getUiState();
    container.classList.toggle('expanded', Boolean(uiState.expanded));
    isExpanded = Boolean(uiState.expanded);

    await refreshDetectedEmails();
  })().catch((error) => {
    console.error('Failed to initialise notes sidebar', error);
  });
})();
