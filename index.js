const gameSetup = document.querySelector("#game-setup");
const gameArea = document.querySelector("#game-area");
const playerGreeting = document.querySelector("#player-greeting");
const gameTimer = document.querySelector("#game-timer");
const restartButton = document.querySelector("#restart-game");
const gameGrid = document.querySelector("#game-grid");

let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let timerInterval = null;
let startTime = null;

gameSetup.addEventListener("submit", (event) => {
  event.preventDefault();

  const playerName = document.querySelector("#player-name").value.trim();
  const numPairs = parseInt(document.querySelector("#num-of-pairs").value);

  if (!playerName || numPairs < 1 || numPairs > 30) {
    alert("Please, enter a valid name and number of pairs between: 1 to 30.");
    return;
  }

  startGame(playerName, numPairs);
});

function startGame(playerName, numPairs) {
  gameSetup.style.display = "none";
  gameArea.style.display = "block";

  playerGreeting.textContent = 'Welcome ' + playerName + ',';
  resetTimer();
  startTimer();

  fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data.slice(0, numPairs), ...data.slice(0, numPairs)];
    shuffleCards();
    generateCards();
    console.log(gameBoard.innerHTML);
  });
}


function shuffleCards() {
  cards.sort(() => Math.random() - 0.5);
}

function generateCards() {
  gameGrid.innerHTML = "";
  for (let card of cards) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("data-name", card.name)
      cardElement.innerHTML = `
          <div class="front">
              <img class="front-image" src="./assets/${card.image}" />
          </div>
          <div class="back"></div>
      `;
      gameGrid.appendChild(cardElement);
      cardElement.addEventListener("click", flipCard);
  };
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  resetBoard();

  if (document.querySelectorAll(".card:not(.flipped)").length === 0) {
    endGame();
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetTimer() {
  clearInterval(timerInterval);
  gameTimer.textContent = "0";
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    gameTimer.textContent = elapsedTime;
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  alert(`Congratulations! You completed the game in: ${gameTimer.textContent} seconds.`);
  restartButton.style.display = "block";
}

restartButton.addEventListener("click", () => {
  restartButton.style.display = "none";
  gameArea.style.display = "none";
  gameSetup.style.display = "block";
  resetBoard();
});

