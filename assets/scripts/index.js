const timerElement = document.getElementById('timer');
const scoreDisplay = document.getElementById('scoreDisplay');
const wordDisplay = document.getElementById('wordElement');
const inputField = document.getElementById('inputField');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const volumeControl = document.getElementById("volumeControl");
const resultContainer = document.querySelector('.result-container');
const backgroundSound = new Audio('./assets/sounds/mozart.mp3');
const correctCheckSound = new Audio('./assets/sounds/mixkit-.wav');
const incorrectCheckSound = new Audio('./assets/sounds/failure-drum-.mp3');
const endSound = new Audio('./assets/sounds/mixkit-animated-small-group-applause-523.wav');
const words = [
  'algorithm', 'application', 'API', 'architecture', 'array', 'backend', 'binary',
  'bug', 'cache', 'callback', 'class', 'client', 'cloud', 'code', 'compiler',
  'component', 'compression', 'computer', 'conditional', 'constructor', 'CSS',
  'database', 'debug', 'deployment', 'design', 'developer', 'DevOps', 'documentation',
  'domain', 'encryption', 'endpoint', 'exception', 'framework', 'frontend', 'function',
  'Git', 'HTML', 'HTTP', 'IDE', 'inheritance', 'interface', 'Internet', 'iteration',
  'Java', 'JavaScript', 'JSON', 'library', 'Linux', 'loop', 'machine', 'memory',
  'method', 'mobile', 'module', 'network', 'node', 'object', 'open-source', 'operating',
  'platform', 'pointer', 'polymorphism', 'protocol', 'Python', 'query', 'recursion',
  'repository', 'responsive', 'REST', 'runtime', 'SaaS', 'scalability', 'SDK',
  'security', 'server', 'software', 'SQL', 'stack', 'storage', 'string', 'structure',
  'syntax', 'system', 'testing', 'UI', 'UX', 'validation', 'variable', 'version',
  'virtual', 'web', 'website', 'XML'
];

class Score {
  constructor(date, hits, percentage) {
    this._date = date;
    this._hits = hits;
    this._percentage = percentage;
  }

  get date() {
    return this._date;
  }

  get hits() {
    return this._hits;
  }

  get percentage() {
    return this._percentage;
  }
}

let timer;
let timeLeft;
let score;
let currentWord;
let wordsTemp = [...words];

startBtn.addEventListener("click", startGame);
inputField.addEventListener("input", checkInput);
volumeControl.addEventListener("input", adjustVolume);
restartBtn.addEventListener('click', startGame);

// volume settings
function adjustVolume() {
  backgroundSound.volume = volumeControl.value;
}
// score 
function updateScore() {
  score++;
  scoreDisplay.innerHTML = `Score: ${score}`;
}

function startGame() {
  wordsTemp = [...words];
  backgroundSound.play();
  correctCheckSound.play();
  startBtn.disabled = true;
  inputField.disabled = false;
  inputField.focus();
  timeLeft = 99;
  timerElement.textContent = `Time left: ${timeLeft}`;
  score = 0;
  scoreDisplay.innerHTML = `Score: ${score}`;
  showNextWord();
  timer = setInterval(countdown, 1000);
  resultContainer.classList.add('hidden');
}
function countdown() {
  timeLeft--;
  timerElement.textContent = `Time left: ${timeLeft}`;

  if (timeLeft === 0) {
    clearInterval(timer);
    endGame();
  }
}

// clean inputfield quikly when you write incorrect word
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (inputField.value.trim().toUpperCase() === wordDisplay.innerHTML.toUpperCase()) {
      correctCheckSound.play();
      updateScore();
      showNextWord();
    } else {
      incorrectCheckSound.play();
      inputField.classList.add("incorrect");
      setTimeout(() => {
        inputField.classList.remove("incorrect");
      },);
      inputField.value = "";
    }
  }
});

function showNextWord() {
  let wordIndex = wordsTemp.indexOf(currentWord);
  wordsTemp.splice(wordIndex, 1);
  inputField.classList.add("correct");
  setTimeout(() => {
    inputField.classList.remove("correct");
    currentWord = wordsTemp[randomNum()];
    wordDisplay.innerHTML = currentWord;
    inputField.value = "";
    inputField.focus();
    if (wordsTemp.length === 0) {
      endGame();
    }
  },);
}

function randomNum() {
  return Math.floor(Math.random() * wordsTemp.length + 0);
}

function checkInput() {
  if (inputField.value === currentWord) {
    inputField.value = "";
    score++;
    scoreDisplay.textContent = score;
    showNextWord();
  }
}

function restartGame() {
  // Stop the timer if it is running
  clearInterval(timer);

  // Reset the game state
  wordsTemp = [...words];
  timeLeft = 99;
  score = 0;
  currentWord = null;
  inputField.value = '';
  inputField.disabled = true;
  wordDisplay.textContent = '';
  ScoreDisplay.textContent = '';
  timerElement.textContent = '';
  resultContainer.classList.add('hidden');

  // Reset the UI
  startBtn.disabled = false;
  inputField.classList.remove('incorrect');
  showResult(false);
}

// End function
function endGame() {
  startBtn.disabled = false;
  inputField.disabled = true;
  inputField.value = "";
  const percentage = (score / words.length) * 100;
  const gameScore = new Score(new Date(), score, percentage);
  console.log(gameScore);
  backgroundSound.pause();
  backgroundSound.currentTime = 0;
  const scoreElement = document.createElement('p');
  scoreElement.textContent = `Score: ${score}`;
  const percentageElement = document.createElement('p');
  percentageElement.textContent = `Percentage: ${percentage.toFixed(2)}%`;
  const dateElement = document.createElement('p');
  dateElement.textContent = `Date: ${gameScore.date.toLocaleString()}`;
  resultContainer.innerHTML = '';
  resultContainer.appendChild(scoreElement);
  resultContainer.appendChild(percentageElement);
  resultContainer.appendChild(dateElement);
  resultContainer.classList.remove('hidden');
  endSound.play();
}

