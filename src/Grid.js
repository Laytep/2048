export class Grid {
  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? previousState : this.empty();
  }

  empty() {
    let cells = [];

    for (let r = 0; r < this.size; r++) {
      let row = (cells[x] = []);

      for (let c = 0; c < this.size; c++) {
        row.push(null);
      }
    }

    return cells;
  }
}
