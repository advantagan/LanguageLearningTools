let responses = [];

async function submitUserInput() {
  let userInput = document.getElementById("userinput").value;
  console.log(userInput);
  const prompt = `Does does the following make sense? Propose a suggestion on how the phrase or sentence can be improved and be comprehnsive including other concerns such as grammar rules etc. Give the response in the language of origin.${userInput}`;
  const apikey = localStorage.getItem("apikey");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      response_format: { type: "text" },
      messages: [
        {
          role: "system",
          content:
            "You are a language expert. You are designed to respond comprehensively. Add html tags with styles to the responses to make them look presentable.",
        },
        {
          role: "user",
          content: prompt,
        },
        //{role: "assistant", content: Que signifie le mot 'éphémère' en français?}
      ],
    }),
  });

  if (response.status === 200) {
    const data = await response.json();

    responses.push(data.choices[0].message.content);
    renderResponses();
  }
}
function renderResponses() {
  let responseDiv = document.getElementById("responses");
  responseDiv.innerHTML = "";
  responses.forEach((response) => {
    responseDiv.innerHTML += `<p class="p-2 mb-4 mx-auto">${response}</p>`;
  });
}
