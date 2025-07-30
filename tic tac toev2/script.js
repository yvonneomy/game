let gameMode = 'computer';
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

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

    // Haptic feedback for mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    makeMove(index);

    if (gameMode === 'computer' && gameActive && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    const cells = document.querySelectorAll('.cell');
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        document.getElementById('status').textContent = `Player ${currentPlayer} wins! 🎉`;
        gameActive = false;
        highlightWinningCells();
        return;
    }

    if (checkDraw()) {
        document.getElementById('status').textContent = "It's a draw! 🤝";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const nextPlayerText = gameMode === 'computer' && currentPlayer === 'O' ? 'Computer' : `Player ${currentPlayer}`;
    document.getElementById('status').textContent = `${nextPlayerText}'s turn`;
}

function computerMove() {
    let availableMoves = gameBoard.reduce((acc, cell, index) => {
        if (!cell) acc.push(index);
        return acc;
    }, []);

    if (availableMoves.length > 0) {
        // Simple AI: try to win, then block, then random
        let moveIndex = findWinningMove('O') || findWinningMove('X') || availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(moveIndex);
    }
}

function findWinningMove(player) {
    for (let combo of winCombos) {
        let playerMoves = combo.filter(index => gameBoard[index] === player).length;
        let emptyMoves = combo.filter(index => gameBoard[index] === '');

        if (playerMoves === 2 && emptyMoves.length === 1) {
            return combo.find(index => gameBoard[index] === '');
        }
    }
    return null;
}

function checkWin() {
    return winCombos.some(combo => {
        return combo.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function highlightWinningCells() {
    const winningCombo = winCombos.find(combo => {
        return combo.every(index => gameBoard[index] === currentPlayer);
    });

    if (winningCombo) {
        const cells = document.querySelectorAll('.cell');
        winningCombo.forEach(index => {
            cells[index].style.background = currentPlayer === 'X' ? 'rgba(255, 71, 87, 0.3)' : 'rgba(55, 66, 250, 0.3)';
        });
    }
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
        cell.style.background = '';
    });
}

// Initialize the game
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', (e) => handleCellClick(e, index));
});

document.getElementById('restart').addEventListener('click', resetGame);

// Start the game
resetGame();

// Prevent zoom on double tap (mobile)
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;