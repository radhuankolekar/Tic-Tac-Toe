let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let gameMode = null;

const board = document.getElementById('board');
const startScreen = document.getElementById('startScreen');
const modeSelection = document.getElementById('modeSelection');
const messageElement = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const goToIndexBtn = document.getElementById('goToIndexBtn');
const startGameBtn = document.getElementById('startGameBtn');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const playerOInputDiv = document.getElementById('playerOInput');

document.getElementById('humanVsHumanBtn').addEventListener('click', () => {
  gameMode = "human";
  modeSelection.style.display = "none";
  startScreen.style.display = "block";
  playerOInputDiv.style.display = "block";
});

document.getElementById('humanVsComputerBtn').addEventListener('click', () => {
  gameMode = "computer";
  modeSelection.style.display = "none";
  startScreen.style.display = "block";
  playerOInputDiv.style.display = "none"; // hide player O name field
});

startGameBtn.addEventListener('click', () => {
  const playerX = playerXInput.value.trim();
  const playerO = gameMode === "human" ? playerOInput.value.trim() : "Computer";

  if (playerX === "" || (gameMode === "human" && playerO === "")) {
    alert("Please enter the required player names.");
    return;
  }

  localStorage.setItem("playerXName", playerX);
  localStorage.setItem("playerOName", playerO);

  document.getElementById('startScreen').style.display = 'none';
  board.style.display = 'grid';
  messageElement.innerText = `${playerX}'s turn`;
});

board.addEventListener('click', function (e) {
  const index = e.target.getAttribute("data-index");
  if (!gameActive || gameBoard[index] !== "") return;

  makeMove(index);
});

function makeMove(index) {
  gameBoard[index] = currentPlayer;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.innerText = currentPlayer;
  cell.classList.add("clicked");

  if (checkWinner()) {
    gameActive = false;
    const winnerName = getPlayerName(currentPlayer);
    messageElement.innerHTML = `<span class="winner-name">${winnerName} wins!</span>`;
    highlightWinningCells();
    showEndButtons();
  } else if (gameBoard.every(cell => cell !== "")) {
    gameActive = false;
    messageElement.innerText = "It's a draw!";
    showEndButtons();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    messageElement.innerText = `${getPlayerName(currentPlayer)}'s turn`;

    if (gameMode === "computer" && currentPlayer === "O") {
      setTimeout(() => {
        const move = getBestMove();
        makeMove(move);
      }, 500);
    }
  }
}

function getPlayerName(player) {
  const playerXName = localStorage.getItem('playerXName') || "Player X";
  const playerOName = localStorage.getItem('playerOName') || "Player O";
  return player === "X" ? playerXName : playerOName;
}

function checkWinner() {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return combos.some(([a, b, c]) => gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]);
}

function highlightWinningCells() {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  combos.forEach(([a, b, c]) => {
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      document.querySelectorAll('.cell')[a].classList.add('win-cell');
      document.querySelectorAll('.cell')[b].classList.add('win-cell');
      document.querySelectorAll('.cell')[c].classList.add('win-cell');
    }
  });
}

function showEndButtons() {
  restartBtn.style.display = 'inline-block';
  goToIndexBtn.style.display = 'inline-block';
}

restartBtn.addEventListener('click', restartGame);

function restartGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";

  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerText = "";
    cell.classList.remove("clicked", "win-cell");
  });

  messageElement.innerText = `${getPlayerName(currentPlayer)}'s turn`;
  restartBtn.style.display = 'none';
  goToIndexBtn.style.display = 'none';

  if (gameMode === "computer" && currentPlayer === "O") {
    const move = getBestMove();
    makeMove(move);
  }
}

goToIndexBtn.addEventListener('click', () => {
  window.location.href = 'index.html'; // Update if your index page is named differently
});
function getBestMove() {
    let bestScore = -Infinity;
    let move;
  
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === "") {
        gameBoard[i] = "O"; // Computer is "O"
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
  
    return move;
  }
  
  const scores = {
    X: -1, // Human
    O: 1,  // Computer
    tie: 0
  };
  
  function minimax(board, depth, isMaximizing) {
    const winner = evaluateWinner();
    if (winner !== null) {
      return scores[winner];
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }
  
  function evaluateWinner() {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
  
    for (const [a, b, c] of combos) {
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        return gameBoard[a];
      }
    }
  
    if (gameBoard.every(cell => cell !== "")) {
      return "tie";
    }
  
    return null;
  }