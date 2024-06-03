const quizSection = document.getElementById("quiz-section");
const loader = document.querySelector(".loader");

const resultElement = document.getElementById("result");
const quizProgressElement = document.getElementById("quiz-progress");

let isEditMode = false;

let quiztoedit = null;

let quizData = [];

let currentQuestion = null;

let numberOfQuestions = null;

let results = [];

let difficultWords = [];

let quizList = [];

let selectedQuiz = null;

function addNewQuiz() {
  const quizname = document.getElementById("quiznameinput");
  const quizdescription = document.getElementById("quizdescriptioninput");
  const quiznametext = quizname.value;
  const quizdescriptiontext = quizdescription.value;
  if (isEditMode) {
    quiztoedit.name = quiznametext;
    quiztoedit.description = quizdescriptiontext;
    document.getElementById("newQuizListLabel").innerText = "Add New Quiz";
    document.getElementById("createquiz").innerText = "Save";
    isEditMode = false;
    quiztoedit = null;
  } else {
    quizList.push({ name: quiznametext, description: quizdescriptiontext });
  }
  quizname.value = "";
  quizdescription.value = "";

  saveQuizList();
  renderQuizList();
}
function saveQuizList() {
  localStorage.setItem("quizList", JSON.stringify(quizList));
}

function renderQuizList() {
  const allQuizzesElement = document.getElementById("allquizzes");
  allQuizzesElement.innerHTML = "";
  for (let quiz of quizList) {
    allQuizzesElement.innerHTML += `<li class="quiz-item"><button class="btn me-4 ${
      selectedQuiz == quiz.name ? "btn-info" : "btn-primary"
    }" onclick="startQuiz('${quiz.name}')">${quiz.name}</button>
    <span class="mdi mdi-pencil-circle edit-quiz" onclick="editQuiz('${
      quiz.name
    }')"></span>
    <span class="mdi mdi-delete-circle delete-quiz" onclick="deleteQuiz('${
      quiz.name
    }')"></span>
    </li>`;
  }
}
function editQuiz(name) {
  const quiz = quizList.find((q) => q.name === name);
  const quizname = document.getElementById("quiznameinput");
  const quizdescription = document.getElementById("quizdescriptioninput");
  quizname.value = quiz.name;
  quizdescription.value = quiz.description;
  document.getElementById("newQuizListLabel").innerText = "Update Quiz";
  const createquizbutton = document.getElementById("createquiz");
  createquizbutton.innerHTML = "Update Quiz";
  const newquizbutton = document.getElementById("newquizbutton");
  newquizbutton.click();
  isEditMode = true;
  quiztoedit = quiz;
}

function resetQuizForm() {
  const quizname = document.getElementById("quiznameinput");
  const quizdescription = document.getElementById("quizdescriptioninput");
  quizname.value = "";
  quizdescription.value = "";
  document.getElementById("newQuizListLabel").innerText = "Add New Quiz";
  const createquizbutton = document.getElementById("createquiz");
  createquizbutton.innerHTML = "Save";

  isEditMode = false;
  quiztoedit = null;
}

function deleteQuiz(name) {
  const index = quizList.findIndex((q) => q.name === name);
  quizList.splice(index, 1);
  saveQuizList();
  renderQuizList();
}

function loadQuizList() {
  let currentQuizList = localStorage.getItem("quizList");
  if (currentQuizList != null) {
    quizList = JSON.parse(currentQuizList);
  }
}

//Fill in the blank question, present tense, past tense, future tense conjunction.

async function createQuiz(quizname) {
  selectedQuiz = quizname;
  const currentQuizData = quizList.find((q) => q.name === quizname);
  const vocabularyQuizPrompt = `In ${
    selectedLanguage || "French"
  }, create a quiz to help me build vocabulary. Ask me what the word means, providing four multiple choices. Kindly increase the difficulty level to B1. Generate 5 questions. Ensure that each question object has the: question, choices, and correct_choice keys. The question objects must directly be in an array, not in a nested property. The value of the correct_choice key should be a zero-based integer representing the index of the correct choice in the array of choices. Questions and choices should be in ${
    selectedLanguage || "French"
  } `;
  const quizPrompt = `In ${selectedLanguage || "French"}, ${
    currentQuizData.description
  } If the choice is incorrect, kindly explain why it is incorrect, providing four multiple choices. Kindly increase the difficulty level to B1. Generate 3 questions. Ensure that each question object has the: question, choices, correct_choice, and explanation keys. The question objects must directly be in an array, not in a nested property. The value of the correct_choice key should be a zero-based integer representing the index of the correct choice in the array of choices. Questions and choices should be in ${
    selectedLanguage || "French"
  } `;
  renderQuizList();

  const apikey = localStorage.getItem("apikey");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a language expert. You are designed to output JSON.",
        },
        {
          role: "user",
          content: quizPrompt,
        },
        //{role: "assistant", content: Que signifie le mot 'éphémère' en français?}
      ],
    }),
  });

  if (response.status === 200) {
    const data = await response.json();
    console.log(data.choices[0].message.content);
    quizData = Object.values(JSON.parse(data.choices[0].message.content))[0];
    console.log(quizData);
  }
}

async function startQuiz(quizname) {
  numberOfQuestions = quizData.length;
  currentQuestion = 0;
  document.getElementById("results").style.display = "none";
  quizSection.style.display = "none";
  loader.style.display = "block";
  await createQuiz(quizname);
  loader.style.display = "none";
  quizProgressElement.innerHTML = `<span class='fw-bold text-end'>${
    currentQuestion + 1
  } out of ${quizData.length}</span>`;
  quizSection.style.display = "block";
  results = [];
  displayNextQuestion();
}

function displayNextQuestion() {
  console.log(currentQuestion);
  if (currentQuestion === quizData.length) {
    displayResults();
    return;
  }
  const question = quizData[currentQuestion].question;
  const choices = quizData[currentQuestion].choices;
  const correctChoice = quizData[currentQuestion].correct_choice;
  resultElement.innerHTML = "";
  // Set question and choices dynamically
  document.getElementById("question").innerText = question;
  var choicesHtml = "";
  for (var i = 0; i < choices.length; i++) {
    choicesHtml +=
      '<div class="form-check"><input class="form-check-input" type="radio" name="choice" id="choice' +
      i +
      `" onchange="checkAnswer(${i})` +
      '" value="' +
      choices[i] +
      '"><label class="form-check-label" for="choice' +
      i +
      '">' +
      choices[i] +
      "</label></div>";
  }
  document.getElementById("choices").innerHTML = choicesHtml;

  quizProgressElement.innerHTML = `<span class='fw-bold text-end'>${
    currentQuestion + 1
  } out of ${quizData.length}</span>`;
}

function displayResults() {
  document.getElementById("quiz-section").style.display = "none";
  const correctAnswers = [];
  const wrongAnswers = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i] == true) {
      correctAnswers.push(quizData[i]);
    } else {
      wrongAnswers.push(quizData[i]);
    }
  }
  const resultElement = document.getElementById("results");
  resultElement.style.display = "block";
  resultElement.innerHTML = `
<div class="card p-2 ms-4"><div>Your results</div> 
<div>correct questions: ${correctAnswers.length}</div>
<div>incorrect questions: ${wrongAnswers.length}</div>
<div>Total Score: ${correctAnswers.length} - ${results.length}</div>
</div>
`;
}

function checkAnswer(selectedChoice) {
  console.log(quizData[currentQuestion]);
  if (selectedChoice == quizData[currentQuestion].correct_choice) {
    results.push(true);
    resultElement.innerHTML = `<div class="d-flex flex-column">
        <span class="mdi mdi-thumb-up-outline"></span>
        <span>${quizData[currentQuestion].explanation}</span>
        </div>`;
    resultElement.style.color = "green";
  } else {
    results.push(false);

    resultElement.innerHTML = `<div class="d-flex flex-column">
            <span class="mdi mdi-thumb-down-outline"></span>
            <span>${
              quizData[currentQuestion].choices[
                quizData[currentQuestion].correct_choice
              ]
            }</span>
      <span>${quizData[currentQuestion].explanation}</span>
      </div>`;

    resultElement.style.color = "red";
    //difficultWords.push(quizData);
  }
  if (currentQuestion === quizData.length - 1) {
    document.getElementById("nextBtn").innerText = "Finish";
  }
  currentQuestion = currentQuestion + 1;

  document.querySelectorAll(".form-check-input").forEach((checkbox) => {
    checkbox.disabled = true;
  });
}
loadQuizList();
renderQuizList();
