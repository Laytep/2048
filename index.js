import { animateMovements } from "./animation.js";
import { addZeroToRow, removeZeroFromRow, transpose } from "./game.js";

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");

let board;
let animationRunning = false;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = function () {
  setGame();
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");

      tile.id = r.toString() + "-" + c.toString();
      let num = board[r][c];
      updateTile(tile, num);

      boardElement.append(tile);
    }
  }
  setTwo();
  setTwo();
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }
  return false;
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.classList.add("new-tile");
      updateTile(tile, 2);
      found = true;
    }
  }
}

function updateTile(tile, num) {
  const isNewTile = tile.classList.contains("new-tile");
  tile.textContent = num > 0 ? num.toString() : "";
  tile.className = "tile";
  tile.classList.add("x" + num.toString());

  if (isNewTile) {
    tile.classList.add("tile-new");
  }
}

function renderMove() {
  scoreElement.textContent = score;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tileId = r.toString() + "-" + c.toString();
      let tile = document.getElementById(tileId);
      let num = board[r][c];

      if (!tile) {
        tile = document.createElement("div");
        tile.id = tileId;
        boardElement.append(tile);
      }

      updateTile(tile, board[r][c]);
    }
  }
  setTwo();
}

document.addEventListener("keyup", (e) => {
  if (animationRunning) {
    return;
  }

  let movePromise = null;
  if (e.code === "ArrowLeft") {
    left().then(() => {
      renderMove();
      animationRunning = false;
    });
  } else if (e.code === "ArrowRight") {
    right();
    renderMove();
  } else if (e.code === "ArrowDown") {
    down();
    renderMove();
  } else if (e.code === "ArrowUp") {
    up();
    renderMove();
  }

  if (movePromise) {
    animationRunning = true;
    movePromise.then(() => {
      renderMove();
      animationRunning = false;
    });
  }
});

function moveTiles(direction) {
  let movement = [];
}

function down() {
  transpose(board);
  right();
  transpose(board);
}

function up() {
  transpose(board);
  left();
  transpose(board);
}

function left() {
  let movements = [];

  for (let r = 0; r < rows; r++) {
    let row = board[r].slice();
    row = removeZeroFromRow(row, "left");

    for (let c = 0; c < row.length; c++) {
      if (row[c] === row[c + 1]) {
        movements.push({ tile: row[c] * 2, from: [r, c + 1], to: [r, c] });

        row[c] = row[c] * 2;
        row[c + 1] = 0;
        score += row[c];
      }
      row = removeZeroFromRow(row, "left");
      row = addZeroToRow(row, "left");

      board[r] = row;
    }
  }
  return animateMovements(movements);
}

function right() {
  for (let r = 0; r < rows; r++) {
    board[r] = removeZeroFromRow(board[r], "right");
    for (let c = board[r].length - 1; c >= 0; c--) {
      if (board[r][c] === board[r][c - 1]) {
        board[r][c] = board[r][c] * 2;
        board[r][c - 1] = 0;
        score += board[r][c];
      }
      board[r] = removeZeroFromRow(board[r], "right");
      board[r] = addZeroToRow(board[r], "right");
    }
  }
}
