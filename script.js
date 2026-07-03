let points = 0;
let hearts = 3;

function updateStatusBar() {
  document.getElementById("points").textContent = `Points: ${points}`;
  document.getElementById("hearts").textContent = "❤️".repeat(hearts);
}
updateStatusBar();


// ---------------------------
// LEVEL DATA
// ---------------------------
const levels = [
  {
    title: "Level 1",
    question: "What percentage of the human body is water?",
    answer: "60"
  },
  {
    title: "Level 2",
    question: "True or False: All water scarcity is caused by drought.",
    answer: "false"
  },
  {
    title: "Level 3",
    question: "How many people lack access to clean water? (in millions)",
    answer: "771"
  }
];

// ---------------------------
// LOAD SAVED PROGRESS
// ---------------------------
let progress = JSON.parse(localStorage.getItem("progress")) || [];

// ---------------------------
// DOM ELEMENTS
// ---------------------------
const levelSelect = document.getElementById("level-select");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const levelTitle = document.getElementById("level-title");
const questionText = document.getElementById("question");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-answer");

let currentLevel = null;

// ---------------------------
// BUILD LEVEL SELECT SCREEN
// ---------------------------
function renderLevelSelect() {
  levelSelect.innerHTML = "";

  levels.forEach((lvl, index) => {
    const btn = document.createElement("button");
    btn.textContent = lvl.title;
    btn.classList.add("level-btn");

    if (progress.includes(index)) {
      btn.classList.add("completed");
    }

    btn.onclick = () => startLevel(index);
    levelSelect.appendChild(btn);
  });

  // If all levels completed → show end screen
  if (progress.length === levels.length) {
    endScreen.classList.remove("hidden");
  
    // Show CTA modal after a short delay
    setTimeout(() => {
      document.getElementById("cta-modal").classList.remove("hidden");
    }, 800);

    // Big celebration confetti
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.4 }
    });
  }
  
}

renderLevelSelect();

// ---------------------------
// START A LEVEL
// ---------------------------
function startLevel(index) {
  currentLevel = index;
  const lvl = levels[index];

  levelTitle.textContent = lvl.title;
  questionText.textContent = lvl.question;
  answerInput.value = "";

  gameScreen.classList.remove("hidden");
  endScreen.classList.add("hidden");
}

// ---------------------------
// SUBMIT ANSWER
// ---------------------------
submitBtn.onclick = () => {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = levels[currentLevel].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    // Confetti + points
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    points += 10;
    updateStatusBar();

    gameScreen.classList.add("correct-flash");

    setTimeout(() => {
      alert("Correct! Level completed.");

      if (!progress.includes(currentLevel)) {
        progress.push(currentLevel);
        localStorage.setItem("progress", JSON.stringify(progress));
      }

      gameScreen.classList.add("hidden");
      gameScreen.classList.remove("correct-flash");
      renderLevelSelect();
    }, 500);

  } else {
    // Wrong answer → lose heart
    hearts -= 1;
    updateStatusBar();

    answerInput.classList.add("shake");

    setTimeout(() => {
      answerInput.classList.remove("shake");
      alert("Incorrect. Try again.");
    }, 400);

    // Game over
    if (hearts === 0) {
      alert("Game Over! You ran out of hearts.");
      resetGameState();
    }
  }
};

  
document.getElementById("cta-btn").onclick = () => {
  window.open("https://www.charitywater.org", "_blank");
};

document.getElementById("close-modal").onclick = () => {
  document.getElementById("cta-modal").classList.add("hidden");
};

document.getElementById("reset-btn").onclick = () => {
  if (confirm("Are you sure you want to reset your progress?")) {
    resetGameState();
    alert("Game reset!");
    alert("Your progress has been reset.");
  }
};

function resetGameState() {
  points = 0;
  hearts = 3;
  progress = [];
  localStorage.removeItem("progress");

  updateStatusBar();
  gameScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  renderLevelSelect();
}
