export function addZeroToRow(array, direction) {
  if (direction === 'right') {
    while (array.length < 4) {
      array.unshift(0);
    }
  }

  if (direction === 'left') {
    while (array.length < 4) {
      array.push(0);
    }
  }
  return array;
}

export function removeZeroFromRow(array, direction) {
  const nonZero = array.filter((num) => num !== 0);
  const zeros = array.filter((num) => num === 0);

  return direction === 'right' ? zeros.concat(nonZero) : nonZero.concat(zeros);
}

export function transpose(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < i; j++) {
      const temp = board[i][j];
      board[i][j] = board[j][i];
      board[j][i] = temp;
    }
  }
}
