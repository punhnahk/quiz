let num1, num2, operator, correctAnswer;
let score = 0;

function generateQuestion() {
  num1 = Math.floor(Math.random() * 10) + 1;
  num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ["Add to", "Subtract from", "Multiply by", "Divided By"];
  operator = operations[Math.floor(Math.random() * operations.length)];

  switch (operator) {
    case "Add to":
      correctAnswer = num1 + num2;
      break;
    case "Subtract from":
      correctAnswer = num1 - num2;
      break;
    case "Multiply by":
      correctAnswer = num1 * num2;
      break;
    case "Divided By":
      correctAnswer = (num1 / num2).toFixed(0);
      break;
  }
  return `What is ${num1} ${operator} ${num2} ?`;
}

function displayQuestion() {
  document.getElementById("question").innerText = generateQuestion();
  document.getElementById("result").innerText = "";
  document.getElementById("answer").value = "";
}

function checkAnswer() {
  event.preventDefault();
  const userAnswer = document.getElementById("answer").value;
  if (userAnswer === "") {
    return;
  }
  if (userAnswer == correctAnswer) {
    score += 5;
    showToast("Correct!", true);
  } else {
    score -= 5;
    showToast(`Wrong! Correct: ${correctAnswer}`, false);
  }
  document.getElementById("score").innerText = score;
  setTimeout(displayQuestion, 1000);
}

function showToast(message, isSuccess) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  if (isSuccess) {
    toast.classList.add("success");
  } else {
    toast.classList.add("error");
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 3000);
  }, 3000);
}
