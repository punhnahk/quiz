let score = 0;
let currentQuestion = {};
let questions = [];

async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy"
    );
    const data = await response.json();
    questions = data.results;
    showQuestion();
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

function createQuestion() {
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let operations = ["+", "-", "*", "/"];
  let operation = operations[Math.floor(Math.random() * operations.length)];
  let correctAnswer;

  switch (operation) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "*":
      correctAnswer = num1 * num2;
      break;
    case "/":
      correctAnswer = Math.floor(num1 / num2);
      break;
  }

  let questionType = Math.random() > 0.7 ? "input" : "choice";

  if (questionType === "input") {
    return {
      type: "input",
      question: `What is ${num1} ${operation} ${num2} = ?`,
      correct_answer: correctAnswer.toString(),
    };
  } else {
    let options = new Set([correctAnswer.toString()]);
    while (options.size < 4) {
      let offset = Math.floor(Math.random() * 5) + 1;
      let wrongAnswer =
        correctAnswer + (Math.random() > 0.5 ? offset : -offset);
      options.add(wrongAnswer.toString());
    }
    return {
      type: "multiple",
      question: `What is ${num1} ${operation} ${num2} = ?`,
      correct_answer: correctAnswer.toString(),
      incorrect_answers: Array.from(options).filter(
        (opt) => opt !== correctAnswer.toString()
      ),
    };
  }
}

function showQuestion() {
  if (questions.length === 0 || Math.random() > 0.5) {
    currentQuestion = createQuestion();
  } else {
    currentQuestion = questions.shift();
  }

  document.getElementById("question").innerHTML = decodeHtml(
    currentQuestion.question
  );
  let correctAnswer = decodeHtml(currentQuestion.correct_answer);
  let choicesContainer = document.getElementById("choices");
  let inputForm = document.getElementById("input-form");
  let answerInput = document.getElementById("answer");

  choicesContainer.innerHTML = "";
  inputForm.classList.add("hidden");
  answerInput.value = "";

  if (currentQuestion.type === "multiple") {
    let options = [
      ...currentQuestion.incorrect_answers.map(decodeHtml),
      correctAnswer,
    ].sort(() => Math.random() - 0.5);
    options.forEach((option) => {
      const button = createButton(option, () => checkChoiceAnswer(option));
      choicesContainer.appendChild(button);
    });
    choicesContainer.classList.remove("hidden");
  } else {
    inputForm.classList.remove("hidden");
    choicesContainer.classList.add("hidden");
  }
}

function decodeHtml(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.innerText = text;
  button.className =
    "block w-full bg-gray-700 py-2 rounded hover:bg-yellow-400 transition";
  button.onclick = onClick;
  return button;
}

function checkChoiceAnswer(selectedAnswer) {
  showResult(selectedAnswer === currentQuestion.correct_answer);
}

function checkInputAnswer(event) {
  event.preventDefault();
  let userAnswer = document.getElementById("answer").value.trim().toLowerCase();
  let correctAnswer = currentQuestion.correct_answer.toLowerCase();
  showResult(userAnswer === correctAnswer);
}

function showResult(isCorrect) {
  let toast = document.getElementById("toast");
  if (isCorrect) {
    score++;
    document.getElementById("score").innerText = score;
    toast.innerText = "✅ Correct!";
    toast.style.backgroundColor = "green";
  } else {
    toast.innerText = `❌ Wrong! Correct answer: ${currentQuestion.correct_answer}`;
    toast.style.backgroundColor = "red";
  }

  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
    showQuestion();
  }, 2000);
}

window.onload = fetchQuestions;
