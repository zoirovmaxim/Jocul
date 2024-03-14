const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const container = document.getElementById('container');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

canvas.width = Math.min(containerWidth, containerHeight);
canvas.height = canvas.width;

const gridSize = canvas.width;
const gridSpacing = gridSize / 3;
const squareSize = gridSpacing * 0.8;

const grid = [['', '', ''], ['', '', ''], ['', '', '']];

let currentPlayer = 'X';
let gameOver = false;

// Inițializăm numărul de victorii pentru fiecare jucător
let playerXWins = 0;
let playerOWins = 0;

// Funcția pentru desenarea grilei
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSpacing, 0);
        ctx.lineTo(i * gridSpacing, gridSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSpacing);
        ctx.lineTo(gridSize, i * gridSpacing);
        ctx.stroke();
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const value = grid[row][col];
            if (value !== '') {
                ctx.font = `${squareSize}px Arial`;
                ctx.fillStyle = '#000';
                ctx.fillText(value, col * gridSpacing + gridSpacing * 0.1, row * gridSpacing + gridSpacing * 0.9);
            }
        }
    }
}

// Funcția pentru gestionarea clicurilor pe canvas
function handleClick(event) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const row = Math.floor(y / gridSpacing);
    const col = Math.floor(x / gridSpacing);

    if (grid[row][col] === '') {
        grid[row][col] = currentPlayer;
        checkWinner();
        if (!gameOver) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    drawGrid();
}

// Funcția pentru verificarea câștigătorului
function checkWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (grid[i][0] !== '' && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
            gameOver = true;
            updateWinner(grid[i][0]);
            return;
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (grid[0][i] !== '' && grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
            gameOver = true;
            updateWinner(grid[0][i]);
            return;
        }
    }

    // Check diagonals
    if (grid[0][0] !== '' && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
        gameOver = true;
        updateWinner(grid[0][0]);
        return;
    }

    if (grid[0][2] !== '' && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
        gameOver = true;
        updateWinner(grid[0][2]);
        return;
    }

    // Check for draw
    let draw = true;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (grid[row][col] === '') {
                draw = false;
                break;
            }
        }
        if (!draw) break;
    }
    if (draw) {
        gameOver = true;
        displayWinner("It's a draw!");
    }
}

// Funcția pentru actualizarea câștigătorului și a scoreboard-ului
function updateWinner(winner) {
    if (winner === 'X') {
        playerXWins++;
    } else {
        playerOWins++;
    }
    updateScoreboard();
    displayWinner(`${winner} wins!`);
}

// Funcția pentru actualizarea scoreboard-ului
function updateScoreboard() {
    document.getElementById('playerXWins').innerText = playerXWins;
    document.getElementById('playerOWins').innerText = playerOWins;
}

// Funcția pentru afișarea mesajului câștigătorului
function displayWinner(message) {
    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerText = message;
    fadeIn(winnerMessage);
}

// Funcția pentru animarea afișării mesajului câștigătorului
function fadeIn(element) {
    let opacity = 0;
    const increment = 0.05;
    element.style.opacity = 0;
    element.style.display = 'block';
    const interval = setInterval(function() {
        if (opacity >= 1) {
            clearInterval(interval);
        } else {
            opacity += increment;
            element.style.opacity = opacity;
        }
    }, 50);
}

// Funcția pentru restartul jocului
function restartGame() {
    grid.forEach(row => row.fill(''));
    currentPlayer = 'X';
    gameOver = false;
    drawGrid();
    fadeOut(winnerMessage); // Ascundeți mesajul câștigătorului după restart
}


// Adăugați această linie de cod pentru a obține referința către butonul de restart
const restartButton = document.getElementById('restartButton');

// Adăugați un event listener pentru butonul de restart
restartButton.addEventListener('click', restartGame);

// Adăugăm event listener pentru click pe canvas
canvas.addEventListener('click', handleClick);

// Inițializăm jocul prin desenarea grilei
drawGrid();
