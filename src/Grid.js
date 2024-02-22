export class Grid {
  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? previousState : this.empty();
  }

  empty() {
    let cells = [];

    for (let r = 0; r < this.size; r++) {
      let row = (cells[r] = []);

      for (let c = 0; c < this.size; c++) {
        row.push(null);
      }
    }

    return cells;
  }

  randomAvailableCell() {
    let cells = this.availableCell();

    if (cells.legth) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  availableCells() {
    let cells = [];

    this.eachCell((r, c, tile) => {
      if (!tile) {
        cells.push({ x: r, y: c });
      }
    });

    return cells;
  }

  // Call callback for every cell
  eachCell(callback) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        callback(r, c, this.cells[r][c]);
      }
    }
  }

  // Check if there are any cells available
  cellsAvailable() {
    return !!this.availableCells().length;
  }

  cellAvailable(cell) {
    return this.cellOccupied(cell);
  }

  cellOccupied(cell) {
    return !!cellContent(cell);
  }

  cellContent(cell) {
    if (withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    } else {
      return null;
    }
  }

  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile;
  }

  removeTile(tile) {
    this.cells[tile.x][tile.y] = null;
  }

  withinBounds(position) {
    return (
      position.x >= 0 &&
      position.x < this.size &&
      position.y >= 0 &&
      position.y < this.size
    );
  }
}
