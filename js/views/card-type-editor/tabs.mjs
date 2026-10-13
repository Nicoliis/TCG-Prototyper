export function setUpTabs(panel) {
  for (const button of panel.querySelectorAll(".tab-button")) {
    button.addEventListener("click", () => selectTab(panel, button.dataset.tab));
  }
}

export function activeTab(panel) {
  return panel.querySelector(".tab-button[aria-selected='true']")?.dataset.tab;
}

export function selectTab(panel, tabName) {
  for (const button of panel.querySelectorAll(".tab-button")) {
    button.setAttribute("aria-selected", String(button.dataset.tab === tabName));
  }
  for (const tabPanel of panel.querySelectorAll(".tab-panel")) {
    tabPanel.hidden = tabPanel.dataset.tab !== tabName;
  }
}

export function setUpSegmented(panel, fieldName, onPick) {
  const group = panel.querySelector(`.segmented[data-field="${fieldName}"]`);
  for (const button of group.querySelectorAll("button")) {
    button.addEventListener("click", () => {
      setSegmentedValue(panel, fieldName, button.dataset.value);
      onPick(button.dataset.value);
    });
  }
}

export function setSegmentedValue(panel, fieldName, value) {
  const group = panel.querySelector(`.segmented[data-field="${fieldName}"]`);
  for (const button of group.querySelectorAll("button")) {
    button.classList.toggle("active", button.dataset.value === value);
  }
}
