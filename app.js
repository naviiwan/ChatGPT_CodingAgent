const displayHours = document.getElementById("display-hours");
const displayMinutes = document.getElementById("display-minutes");
const displaySeconds = document.getElementById("display-seconds");

const setHoursInput = document.getElementById("set-hours");
const setMinutesInput = document.getElementById("set-minutes");
const setSecondsInput = document.getElementById("set-seconds");

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const setButton = document.getElementById("set-button");

let timerId = null;
let totalSeconds = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const toTwoDigits = (value) => String(value).padStart(2, "0");

const updateDisplay = () => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  displayHours.textContent = toTwoDigits(hours);
  displayMinutes.textContent = toTwoDigits(minutes);
  displaySeconds.textContent = toTwoDigits(seconds);
};

const setTimeFromInputs = () => {
  const hours = clamp(Number(setHoursInput.value) || 0, 0, 99);
  const minutes = clamp(Number(setMinutesInput.value) || 0, 0, 59);
  const seconds = clamp(Number(setSecondsInput.value) || 0, 0, 59);

  setHoursInput.value = String(hours);
  setMinutesInput.value = String(minutes);
  setSecondsInput.value = String(seconds);

  totalSeconds = hours * 3600 + minutes * 60 + seconds;
  updateDisplay();
};

const startTimer = () => {
  if (timerId) {
    return;
  }

  timerId = setInterval(() => {
    totalSeconds += 1;
    updateDisplay();
  }, 1000);
};

const stopTimer = () => {
  if (!timerId) {
    return;
  }

  clearInterval(timerId);
  timerId = null;
};

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
setButton.addEventListener("click", () => {
  stopTimer();
  setTimeFromInputs();
});

setTimeFromInputs();
