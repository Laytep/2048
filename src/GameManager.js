import { GameDOMRenderer } from "./GameDOMRenderer";
import { Grid } from "./Grid";

export class GameManager {
  constructor(
    gridSize,
    GameKeyboardListener,
    gameDOMRenderer,
    LocalStorageSaver
  ) {
    this.gridSize = gridSize;
    this.gameKeyboardListener = new GameKeyboardListener();
    this.gameDOMRenderer = gameDOMRenderer;
    this.localStorageSaver = new LocalStorageSaver();

    this.startTiles = 2;

    this.gameKeyboardListener.on("move", this.move.bind(this));
    this.gameKeyboardListener.on("restart", this.restart.bind(this));
    this.gameKeyboardListener.on("keepPlaying", this.keepPlaying.bind(this));

    this.setup();
  }

  //Set up the game
  setup() {
    let previousState = this.localStorageSaver.getGameState();

    //Check localStorage if previous game present
    if (previousState) {
      this.grid = new Grid(this.gridSize, previousState);
    } else {
      this.grid = new Grid(this.gridSize);
      this.score = 0;
      this.over = false;
      this.won = false;
      this.keepPlaying = false;

      // Add the initial tiles
      addStartTiles();
    }

    // Update the DOM
    actuate();
  }
  // Restart the game
  restart() {
    console.log("restart");
  }
  // Keep playing after winning (allows going over 2048)
  keepPlaying() {
    console.log("keep Playing");
  }
  // Return true if the game is lost, or has won and the user hasn't kept playing

  // Set up the initial tiles to start the game with
  addStartTiles() {}
  // Adds a tile in a random position
  addRandomTile() {}
  // Sends the updated grid to the GameDOMRenderer.js
  actuate() {
    GameDOMRenderer.actuate(this.grid, {});
  }
  // Clear the state when the game is over (game over only, not win)

  // Represent the current game as an object

  // Save all tile positions and remove merger info

  // Move a tile and its representation
  move(direction) {
    // Logic to handle movement
    console.log("Moving in direction:", direction);
  }
  // Move tiles on the grid in the specified direction
}
