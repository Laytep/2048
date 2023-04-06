import { addZeroToRow, removeZeroFromRow, transpose } from './game.js';

const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');

let board;
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

  // board = [
  //   [2, 2, 4, 4],
  //   [2, 0, 0, 2],
  //   [2, 2, 2, 2],
  //   [4, 4, 8, 8],
  // ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();
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
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      tile.innerText = '2';
      tile.classList.add('x2');
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');
  if (num > 0) {
    tile.innerText = num;
    if (num <= 8192) {
      tile.classList.add('x' + num.toString());
    } else {
      tile.classList.add('x16384');
    }
  }
}

function renderMove() {
  scoreElement.innerHTML = score;
  boardElement.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();
      let num = board[r][c];
      updateTile(tile, num);

      boardElement.append(tile);
    }
  }
  setTwo();
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    left();
    renderMove();
  }

  if (e.code === 'ArrowRight') {
    right();
    renderMove();
  }

  if (e.code === 'ArrowDown') {
    down();
    renderMove();
  }

  if (e.code === 'ArrowUp') {
    up();
    renderMove();
  }
});
let row = [2, 2, 0, 4];

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
  for (let r = 0; r < rows; r++) {
    board[r] = removeZeroFromRow(board[r], 'left');
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === board[r][c + 1]) {
        board[r][c] = board[r][c] * 2;
        board[r][c + 1] = 0;
        score += board[r][c];
      }
      board[r] = removeZeroFromRow(board[r], 'left');
      board[r] = addZeroToRow(board[r], 'left');
    }
  }
}

function right() {
  for (let r = 0; r < rows; r++) {
    board[r] = removeZeroFromRow(board[r], 'right');
    for (let c = board[r].length - 1; c >= 0; c--) {
      if (board[r][c] === board[r][c - 1]) {
        board[r][c] = board[r][c] * 2;
        board[r][c - 1] = 0;
        score += board[r][c];
      }
      board[r] = removeZeroFromRow(board[r], 'right');
      board[r] = addZeroToRow(board[r], 'right');
    }
  }
}
