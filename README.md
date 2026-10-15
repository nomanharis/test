# Box File

A personal document folder that looks and feels like a real box file. Open the
marbled lid, and your entries sit under a spring clip; turn the pages one at a
time to look through them.

## Features

- **Box file look**: a marbled cover with a label holder and finger hole that swings open, a spring clip holding the papers, and page edges that show how much is left in the box.
- **Page turning**: sheets flip up and over the clip in 3D, with a soft paper sound. Use the arrow buttons, the dog-ear corner, the arrow keys or a horizontal swipe on touch screens.
- **Entries**: each page has a title, a date, a section (Bills, Car, Medical and so on), notes and any number of attachments. Photos show as polaroids you can enlarge; PDFs and other files open or download.
- **Index dividers**: every section gets its own coloured tab sticking out of the page edge.
- **Contents page**: an index grouped by section with page numbers. Click a row to jump straight to that page.
- **Search**: filters the box down to the matching entries.
- **Private and offline**: everything, attachments included, is stored in your browser (IndexedDB). Nothing is uploaded.
- **Backup**: under the `⋯` menu you can export everything to one JSON file and import it again.

## Run it

It is a static site with no build step:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

You can also host the folder on any static host, such as GitHub Pages.

## Keyboard

| Key | Action |
| --- | --- |
| `Enter` | Open the box |
| `→` / `↓` / `PgDn` | Next page |
| `←` / `↑` / `PgUp` | Previous page |
| `Home` | Contents |
| `N` | New entry |
| `/` | Search |

## Files

- `index.html` – markup for the cover, the open box and the dialogs
- `styles.css` – the box file look and the page-flip animations
- `app.js` – rendering, page turning, editor, search, backup
- `db.js` – a small IndexedDB wrapper for entries and attachment files
