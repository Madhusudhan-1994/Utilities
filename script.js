const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartButton');
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];
let currentPlayer = 'X';
let gameActive = false; // Start inactive until name is entered
let gameState = ['', '', '', '', '', '', '', '', ''];
let playerName = 'Player';

function startGame() {
    const nameInput = document.getElementById('player-name');
    if (nameInput.value.trim() !== '') {
        playerName = nameInput.value.trim();
    }
    document.getElementById('name-dialog').style.display = 'none';
    gameActive = true;
    statusText.textContent = `${playerName}'s turn`;
}

// Difficulty AI functions
function findWinningMove(player) {
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        const cells = [gameState[a], gameState[b], gameState[c]];
        if (cells.filter(c => c === player).length === 2 && cells.includes('')) {
            return condition[cells.indexOf('')];
        }
    }
    return -1;
}

function getSmartMove() {
    if (gameState[4] === '') return 4;
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => gameState[i] === '');
    if (emptyCorners.length > 0) return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    const edges = [1, 3, 5, 7];
    const emptyEdges = edges.filter(i => gameState[i] === '');
    if (emptyEdges.length > 0) return emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
    return -1;
}

// Game logic
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] !== '' || !gameActive || currentPlayer === 'O') return;

    gameState[cellIndex] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;
    
    if (checkWin()) {
        showAnnouncement(currentPlayer === 'X' ? `${playerName} Wins! 🎉` : "Computer Wins! 🤖");
        gameActive = false;
        return;
    }
    
    if (checkDraw()) {
        showAnnouncement("Game Drawn! 🤝");
        gameActive = false;
        return;
    }
    
    currentPlayer = 'O';
    statusText.textContent = `Computer's turn`;
    setTimeout(computerMove, 500);
}

function computerMove() {
    let moveIndex = -1;
    const difficulty = document.getElementById('difficulty').value;

    if (difficulty === 'moderate' || difficulty === 'expert') {
        moveIndex = findWinningMove('O');
        if (moveIndex === -1) moveIndex = findWinningMove('X');
    }
    
    if (moveIndex === -1 && difficulty === 'expert') moveIndex = getSmartMove();
    
    if (moveIndex === -1) {
        const emptyCells = gameState
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const cell = cells[moveIndex];
    gameState[moveIndex] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;

    if (checkWin()) {
        showAnnouncement("Computer Wins! 🤖");
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        showAnnouncement("Game Drawn! 🤝");
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusText.textContent = `${playerName}'s turn`;
}

function checkWin() {
    return winConditions.some(combination => 
        combination.every(index => gameState[index] === currentPlayer)
    );
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

// Fireworks and announcement functions
function createFireworks() {
    const container = document.getElementById('fireworks-container');
    container.innerHTML = '';
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for(let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty('--tx', `${Math.random() * 400 - 200}px`);
        particle.style.setProperty('--ty', `${Math.random() * 400 - 200}px`);
        container.appendChild(particle);
    }
}

function showAnnouncement(message) {
    const announcement = document.getElementById('announcement');
    const text = document.getElementById('announcement-text');
    text.textContent = message;
    announcement.style.display = 'block';
    createFireworks();
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `${playerName}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    document.getElementById('announcement').style.display = 'none';
    document.getElementById('fireworks-container').innerHTML = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('name-dialog').style.display = 'flex';
    
    // Add cell click handlers
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    
    // Add restart button handler
    restartBtn.addEventListener('click', restartGame);
});

document.getElementById('player-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
});
