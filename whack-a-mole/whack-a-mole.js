let score = 0;
let timeLeft = 60;
let gameTimer = null;
let moleTimer = null;
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#time-left');
const startButton = document.querySelector('#start-button');

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

function peep() {
    const hole = randomHole();
    hole.classList.add('up');
    
    setTimeout(() => {
        hole.classList.remove('up');
        if (timeLeft > 0) peep();
    }, Math.random() * 1000 + 500);
}

function startGame() {
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    startButton.disabled = true;
    
    gameTimer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            alert(`Game Over! Your score: ${score}`);
            startButton.disabled = false;
        }
    }, 1000);
    
    peep();
}

function whack(e) {
    if (!e.isTrusted) return;
    if (!this.parentNode.classList.contains('up')) return;
    
    score++;
    scoreDisplay.textContent = score;
    this.parentNode.classList.remove('up');
    this.classList.add('hit');
    setTimeout(() => this.classList.remove('hit'), 300);
}

moles.forEach(mole => mole.addEventListener('click', whack));
startButton.addEventListener('click', startGame);
