const boardElement = document.getElementById('board');

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

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();
      let num = board[r][c];
      updateTile(tile, num);

      boardElement.append(tile);
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
