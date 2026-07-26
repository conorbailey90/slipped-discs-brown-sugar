# Slipped Discs' Brown Sugar

Static marketing site for the Billericay cafe + record shop, built as plain
HTML, CSS and JavaScript. Imported from the Claude Design handoff and converted
from the design-canvas (`x-dc` / `DCLogic`) format to a standalone static site.

## Files

| File            | Purpose |
| --------------- | ------- |
| `index.html`    | Page markup (header, hero, menu, in-stock, shop, visit, newsletter, footer). |
| `styles.css`    | Global styles from the design + responsive grid classes / breakpoints. |
| `app.js`        | In-stock grid: search, format/genre/sort filters, empty state, newsletter form. |
| `image-slot.js` | Lightweight `<image-slot>` web component that shows an image or a captioned placeholder. |
| `assets/`       | `logo.png` and the placeholder photos in `assets/ph/`. |

## Running locally

It's a static site. Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes for going live

- **Menu prices** and the **in-stock listings** (`STOCK` in `app.js`) are
  placeholders. Swap in the real menu and, when ready, wire the grid to a real
  inventory source you can update yourself.
- **Photos** in `assets/ph/` are placeholder artwork. Drop real photos in with
  the same filenames and they'll appear automatically.
- The **newsletter form** validates the email client-side but isn't connected to
  a mailing list yet. Point it at your provider when you pick one.
- **Opening hours** live in three places that must be kept in sync: the `HOURS`
  array in `app.js` (drives the dynamic "open today" text in the hero and
  mobile menu, plus the "Today" highlight in the Visit table), the static hours
  table in `index.html`, and the JSON-LD block in `<head>`.
- The **og:image** meta tag uses a relative path. Swap it for an absolute URL
  (and add `og:url`) once the site has a domain.
