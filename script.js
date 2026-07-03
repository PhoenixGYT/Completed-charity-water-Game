/* ---------------------------
   LEVEL DATA
--------------------------- */

const levels = [
  {
    title: "Level 1",
    question: "What percentage of the human body is water?",
    answer: "60",
    choices: ["40", "50", "60", "70"]
  },
  {
    title: "Level 2",
    question: "True or False: All water scarcity is caused by drought.",
    answer: "false",
    choices: ["true", "false"]
  },
  {
    title: "Level 3",
    question: "How many people lack access to clean water? (in millions)",
    answer: "771",
    choices: ["500", "771", "900", "1200"]
  }
];

/* ---------------------------
   DIFFICULTY SETTINGS
--------------------------- */

let difficulty = "easy";

const difficultySettings = {
  easy: { hearts: 5, pointsPerCorrect: 10, mode: "multiple" },
  medium: { hearts: 3, pointsPerCorrect: 15, mode: "text" },
  hard: { hearts: 3, pointsPerCorrect: 20, mode: "text" },
  hardcore: { hearts: 1, pointsPerCorrect: 30, mode: "text" }
};

/* ---------------------------
   GAME STATE
--------------------------- */

let progress = JSON.parse(localStorage.getItem("progress")) || [];
let points = 0;
let hearts = difficultySettings[difficulty].hearts;

let milestones = {
  firstCorrect: false,
  fiveCorrect: false,
  allLevels: false
};

let modalClosed = false;

/* ---------------------------
   DOM ELEMENTS
--------------------------- */

const levelSelect = document.getElementById("level-select");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const levelTitle = document.getElementById("level-title");
const questionText = document.getElementById("question");
const answerInput = document.getElementById("answer-input");
const multipleChoice = document.getElementById("multiple-choice");

/* ---------------------------
   STATUS BAR
--------------------------- */

function updateStatusBar() {
  const heartsEl = document.getElementById("hearts");
  heartsEl.textContent = "❤️".repeat(hearts);

  heartsEl.classList.add("heart-pop");
  setTimeout(() => heartsEl.classList.remove("heart-pop"), 400);

  document.getElementById("points").textContent = `Points: ${points}`;
}

updateStatusBar();

/* ---------------------------
   DIFFICULTY SELECT
--------------------------- */

document.querySelectorAll(".difficulty-btn").forEach(btn => {
  btn.onclick = () => {
    difficulty = btn.dataset.mode;
    hearts = difficultySettings[difficulty].hearts;
    updateStatusBar();
    alert(`Difficulty set to ${difficulty.toUpperCase()}`);
  };
});

/* ---------------------------
   LEVEL SELECT RENDER
--------------------------- */

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

  if (progress.length === levels.length) {
    points += 20;
    updateStatusBar();

    endScreen.classList.remove("hidden");

    setTimeout(() => {
      if (!modalClosed) {
        document.getElementById("cta-modal").classList.remove("hidden");
      }
    }, 800);

    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.4 } });

    if (!milestones.allLevels) {
      milestones.allLevels = true;
      alert("Milestone: You completed the entire game!");
    }
  }
}

renderLevelSelect();

/* ---------------------------
   START LEVEL
--------------------------- */

function startLevel(index) {
  currentLevel = index;
  const lvl = levels[index];

  levelTitle.textContent = lvl.title;
  questionText.textContent = lvl.question;
  answerInput.value = "";

  if (difficultySettings[difficulty].mode === "multiple") {
    answerInput.classList.add("hidden");
    multipleChoice.classList.remove("hidden");

    multipleChoice.innerHTML = "";

    lvl.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.onclick = () => submitAnswer(choice);
      multipleChoice.appendChild(btn);
    });
  } else {
    answerInput.classList.remove("hidden");
    multipleChoice.classList.add("hidden");
  }

  gameScreen.classList.remove("hidden");
  endScreen.classList.add("hidden");
}

/* ---------------------------
   SUBMIT ANSWER
--------------------------- */

document.getElementById("submit-answer").onclick = () => {
  submitAnswer(answerInput.value);
};

function submitAnswer(userAnswer) {
  const correctAnswer = levels[currentLevel].answer.toLowerCase();
  const normalized = userAnswer.trim().toLowerCase();

  if (normalized === correctAnswer) {
    playDing();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

    points += difficultySettings[difficulty].pointsPerCorrect;
    updateStatusBar();

    if (!milestones.firstCorrect) {
      milestones.firstCorrect = true;
      alert("Milestone: Your first correct answer!");
    }

    if (progress.length === 5 && !milestones.fiveCorrect) {
      milestones.fiveCorrect = true;
      alert("Milestone: 5 levels completed!");
    }

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
    hearts -= 1;
    updateStatusBar();
    playPop();

    answerInput.classList.add("shake");

    setTimeout(() => {
      answerInput.classList.remove("shake");
      alert("Incorrect. Try again.");
    }, 400);

    if (hearts === 0) {
      alert("Game Over! You ran out of hearts.");
      resetGameState();
    }
  }
}

/* ---------------------------
   RESET GAME
--------------------------- */

function resetGameState() {
  points = 0;
  hearts = difficultySettings[difficulty].hearts;
  progress = [];
  localStorage.removeItem("progress");
  modalClosed = false;

  updateStatusBar();
  gameScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  document.getElementById("cta-modal").classList.add("hidden");
  renderLevelSelect();
}

document.getElementById("reset-btn").onclick = () => {
  if (confirm("Reset all progress?")) {
    resetGameState();
    alert("Game reset!");
  }
};

document.getElementById("close-modal").onclick = () => {
  modalClosed = true;
  document.getElementById("cta-modal").classList.add("hidden");
};

document.getElementById("cta-modal").onclick = (event) => {
  if (event.target === event.currentTarget) {
    modalClosed = true;
    document.getElementById("cta-modal").classList.add("hidden");
  }
};

/* ---------------------------
   CTA MODAL
--------------------------- */

document.getElementById("cta-btn").onclick = () => {
  window.open("https://www.charitywater.org", "_blank");
  document.getElementById("cta-modal").classList.add("hidden");
};

document.getElementById("close-modal").onclick = () => {
  const modal = document.getElementById("cta-modal");
  modal.classList.add("hidden");
  modalClosed = true;
};

// Close modal when clicking outside the modal-content
document.getElementById("cta-modal").onclick = (e) => {
  if (e.target.id === "cta-modal") {
    document.getElementById("cta-modal").classList.add("hidden");
    modalClosed = true;
  }
};


document.getElementById("cta-modal").onclick = (e) => {
  if (e.target.id === "cta-modal") {
    document.getElementById("cta-modal").classList.add("hidden");
    modalClosed = true;
  }
};

/* ---------------------------
   SOUND EFFECTS
--------------------------- */

function playDing() {
  document.getElementById("ding-sound").play();
}

function playPop() {
  document.getElementById("pop-sound").play();
}
