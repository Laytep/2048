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
}

document.addEventListener("keyup", async (e) => {
  if (animationRunning) return;
  animationRunning = true;

  let movements = [];
  switch (e.code) {
    case "ArrowLeft":
      movements = left();
      break;
    case "ArrowRight":
      movements = right();
      break;
    case "ArrowUp":
      movements = up();
      break;
    case "ArrowDown":
      movements = down();
      break;
    default:
      animationRunning = false;
      return;
  }

  if (movements.length > 0) {
    await animateMovements(movements, () => {
      renderMove();
      setTwo();
      animationRunning = false;
    });
  } else {
    renderMove();
    setTwo();
  }

  animationRunning = false;
});

function down() {
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

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    let row = board[rowIndex].slice();
    let rowWithoutZeros = removeZeroFromRow(row.slice(), "left");

    for (let c = 0, targetIndex = 0; c < row.length; c++) {
      if (row[c] === 0) continue;

      function moveTile(tile, from, to) {
        movements.push({ tile, from, to });
      }

      let targetPos = targetIndex;
      if (rowWithoutZeros[targetIndex] === rowWithoutZeros[targetIndex + 1]) {
        movements.push({
          tile: row[c],
          from: [rowIndex, c],
          to: [rowIndex, targetPos],
        });
        movements.push({
          tile: row[c] * 2,
          from: [rowIndex, c + 1],
          to: [rowIndex, targetPos],
        });
        rowWithoutZeros[targetIndex] *= 2;
        rowWithoutZeros[targetIndex + 1] = 0;
        score += rowWithoutZeros[targetIndex];
        c++;
      } else {
        moveTile(row[c], [rowIndex, c], [rowIndex, targetPos]);
      }
      targetIndex++;
    }

    row = removeZeroFromRow(rowWithoutZeros.slice(), "left");
    row = addZeroToRow(row, "left");
    board[rowIndex] = row;
  }
  return movements;
}

function right() {
  let movements = [];

  for (let r = 0; r < rows; r++) {
    let row = board[r].slice();
    let originalRow = row.slice();
    row = removeZeroFromRow(row, "right");

    let newRow = [];
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
