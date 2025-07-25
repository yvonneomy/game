let gameMode = 'computer';
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

const winSound = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
const clickSound = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
const drawSound = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function setGameMode(mode) {
    gameMode = mode;
    resetGame();
}

function handleCellClick(e, index) {
    const cell = e.target;
    if (cell.textContent || !gameActive) return;

    clickSound.play();
    makeMove(index);

    if (gameMode === 'computer' && gameActive && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    document.querySelectorAll('.cell')[index].textContent = currentPlayer;
    document.querySelectorAll('.cell')[index].classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        winSound.play();
        document.getElementById('status').textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        drawSound.play();
        document.getElementById('status').textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
}

function computerMove() {
    let availableMoves = gameBoard.reduce((acc, cell, index) => {
        if (!cell) acc.push(index);
        return acc;
    }, []);

    if (availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        makeMove(availableMoves[randomIndex]);
    }
}

function checkWin() {
    return winCombos.some(combo => {
        return combo.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('status').textContent = "Player X's turn";
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Initialize the game
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', (e) => handleCellClick(e, index));
});

document.getElementById('restart').addEventListener('click', resetGame);

// Start the game
resetGame();
