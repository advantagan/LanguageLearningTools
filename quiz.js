const quizSection = document.getElementById("quiz-section");

let quizData = [];

let currentQuestion = null;

let numberOfQuestions = null;

async function createQuiz() {
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
          content:
            "In French, create a quiz to help me build vocabulary. Ask me what the word means, providing four multiple choices. Kindly increase the difficulty level to B1. Generate 20 questions. Ensure that each question object has the: question, choices, and correct_choice keys. The question objects must directly be in an array, not in a nested property. The value of the correct_choice key should be a zero-based integer representing the index of the correct choice in the array of choices.",
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

async function startQuiz() {
  numberOfQuestions = quizData.length;
  currentQuestion = 0;
  await createQuiz();
  quizSection.style.display = "block";
  displayNextQuestion();
}

function displayNextQuestion() {
  const question = quizData[currentQuestion].question;
  const choices = quizData[currentQuestion].choices;
  const correctChoice = quizData[currentQuestion].correct_choice;
  // Set question and choices dynamically
  document.getElementById("question").innerText = question;
  var choicesHtml = "";
  for (var i = 0; i < choices.length; i++) {
    choicesHtml +=
      '<div class="form-check"><input class="form-check-input" type="radio" name="choice" id="choice' +
      i +
      '" value="' +
      choices[i] +
      '"><label class="form-check-label" for="choice' +
      i +
      '">' +
      choices[i] +
      "</label></div>";
  }
  document.getElementById("choices").innerHTML = choicesHtml;
  currentQuestion = currentQuestion + 1;
}
