import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";

export class GameManager {
  constructor(
    gridSize,
    GameKeyboardListener,
    GameDOMRenderer,
    LocalStorageSaver
  ) {
    this.gridSize = gridSize;
    this.gameKeyboardListener = new GameKeyboardListener();
    this.gameDOMRenderer = new GameDOMRenderer();
    this.localStorageSaver = new LocalStorageSaver();

    this.startTiles = 2;

    this.gameKeyboardListener.on("move", this.move.bind(this));
    this.gameKeyboardListener.on("restart", this.restart.bind(this));
    this.gameKeyboardListener.on("keepPlaying", this.keepPlaying.bind(this));

    this.setup();
  }

  restart() {
    // this.localStorageSaver.clearGameState();
    this.gameDOMRenderer.continueGame(); //Clear the won/lost message
    this.setup();
  }

  //Set up the game
  setup() {
    let previousState = null;
    //this.localStorageSaver.getGameState();

    //Check localStorage if previous game present
    if (previousState) {
      this.grid = new Grid(this.gridSize);
      this.score = 0;
      this.over = false;
      this.won = false;
      this.keepPlaying = false;
    } else {
      this.grid = new Grid(this.gridSize);
      this.score = 0;
      this.over = false;
      this.won = false;
      this.keepPlaying = false;

      // Add the initial tiles
      this.addStartTiles();
    }

    // Update the DOM
    this.actuate();
  }

  // Set up the initial tiles to start the game with
  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  // Keep playing after winning (allows going over 2048)
  keepPlaying() {
    this.keepPlaying = true;
    this.gameDOMRenderer.continueGame(); // Clear the game won/lost message
  }

  // Return true if the game is lost, or has won and the user hasn't kept playing
  isGameTerminated() {
    return this.over || (this.won && !this.keepPlaying);
  }

  // Adds a tile in a random position
  addRandomTile() {
    if (this.grid.cellsAvailable()) {
      let value = Math.random() < 0.9 ? 2 : 4;
      let tile = new Tile(this.grid.randomAvailableCell(), value);
      this.grid.insertTile(tile);
    }
  }

  // Sends the updated grid to the GameDOMRenderer.js
  actuate() {
    this.gameDOMRenderer.actuate(this.grid, {
      score: this.score,
      over: this.over,
      won: this.won,
      //write later
      bestScore: 0,
      terminated: this.isGameTerminated(),
    });
  }

  // Clear the state when the game is over (game over only, not win)

  // Represent the current game as an object
  serialize() {
    return {
      grid: this.grid.serialize(),
      score: this.score,
      over: this.over,
      won: this.won,
      keepPlaying: this.keepPlaying,
    };
  }
  // Save all tile positions and remove merger info
  prepareTiles() {
    this.grid.eachCell((x, y, tile) => {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    });
  }
  // Move a tile and its representation
  moveTile(tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;

    tile.updatePosition(cell);
  }

  // Move tiles on the grid in the specified direction
  move(direction) {
    // 0: up, 1: right, 2: down, 3: left

    if (this.isGameTerminated()) return;

    let cell, tile;

    let vector = this.getVector(direction);
    let traversals = this.buildTraversals(vector);
    let moved = false;

    //Save the current tile positions and remove merger information
    this.prepareTiles();

    //Travers the grid in the right direction merger information
    traversals.x.forEach((x) => {
      traversals.y.forEach((y) => {
        cell = { x: x, y: y };
        tile = this.grid.cellContent(cell);

        if (tile) {
          let positions = this.findFarthestPosition(cell, vector);
          let next = this.grid.cellContent(positions.next);

          if (next && next.value === tile.value && !next.mergedFrom) {
            let merged = new Tile(positions.next, tile.value * 2);
            merged.mergedFrom = [tile, next];

            this.grid.insertTile(merged);
            this.grid.removeTile(tile);

            //Converge the two tiles' positions
            tile.updatePosition(positions.next);

            if (merged.value === 2048) this.won = true;
          } else {
            this.moveTile(tile, positions.farthest);
          }

          if (!this.positionsEqual(cell, tile)) {
            moved = true;
          }
        }
      });
    });

    if (moved) {
      this.addRandomTile();

      if (!this.movesAvailable()) {
        this.over = true;
      }

      this.actuate();
    }
  }

  getVector(direction) {
    // Vectors representing tile movement
    let map = {
      0: { x: 0, y: -1 }, // Up
      1: { x: 1, y: 0 }, // Right
      2: { x: 0, y: 1 }, // Down
      3: { x: -1, y: 0 }, // Left
    };

    return map[direction];
  }

  // Build a list of positions to traverse in the right order
  buildTraversals(vector) {
    let traversals = { x: [], y: [] };

    for (let pos = 0; pos < this.gridSize; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }

    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
  }

  findFarthestPosition(cell, vector) {
    let previous;

    do {
      previous = cell;
      cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

    return {
      farthest: previous,
      next: cell,
    };
  }

  movesAvailable() {
    return this.grid.cellsAvailable() || this.tileMatchesAvailiable();
  }

  tileMatchesAvailiable() {
    let tile;

    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        tile = this.grid.cellContent({ x: x, y: y });

        if (tile) {
          for (let direction = 0; direction < 4; direction++) {
            let vector = this.getVector(direction);
            let cell = { x: x + vector.x, y: y + vector.y };

            let other = this.grid.cellContent(cell);

            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y;
  }
}
