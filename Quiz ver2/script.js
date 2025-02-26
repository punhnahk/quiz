let score = 0;
let currentQuestion = {};

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
      correctAnswer = (num1 / num2).toFixed(1);
      break;
  }

  let questionType = Math.random() > 0.7 ? "input" : "choice";

  if (questionType === "input") {
    return {
      type: "input",
      text: `What is ${num1} ${operation} ${num2} = ?`,
      correctAnswer: correctAnswer.toString(),
    };
  } else {
    let options = new Set([correctAnswer]);
    while (options.size < 4) {
      let offset = Math.floor(Math.random() * 5) + 1;
      let wrongAnswer =
        operation === "/"
          ? (correctAnswer + (Math.random() * 2 - 1)).toFixed(2)
          : correctAnswer + (Math.random() > 0.5 ? offset : -offset);
      options.add(wrongAnswer.toString());
    }

    return {
      type: "choice",
      text: `${num1} ${operation} ${num2} = ?`,
      options: Array.from(options).sort(() => Math.random() - 0.5),
      correctAnswer: correctAnswer.toString(),
    };
  }
}

function showQuestion() {
  currentQuestion = createQuestion();

  document.getElementById("question").innerText = currentQuestion.text;

  if (currentQuestion.type === "input") {
    document.getElementById("input-form").classList.remove("hidden");
    document.getElementById("choices").classList.add("hidden");
  } else {
    let choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";
    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.className =
        "block w-full bg-gray-700 py-2 rounded hover:bg-yellow-400";
      button.onclick = () => checkChoiceAnswer(option);
      choicesContainer.appendChild(button);
    });

    choicesContainer.classList.remove("hidden");
    document.getElementById("input-form").classList.add("hidden");
  }
  document.getElementById("next-btn").classList.add("hidden");
}

function showResult(message, isCorrect) {
  let toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.remove("hidden");
  toast.style.backgroundColor = isCorrect ? "green" : "red";

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

function checkInputAnswer(event) {
  event.preventDefault();
  const answer = document.getElementById("answer").value;

  if (answer === currentQuestion.correctAnswer) {
    score++;
    document.getElementById("score").innerText = score;
    showResult("✅ Correct!", true);
  } else {
    showResult(
      `❌ Wrong! The correct answer is: ${currentQuestion.correctAnswer}`,
      false
    );
  }
  document.getElementById("next-btn").classList.remove("hidden");
}

function checkChoiceAnswer(selectedAnswer) {
  let buttons = document.querySelectorAll("#choices button");

  for (let btn of buttons) {
    if (Number(btn.innerText) === currentQuestion.correctAnswer) {
      btn.classList.add("bg-green-500");
    }

    if (btn.innerText === selectedAnswer) {
      if (btn.innerText === currentQuestion.correctAnswer) {
        showResult(`✅ Correct!`, true);
      } else {
        btn.classList.add("bg-red-500");
        showResult(
          `❌ Wrong! The correct answer is: ${currentQuestion.correctAnswer}`,
          false
        );
      }
    }
    document.getElementById("choices").disabled = false;
    btn.classList.remove("hover:bg-yellow-400");
  }

  if (Number(selectedAnswer) === Number(currentQuestion.correctAnswer)) {
    score++;
    document.getElementById("score").innerText = score;
    showResult("✅ Correct!", true);
  } else {
    showResult(
      `❌ Wrong! The correct answer is: ${currentQuestion.correctAnswer}`,
      false
    );
  }

  document.getElementById("next-btn").classList.remove("hidden");
}

function nextQuestion() {
  document.getElementById("answer").value = "";
  document.getElementById("answer").disabled = false;
  document.getElementById("choices").disabled = false;
  showQuestion();
}

showQuestion();
