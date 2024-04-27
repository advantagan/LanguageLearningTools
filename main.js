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

function addVocabularyWord(e) {
  e.preventDefault();
  const vocabularyinput = document.getElementById("vocabularyinput");
  let newword = vocabularyinput.value;
  vocabularyinput.value = "";
  languageList
    .find((language) => language.name == selectedLanguage)
    .words.push(newword);

  saveLanguageList();
  displayVocabularyList();
}

//displayVocabularyList()

function displayVocabularyList() {
  const vocabularylist = document.getElementById("vocabulary-list");
  vocabularylist.innerHTML = "";
  const selectedVocabularyList = languageList.find(
    (language) => language.name == selectedLanguage
  ).words;
  for (let i = 0; i < selectedVocabularyList.length; i++) {
    vocabularylist.innerHTML += `<li class="list-group-item">${selectedVocabularyList[i]}
      <span class="mdi mdi-delete-circle" onclick="deletevocabularyword(${i})"></span>
      </li>`;
  }
}

loadLanguageList();
renderLanguageList();
