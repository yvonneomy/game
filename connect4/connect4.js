const ROWS = 6;
const COLS = 7;
let currentPlayer = 1;
let board = [];
let gameOver = false;

function initializeBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    
    for (let col = 0; col < COLS; col++) {
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.col = col;
        
        for (let row = ROWS - 1; row >= 0; row--) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            column.appendChild(cell);
        }
        
        column.addEventListener('click', handleClick);
        boardElement.appendChild(column);
    }
    
    gameOver = false;
    currentPlayer = 1;
    updateStatus();
}

function handleClick(e) {
    if (gameOver) return;
    
    const col = parseInt(e.currentTarget.dataset.col);
    const row = getLowestEmptyRow(col);
    
    if (row === -1) return;
    
    makeMove(row, col);
    
    if (checkWin(row, col)) {
        gameOver = true;
        updateStatus(`Player ${currentPlayer} wins!`);
        return;
    }
    
    if (checkDraw()) {
        gameOver = true;
        updateStatus("It's a draw!");
        return;
    }
    
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
}

function getLowestEmptyRow(col) {
    for (let row = 0; row < ROWS; row++) {
        if (board[row][col] === 0) return row;
    }
    return -1;
}

function makeMove(row, col) {
    board[row][col] = currentPlayer;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(`player${currentPlayer}`);
}

function checkWin(row, col) {
    return (
        checkDirection(row, col, 0, 1) || // Horizontal
        checkDirection(row, col, 1, 0) || // Vertical
        checkDirection(row, col, 1, 1) || // Diagonal /
        checkDirection(row, col, 1, -1)   // Diagonal \
    );
}

function checkDirection(row, col, deltaRow, deltaCol) {
    const player = board[row][col];
    let count = 1;
    
    // Check forward
    for (let i = 1; i < 4; i++) {
        const newRow = row + (deltaRow * i);
        const newCol = col + (deltaCol * i);
        if (!isValidPosition(newRow, newCol) || board[newRow][newCol] !== player) break;
        count++;
    }
    
    // Check backward
    for (let i = 1; i < 4; i++) {
        const newRow = row - (deltaRow * i);
        const newCol = col - (deltaCol * i);
        if (!isValidPosition(newRow, newCol) || board[newRow][newCol] !== player) break;
        count++;
    }
    
    return count >= 4;
}

function isValidPosition(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== 0));
}

function updateStatus(message) {
    const status = document.getElementById('status');
    status.textContent = message || `Player ${currentPlayer}'s Turn`;
}

document.getElementById('reset').addEventListener('click', initializeBoard);
initializeBoard();
