// Helper functions

// Get a list of all languages implemented in the parent site
function GetSiteLanguages() {
  let languages = [];
  const langDropdown = document.getElementById(
    "lang_dropdown_form_lang-dropdown-form"
  );

  if (!langDropdown) {
    return [];
  }

  langDropdown.querySelectorAll(".dd-option").forEach((lang) => {
    languages.push({
      value: lang.querySelector(".dd-option-value").value,
      text: lang.querySelector(".dd-option-text").innerHTML,
      selected: lang.classList.contains("dd-option-selected") ? true : false,
    });
  });

  return languages;
}

// Get the currently selected language from the parent site
function GetSiteLanguageSelected() {
  return GetSiteLanguages().find((a) => a.selected === true);
}

export { GetSiteLanguages, GetSiteLanguageSelected };
