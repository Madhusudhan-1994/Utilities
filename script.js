const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartButton');
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
const isComputerMode = true;

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] !== '' || !gameActive || (isComputerMode && currentPlayer === 'O')) return;

    gameState[cellIndex] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;
    
    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    
    if (checkDraw()) {
        statusText.textContent = "Game ended in a draw!";
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (isComputerMode && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    const emptyCells = gameState
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);
    
    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = cells[randomIndex];
    
    gameState[randomIndex] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusText.textContent = "Game ended in a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    return winConditions.some(combination => {
        return combination.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
