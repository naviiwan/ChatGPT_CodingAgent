const sentences = [
  "今日は集中してタイピング練習を続けます。",
  "素早く正確に入力できると自信がつきます。",
  "小さな成長の積み重ねが大きな成果に繋がります。",
  "深呼吸して肩の力を抜き、リズムよく進めましょう。",
  "間違えた箇所を確認しながら丁寧に入力します。",
  "毎日少しずつ続けることでスピードが向上します。",
  "指の位置を意識すると正確性が高まります。",
  "文章の流れを意識して滑らかにタイピングしましょう。",
  "疲れたら短い休憩を入れてリフレッシュします。",
];

const targetEl = document.getElementById("target");
const inputEl = document.getElementById("typing-input");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const progressEl = document.getElementById("progress");
const feedbackEl = document.getElementById("feedback");
const newTextButton = document.getElementById("new-text");
const restartButton = document.getElementById("restart");

let currentSentence = "";
let startTime = null;
let timerInterval = null;

const getRandomSentence = () =>
  sentences[Math.floor(Math.random() * sentences.length)];

const resetStats = () => {
  timerEl.textContent = "0.0s";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  progressEl.textContent = `0/${currentSentence.length}`;
};

const renderSentence = (inputValue = "") => {
  const characters = currentSentence.split("");
  const typed = inputValue.split("");
  targetEl.innerHTML = "";

  characters.forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    if (typed[index] === undefined) {
      span.classList.add("pending");
    } else if (typed[index] === char) {
      span.classList.add("correct");
    } else {
      span.classList.add("incorrect");
    }
    targetEl.appendChild(span);
  });
};

const updateTimer = () => {
  if (!startTime) return;
  const elapsed = (Date.now() - startTime) / 1000;
  timerEl.textContent = `${elapsed.toFixed(1)}s`;
  updateWpm(elapsed);
};

const updateWpm = (elapsedSeconds) => {
  if (elapsedSeconds <= 0) return;
  const wordsTyped = inputEl.value.length / 5;
  const minutes = elapsedSeconds / 60;
  const wpm = Math.round(wordsTyped / minutes);
  wpmEl.textContent = Number.isFinite(wpm) ? String(wpm) : "0";
};

const updateAccuracy = () => {
  const typed = inputEl.value.split("");
  const totalTyped = typed.length;
  let correctCount = 0;
  typed.forEach((char, index) => {
    if (char === currentSentence[index]) {
      correctCount += 1;
    }
  });
  const accuracy = totalTyped
    ? Math.round((correctCount / totalTyped) * 100)
    : 100;
  accuracyEl.textContent = `${accuracy}%`;
};

const updateProgress = () => {
  progressEl.textContent = `${inputEl.value.length}/${currentSentence.length}`;
};

const stopTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
};

const startTimer = () => {
  if (timerInterval) return;
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 100);
};

const setSentence = () => {
  currentSentence = getRandomSentence();
  inputEl.value = "";
  startTime = null;
  stopTimer();
  renderSentence();
  resetStats();
  feedbackEl.textContent = "準備ができたら入力を開始してください。";
};

inputEl.addEventListener("input", () => {
  if (!startTime && inputEl.value.length > 0) {
    startTimer();
  }

  renderSentence(inputEl.value);
  updateAccuracy();
  updateProgress();

  if (inputEl.value === currentSentence) {
    stopTimer();
    feedbackEl.textContent = "完了！文章を更新して次に進みましょう。";
  } else {
    const nextIndex = inputEl.value.length;
    const expected = currentSentence[nextIndex];
    const current = inputEl.value[nextIndex - 1];
    if (current && current !== currentSentence[nextIndex - 1]) {
      feedbackEl.textContent = `ミスがあります。次は「${expected ?? ""}」です。`;
    } else {
      feedbackEl.textContent = "いい調子です。正確に入力しましょう。";
    }
  }
});

newTextButton.addEventListener("click", () => {
  setSentence();
  inputEl.focus();
});

restartButton.addEventListener("click", () => {
  inputEl.value = "";
  startTime = null;
  stopTimer();
  renderSentence();
  resetStats();
  feedbackEl.textContent = "最初からやり直します。";
  inputEl.focus();
});

setSentence();
