const STORAGE_KEY = 'notes';

const tableWrapper = document.querySelector('.table-wrapper');
const notesBody = document.getElementById('notesBody');
const filterInput = document.getElementById('filter');
const exportButton = document.getElementById('export');
const importInput = document.getElementById('import');
const clearAllButton = document.getElementById('clearAll');
const confirmDialog = document.getElementById('confirm');
const confirmMessage = document.getElementById('confirmMessage');
const toast = document.getElementById('toast');
const template = document.getElementById('note-row');

let notes = {};
let filteredEmails = [];
let pendingDeletion = null;

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

const fetchNotes = async () => {
  const stored = await storageGet([STORAGE_KEY]).catch(() => ({}));
  return stored[STORAGE_KEY] || {};
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const showToast = (message, duration = 3200) => {
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, duration);
};

const renderEmptyState = (message) => {
  notesBody.innerHTML = '';
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = 4;
  cell.className = 'empty';
  cell.textContent = message;
  row.appendChild(cell);
  notesBody.appendChild(row);
};

const renderNotes = () => {
  const query = filterInput.value.trim().toLowerCase();

  const emails = Object.keys(notes).sort((a, b) => {
    const aTime = notes[a]?.updatedAt || 0;
    const bTime = notes[b]?.updatedAt || 0;
    return bTime - aTime;
  });

  filteredEmails = query
    ? emails.filter((email) => {
        const note = notes[email]?.note || '';
        return (
          email.toLowerCase().includes(query) ||
          note.toLowerCase().includes(query) ||
          email.split('@')[1]?.toLowerCase().includes(query)
        );
      })
    : emails;

  if (!filteredEmails.length) {
    renderEmptyState(query ? 'No notes match your search.' : 'No notes saved yet.');
    return;
  }

  notesBody.innerHTML = '';
  filteredEmails.forEach((email) => {
    const entry = notes[email];
    const clone = template.content.cloneNode(true);
    clone.querySelector('.email').textContent = email;
    clone.querySelector('.timestamp').textContent = formatTimestamp(entry?.updatedAt);
    clone.querySelector('.note').textContent = entry?.note || '';
    const row = clone.querySelector('tr');
    row.dataset.email = email;
    notesBody.appendChild(clone);
  });
};

const refresh = async () => {
  tableWrapper.setAttribute('aria-busy', 'true');
  notes = await fetchNotes();
  renderNotes();
  tableWrapper.setAttribute('aria-busy', 'false');
};

const deleteNote = async (email) => {
  if (!notes[email]) return;
  const updated = { ...notes };
  delete updated[email];
  await storageSet({ [STORAGE_KEY]: updated });
  showToast(`Deleted note for ${email}`);
};

const deleteAllNotes = async () => {
  await storageSet({ [STORAGE_KEY]: {} });
  showToast('Deleted all notes.');
};

const exportNotes = () => {
  const data = {
    exportedAt: new Date().toISOString(),
    total: Object.keys(notes).length,
    notes
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `personalization-notes-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast('Exported notes as JSON.');
};

const importNotes = async (file) => {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch (error) {
    showToast('Import failed: invalid JSON.');
    return;
  }

  const importedNotes = payload.notes || payload;
  if (typeof importedNotes !== 'object' || Array.isArray(importedNotes)) {
    showToast('Import failed: expected an object of notes.');
    return;
  }

  const sanitized = {};
  Object.entries(importedNotes).forEach(([email, value]) => {
    if (typeof email !== 'string') return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;
    const noteText = typeof value === 'string' ? value : value?.note;
    if (typeof noteText !== 'string') return;
    sanitized[cleanEmail] = {
      note: noteText,
      updatedAt: value?.updatedAt && Number.isFinite(value.updatedAt)
        ? value.updatedAt
        : Date.now()
    };
  });

  await storageSet({ [STORAGE_KEY]: { ...notes, ...sanitized } });
  showToast(`Imported ${Object.keys(sanitized).length} notes.`);
};

const handleTableClick = async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const row = button.closest('tr');
  const email = row?.dataset?.email;
  if (!email) return;

  const action = button.dataset.action;
  if (action === 'copy') {
    try {
      await navigator.clipboard.writeText(notes[email]?.note || '');
      showToast(`Copied note for ${email}`);
    } catch (error) {
      console.error('Failed to copy note', error);
      showToast('Unable to copy note.');
    }
  } else if (action === 'delete') {
    pendingDeletion = { type: 'single', email };
    confirmMessage.textContent = `Delete the note saved for ${email}? This cannot be undone.`;
    confirmDialog.showModal();
  }
};

const setupListeners = () => {
  filterInput.addEventListener('input', renderNotes);

  exportButton.addEventListener('click', () => {
    if (!Object.keys(notes).length) {
      showToast('No notes to export.');
      return;
    }
    exportNotes();
  });

  importInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await importNotes(file);
    importInput.value = '';
  });

  clearAllButton.addEventListener('click', () => {
    if (!Object.keys(notes).length) {
      showToast('No notes to delete.');
      return;
    }
    pendingDeletion = { type: 'all' };
    confirmMessage.textContent = 'Delete every saved note? This cannot be undone.';
    confirmDialog.showModal();
  });

  notesBody.addEventListener('click', handleTableClick);

  confirmDialog.addEventListener('close', async () => {
    if (confirmDialog.returnValue !== 'confirm' || !pendingDeletion) {
      pendingDeletion = null;
      return;
    }

    if (pendingDeletion.type === 'single') {
      await deleteNote(pendingDeletion.email);
    } else if (pendingDeletion.type === 'all') {
      await deleteAllNotes();
    }

    pendingDeletion = null;
    refresh();
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local' || !changes[STORAGE_KEY]) return;
    notes = changes[STORAGE_KEY].newValue || {};
    renderNotes();
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  setupListeners();
  await refresh();
});
