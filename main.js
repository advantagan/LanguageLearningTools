let selectedLanguage = "";

let languageList = [];

function addNewLanguage() {
  const languageListinput = document.getElementById("languageInput");
  const language = languageListinput.value;
  languageListinput.value = "";
  languageList.push({
    id: new Date().valueOf(),
    name: language,
    words: [],
  });
  saveLanguageList();
  renderLanguageList();
}
function saveLanguageList() {
  localStorage.setItem("languageList", JSON.stringify(languageList));
}

function loadLanguageList() {
  let currentLanguageList = localStorage.getItem("languageList");
  if (currentLanguageList != null) {
    languageList = JSON.parse(currentLanguageList);
  }
}

//I am still confused with Lines 29 through 35
function renderLanguageList() {
  const allLanguageListElement = document.getElementById("allLanguages");
  allLanguageListElement.innerHTML = "";
  for (let language of languageList) {
    allLanguageListElement.innerHTML += `<li><button class="btn me-4 ${
      selectedLanguage == language.name ? "btn-info" : "btn-primary"
    }" onclick="selectTheLanguage('${language.name}')">${
      language.name
    }</button></li>`;
  }
}

function selectTheLanguage(languageSelected) {
  selectedLanguage = languageSelected;
  renderLanguageList();
  displayVocabularyList();
}

//displayVocabularyList()

loadLanguageList();
renderLanguageList();
