// A small popup menu next to an element. items: [{ label, onClick, disabled }, { heading: "text" }, { separator: true }]
import { h } from "../dom.mjs?v=33";

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
