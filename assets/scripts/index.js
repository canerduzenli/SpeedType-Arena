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
  'ocean', 'mountain', 'forest', 'desert', 'beach', 'island', 'river',
  'animal', 'bird', 'fish', 'insect', 'reptile', 'mammal', 'flora',
  'climate', 'weather', 'hurricane', 'typhoon', 'tornado', 'earthquake', 'tsunami',
  'geography', 'history', 'culture', 'language', 'music', 'art', 'literature',
  'philosophy', 'religion', 'politics', 'economics', 'sociology', 'psychology',
  'astronomy', 'physics', 'chemistry', 'biology', 'medicine', 'sports', 'fitness',
  'nutrition', 'cooking', 'travel', 'tourism', 'adventure', 'leisure', 'entertainment'
];

let timer;
let timeLeft;
let score;
let currentWord;
let wordsTemp = [...words];

startBtn.addEventListener("click", startGame);
inputField.addEventListener("input", checkInput);
volumeControl.addEventListener("input", adjustVolume);
restartBtn.addEventListener('click', startGame);

function adjustVolume() {
  backgroundSound.volume = volumeControl.value;
}

function updateScore() {
  score++;
  scoreDisplay.innerHTML = `Score: ${score}`;
}

function startGame() {
  wordsTemp = [...words];
  backgroundSound.play();
  startBtn.disabled = true;
  inputField.disabled = false;
  inputField.focus();
  timeLeft = 99;
  timerElement.textContent = `Time left: ${timeLeft}`;
  score = 0;
  scoreDisplay.innerHTML = `Score: ${score}`;
  showNextWord();
  timer = setInterval(countdown, 100);
}

function countdown() {
  timeLeft--;
  timerElement.textContent = `Time left: ${timeLeft}`;

  if (timeLeft === 0) {
    clearInterval(timer);
    endGame();
  }
}

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

function saveScores(scoresArray) {
  localStorage.setItem('gameScores', JSON.stringify(scoresArray));
}

function loadScores() {
  return JSON.parse(localStorage.getItem('gameScores')) || [];
}

function endGame() {
  startBtn.disabled = false;
  inputField.disabled = true;
  inputField.value = "";
  const percentage = (score / words.length) * 100;
  const gameScore = {
    date: new Date(),
    hits: score,
    percentage: percentage
  };

  let scoresArray = loadScores();
  scoresArray.push(gameScore);
  scoresArray.sort((a, b) => b.hits - a.hits);
  scoresArray.splice(50);
  saveScores(scoresArray);

  const topScores = scoresArray.slice(0, 9);
  console.log("Top 9 scores:", topScores);

  resultContainer.innerHTML = '';
  const scoreElement = document.createElement('p');
  scoreElement.textContent = `Score: ${score}`;
  const percentageElement = document.createElement('p');
  percentageElement.textContent = `Percentage: ${percentage.toFixed(2)}%`;
  const dateElement = document.createElement('p');
  dateElement.textContent = `Date: ${gameScore.date.toLocaleString()}`;
  resultContainer.appendChild(scoreElement);
  resultContainer.appendChild(percentageElement);
  resultContainer.appendChild(dateElement);

  const topScoresList = document.createElement('ol');
  topScores.forEach(score => {
    const listItem = document.createElement('li');
    listItem.textContent = `Score: ${score.hits}, Percentage: ${score.percentage.toFixed(2)}%, Date: ${new Date(score.date).toLocaleString()}`;
    topScoresList.appendChild(listItem);
  });
  resultContainer.appendChild(topScoresList);

  resultContainer.classList.remove('hidden');
  endSound.play();
}

