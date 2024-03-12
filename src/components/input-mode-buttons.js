const activeClasses = ["bg-red-400", "text-gray-800"];

// handle click of any mode button (clear current selection)
function clearModeSelection(e) {
  const modeButtons = document.getElementById("input-mode-buttons");
  for (const child of modeButtons.children) {
    child.classList.remove(...activeClasses);
  }
}

// record mode buttonv
function handleRecordModeButtonClick(e) {
  clearModeSelection(e);
  document.getElementById("record-mode-button").classList.add(...activeClasses);
  document.getElementById("record-controls").classList.add("active");
}

// type mode button
function handleTypeModeButtonClick(e) {
  clearModeSelection(e);
  document.getElementById("type-mode-button").classList.add(...activeClasses);
}

export { handleRecordModeButtonClick, handleTypeModeButtonClick };
