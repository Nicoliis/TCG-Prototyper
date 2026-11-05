// A small popup menu next to an element. items: [{ label, onClick, disabled }, { heading: "text" }, { separator: true }]
import { h } from "../dom.mjs?v=36";

let openMenu = null;

export function closeMenu() {
  if (!openMenu) return;
  openMenu.remove();
  openMenu = null;
  document.removeEventListener("pointerdown", onOutside, true);
  document.removeEventListener("keydown", onKey, true);
}

function onOutside(event) {
  if (openMenu && !openMenu.contains(event.target)) closeMenu();
}

function onKey(event) {
  if (event.key === "Escape") closeMenu();
}

// A small square of up to 4 options centred on a point (the drop). cells: [{ label, col, row, onClick }], laid out
// in a cols x rows grid (1 or 2 each); the square is clamped to stay inside the window.
export function showChoice(x, y, cols, rows, cells) {
  closeMenu();
  const menu = h(
    "div",
    { class: "ctx-menu choice-menu", role: "menu", style: { gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` } },
    cells.map((cell) =>
      h(
        "button",
        {
          type: "button",
          role: "menuitem",
          class: "ctx-item choice-item",
          disabled: cell.disabled,
          style: { gridColumn: String(cell.col + 1), gridRow: String(cell.row + 1) },
          onclick: () => {
            closeMenu();
            cell.onClick?.();
          },
        },
        cell.label,
      ),
    ),
  );
  document.body.append(menu);
  const left = Math.min(Math.max(8, x - menu.offsetWidth / 2), window.innerWidth - menu.offsetWidth - 8);
  const top = Math.min(Math.max(8, y - menu.offsetHeight / 2), window.innerHeight - menu.offsetHeight - 8);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  openMenu = menu;
  setTimeout(() => {
    document.addEventListener("pointerdown", onOutside, true);
    document.addEventListener("keydown", onKey, true);
  });
}

export function showMenu(rect, items) {
  closeMenu();
  const menu = h(
    "div",
    { class: "ctx-menu", role: "menu" },
    items.map((item) => {
      if (item.separator) return h("hr", { class: "ctx-sep" });
      if (item.heading) return h("div", { class: "ctx-heading" }, item.heading);
      return h(
        "button",
        {
          type: "button",
          role: "menuitem",
          class: "ctx-item",
          disabled: item.disabled,
          onclick: () => {
            closeMenu();
            item.onClick?.();
          },
        },
        item.label,
      );
    }),
  );
  document.body.append(menu);
  const width = menu.offsetWidth;
  const height = menu.offsetHeight;
  let left = rect.right + 6;
  if (left + width > window.innerWidth - 8) left = Math.max(8, rect.left - width - 6);
  let top = Math.min(rect.top, window.innerHeight - height - 8);
  top = Math.max(8, top);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  openMenu = menu;
  // listen on the next tick so the click that opened the menu does not close it
  setTimeout(() => {
    document.addEventListener("pointerdown", onOutside, true);
    document.addEventListener("keydown", onKey, true);
  });
  menu.querySelector(".ctx-item:not([disabled])")?.focus();
}
