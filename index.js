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

document.addEventListener("keyup", async (e) => {
  if (animationRunning) {
    return;
  }

  if (e.code === "ArrowLeft") {
    let movements = left();
    if (movements.length > 0) {
      await animateMovements(movements);
    }
    renderMove();
  } else if (e.code === "ArrowRight") {
    let movements = right();
    if (movements.length > 0) {
      await animateMovements(movements);
    }
    renderMove();
  } else if (e.code === "ArrowDown") {
    let movements = down();
    if (movements.length > 0) {
      await animateMovements(movements);
    }
    renderMove();
  } else if (e.code === "ArrowUp") {
    let movements = up();
    console.log("Animation Running:", movements);
    if (movements.length > 0) {
      await animateMovements(movements);
    }
    renderMove();
  }
  animationRunning = false;
});

function down() {
  if (animationRunning) return;
  animationRunning = true;

  transpose(board);
  let movements = right();
  transpose(board);

  let adaptedMovementsDown = movements.map((movement) => ({
    tile: movement.tile,
    from: [movement.from[1], movement.from[0]], // Swap indices to reflect vertical movement
    to: [movement.to[1], movement.to[0]],
  }));

  return adaptedMovementsDown;
}

function up() {
  if (animationRunning) return;
  animationRunning = true;

  transpose(board);
  let movements = left();
  transpose(board);

  let adaptedMovementsUp = movements.map((movement) => ({
    tile: movement.tile,
    from: [movement.from[1], movement.from[0]],
    to: [movement.to[1], movement.to[0]],
  }));

  return adaptedMovementsUp;
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
  return movements;
}

function right() {
  let movements = [];

  for (let r = 0; r < rows; r++) {
    let row = board[r].slice();
    row = removeZeroFromRow(row, "right");
    for (let c = row.length - 1; c >= 0; c--) {
      if (row[c] === row[c - 1]) {
        movements.push({ tile: row[c] * 2, from: [r, c - 1], to: [r, c] });

        row[c] = row[c] * 2;
        row[c - 1] = 0;
        score += row[c];
      }
      row = removeZeroFromRow(row, "right");
      row = addZeroToRow(row, "left");
    }
    board[r] = row;
  }
  return movements;
}
