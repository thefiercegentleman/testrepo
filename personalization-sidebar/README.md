# Personalization Notes Sidebar

Chrome extension that keeps outreach personalization notes pinned to the left side of any page. Notes are indexed by email address and stored locally in `chrome.storage.local`, so the data never leaves your browser profile.

## Features

- Detects email addresses on the current page and lets you choose the right person.
- Quick add/edit/copy of notes in a collapsible left sidebar.
- Notes are saved locally and sync across tabs immediately.
- Options page to browse, search, export, import, or clear saved notes.

## Install (Development Mode)

1. Build once (no bundler required): the repository already contains the compiled assets under `personalization-sidebar/`.
2. Open `chrome://extensions` in Chrome and enable **Developer mode** (toggle in the top right).
3. Choose **Load unpacked**, then select the `personalization-sidebar` directory from this project.
4. Navigate to any outreach page (e.g. a prospecting tool, email compose window, LinkedIn) and tap the **Notes** handle on the left edge to expand the sidebar.

## Usage Tips

- The extension will scan the page for `mailto:` links and visible email-like text. If it finds multiple emails, pick the right one from the chips or type a custom email.
- Notes are keyed by lower-cased email address. Saving an empty note clears the entry.
- Use the **Manage all notes** link (bottom of the sidebar) or open the extension's options page from `chrome://extensions` to review everything.
- Export your notes to JSON occasionally for backup. Import merges entries and keeps the latest timestamp.

## Privacy & Scope

- Data lives entirely in `chrome.storage.local` and is only available to your Chrome profile.
- No external network calls, analytics, or third-party integrations.

## Next Ideas

- Add per-domain rules to auto-expand on specific outreach tools.
- Support additional identifiers (LinkedIn URLs, CRM IDs) alongside emails.
- Integrate with Chrome's side panel for an alternative layout.
