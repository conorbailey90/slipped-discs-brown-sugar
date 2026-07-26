/* Slipped Discs' Brown Sugar: stock filtering + newsletter.
   Ported from the design handoff's DCLogic component to plain JS/DOM. */

const STOCK = [
  { id: 1, title: "Rumours", artist: "Fleetwood Mac", genre: "Rock", format: "Vinyl", price: 24.99, condition: "New pressing", badge: "New in" },
  { id: 2, title: "Blue", artist: "Joni Mitchell", genre: "Folk", format: "Vinyl", price: 26.0, condition: "New pressing", badge: "" },
  { id: 3, title: "Kind of Blue", artist: "Miles Davis", genre: "Jazz", format: "Vinyl", price: 22.5, condition: "VG+ secondhand", badge: "" },
  { id: 4, title: "Songs in the Key of Life", artist: "Stevie Wonder", genre: "Soul", format: "Vinyl", price: 32.0, condition: "New pressing", badge: "" },
  { id: 5, title: "Definitely Maybe", artist: "Oasis", genre: "Rock", format: "CD", price: 8.0, condition: "Used, EX", badge: "" },
  { id: 6, title: "The Miseducation of Lauryn Hill", artist: "Lauryn Hill", genre: "Soul", format: "Vinyl", price: 29.0, condition: "New pressing", badge: "New in" },
  { id: 7, title: "Give Up", artist: "The Postal Service", genre: "Electronic", format: "Vinyl", price: 25.0, condition: "New pressing", badge: "" },
  { id: 8, title: "Selected Ambient Works 85-92", artist: "Aphex Twin", genre: "Electronic", format: "CD", price: 11.5, condition: "Used, VG", badge: "" },
  { id: 9, title: "Legend", artist: "Bob Marley & The Wailers", genre: "Reggae", format: "Vinyl", price: 27.0, condition: "New pressing", badge: "" },
  { id: 10, title: "Back to Black", artist: "Amy Winehouse", genre: "Soul", format: "Vinyl", price: 26.5, condition: "New pressing", badge: "Last copy" },
  { id: 11, title: "A Love Supreme", artist: "John Coltrane", genre: "Jazz", format: "Vinyl", price: 23.0, condition: "VG secondhand", badge: "" },
  { id: 12, title: "Bargain bin bundle, 5 LPs", artist: "Mixed secondhand", genre: "Rock", format: "Vinyl", price: 10.0, condition: "Well loved", badge: "Bargain" },
  { id: 13, title: "Slipped Discs tote bag", artist: "House merch, unbleached cotton", genre: "Gifts", format: "Gift", price: 9.0, condition: "New", badge: "" },
  { id: 14, title: "Carbon fibre record brush", artist: "Turntable care", genre: "Gifts", format: "Gift", price: 14.0, condition: "New", badge: "" },
  { id: 15, title: "Enamel mug, treble clef", artist: "House merch", genre: "Gifts", format: "Gift", price: 12.0, condition: "New", badge: "New in" },
  { id: 16, title: "Coffee beans, 250g house blend", artist: "Roasted in Essex", genre: "Gifts", format: "Gift", price: 8.5, condition: "New", badge: "" }
];

/* Opening hours, indexed to match Date.getDay() (0 = Sunday). 24-hour clock.
   Keep in sync with the hours table in index.html and the JSON-LD in <head>. */
const HOURS = [
  { open: 10, close: 16 }, // Sunday
  { open: 9, close: 17 },  // Monday
  { open: 9, close: 17 },  // Tuesday
  { open: 9, close: 17 },  // Wednesday
  { open: 9, close: 17 },  // Thursday
  { open: 9, close: 17 },  // Friday
  { open: 9, close: 17 }   // Saturday
];

const GENRES = ["All genres", "Rock", "Soul", "Jazz", "Folk", "Electronic", "Reggae", "Gifts"];
const FORMATS = ["Everything", "Vinyl", "CD", "Gift"];
const SORTS = ["Newest", "Price low", "Price high"];

const state = { query: "", genre: "All genres", format: "Everything", sort: "Newest" };

/* Small helper: build an element from a tag + inline-style string + text. */
function el(tag, cssText, text) {
  const n = document.createElement(tag);
  if (cssText) n.style.cssText = cssText;
  if (text != null) n.textContent = text;
  return n;
}

function chipStyle(active, tone) {
  const bg = active ? (tone === "blue" ? "#3F6B72" : "#6B1F45") : "#FBF6EC";
  const color = active ? "#FBF6EC" : "#2B1C24";
  const border = active ? "1px solid transparent" : "1px solid rgba(43,28,36,0.18)";
  return (
    "padding:8px 14px; border-radius:999px; border:" + border + "; background:" + bg +
    "; color:" + color + "; font-family:Karla,sans-serif; font-size:13px; font-weight:600;" +
    " cursor:pointer; transition:background 140ms ease, color 140ms ease;"
  );
}

function renderChips(containerId, values, current, tone, onPick) {
  const host = document.getElementById(containerId);
  host.textContent = "";
  values.forEach(function (label) {
    const btn = el("button", chipStyle(label === current, tone), label);
    btn.type = "button";
    btn.addEventListener("click", function () { onPick(label); });
    host.appendChild(btn);
  });
}

function badgeStyle(item) {
  const shown = !!item.badge;
  const bg = item.badge === "Bargain" ? "#F4E9BE" : "#6B1F45";
  const color = item.badge === "Bargain" ? "#6B1F45" : "#FBF6EC";
  return (
    "position:absolute; top:10px; left:10px; display:" + (shown ? "inline-block" : "none") +
    "; padding:4px 10px; border-radius:999px; background:" + bg + "; color:" + color +
    "; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; pointer-events:none;"
  );
}

function stockCard(it) {
  const card = el("article", "background:#FBF6EC; border:1px solid rgba(43,28,36,0.1); border-radius:16px; overflow:hidden; display:flex; flex-direction:column;");

  const media = el("div", "position:relative; aspect-ratio:1/1; background:#DCE9EB;");
  const slot = document.createElement("image-slot");
  slot.setAttribute("id", "sdbs-stock-" + it.id);
  slot.setAttribute("shape", "rect");
  slot.setAttribute("fit", "cover");
  slot.setAttribute("src", "assets/ph/stock-" + it.id + ".png");
  slot.setAttribute("placeholder", it.format === "Gift" ? "Product photo" : "Sleeve artwork");
  media.appendChild(slot);
  media.appendChild(el("span", badgeStyle(it), it.badge || ""));
  card.appendChild(media);

  const body = el("div", "padding:16px 17px 18px; display:flex; flex-direction:column; gap:5px; flex:1;");
  body.appendChild(el("div", "font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#8A7A80;", it.format + " · " + it.genre));
  body.appendChild(el("div", "font-family:'Instrument Serif',serif; font-size:20px; line-height:1.15; color:#2B1C24;", it.title));
  body.appendChild(el("div", "font-size:13px; color:#5C4A52;", it.artist));

  const foot = el("div", "display:flex; align-items:baseline; justify-content:space-between; margin-top:auto; padding-top:12px;");
  foot.appendChild(el("span", "font-family:'Instrument Serif',serif; font-size:20px; color:#6B1F45;", "£" + it.price.toFixed(2)));
  foot.appendChild(el("span", "font-size:12px; color:#8A7A80;", it.condition));
  body.appendChild(foot);

  card.appendChild(body);
  return card;
}

function currentItems() {
  const q = state.query.trim().toLowerCase();
  let items = STOCK.filter(function (it) {
    if (state.genre !== "All genres" && it.genre !== state.genre) return false;
    if (state.format !== "Everything" && it.format !== state.format) return false;
    if (q && (it.title + " " + it.artist + " " + it.genre).toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
  if (state.sort === "Price low") items = items.slice().sort((a, b) => a.price - b.price);
  else if (state.sort === "Price high") items = items.slice().sort((a, b) => b.price - a.price);
  return items;
}

function render() {
  renderChips("sdbs-formats", FORMATS, state.format, "blue", function (v) { state.format = v; render(); });
  renderChips("sdbs-sorts", SORTS, state.sort, "blue", function (v) { state.sort = v; render(); });
  renderChips("sdbs-genres", GENRES, state.genre, "plum", function (v) { state.genre = v; render(); });

  const items = currentItems();

  const grid = document.getElementById("sdbs-grid");
  grid.textContent = "";
  items.forEach(function (it) { grid.appendChild(stockCard(it)); });

  document.getElementById("sdbs-empty").style.display = items.length === 0 ? "block" : "none";
  document.getElementById("sdbs-result-label").textContent =
    items.length === 1 ? "1 item" : items.length + " items";

  const filtered = state.genre !== "All genres" || state.format !== "Everything" || state.query.trim() !== "";
  const reset = document.getElementById("sdbs-reset");
  reset.style.cssText =
    "border:none; background:none; padding:0; font:inherit; font-size:13px; color:#6B1F45;" +
    " text-decoration:underline; cursor:pointer; visibility:" + (filtered ? "visible" : "hidden") + ";";
}

function formatHour(h) {
  const display = h % 12 === 0 ? 12 : h % 12;
  return display + (h >= 12 ? "pm" : "am");
}

function initOpeningHours() {
  const now = new Date();
  const day = now.getDay();
  const today = HOURS[day];
  const range = formatHour(today.open) + " – " + formatHour(today.close);
  const hour = now.getHours() + now.getMinutes() / 60;
  const openNow = hour >= today.open && hour < today.close;

  const hero = document.getElementById("sdbs-open-today");
  if (hero) hero.textContent = "open today " + range;

  const mobile = document.getElementById("sdbs-open-today-mobile");
  if (mobile) mobile.textContent = "Open today " + range;

  const dot = document.getElementById("sdbs-open-dot");
  if (dot) {
    dot.style.background = openNow ? "#3E7C4F" : "#8A7A80";
    dot.title = openNow ? "Open now" : "Currently closed";
  }

  const row = document.querySelector('#sdbs-hours-list li[data-day="' + day + '"]');
  if (row) {
    const name = row.querySelector("span");
    name.style.color = "#6B1F45";
    name.appendChild(el("span",
      "margin-left:8px; padding:2px 8px; border-radius:999px; background:#6B1F45; color:#FBF6EC;" +
      " font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; vertical-align:1px;",
      "Today"));
  }
}

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-nav");
  const close = document.getElementById("mobile-nav-close");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    // Lock the page behind the full-screen overlay.
    document.documentElement.classList.toggle("mobile-nav-open", open);
    document.body.classList.toggle("mobile-nav-open", open);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  if (close) close.addEventListener("click", function () { setOpen(false); });

  // Close when a link is tapped so the page can scroll to the section.
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // Close on Escape.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
}

function init() {
  initOpeningHours();
  initMobileNav();

  const search = document.getElementById("sdbs-search");
  search.addEventListener("input", function (e) { state.query = e.target.value; render(); });

  document.getElementById("sdbs-reset").addEventListener("click", function () {
    state.query = "";
    state.genre = "All genres";
    state.format = "Everything";
    state.sort = "Newest";
    search.value = "";
    render();
  });

  const form = document.getElementById("sdbs-subscribe");
  const email = document.getElementById("sdbs-email");
  const note = document.getElementById("sdbs-subscribe-note");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok = /.+@.+\..+/.test(email.value);
    note.textContent = ok
      ? "Lovely, you're on the list. See you Friday."
      : "That email doesn't look right, mind checking it?";
  });

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
