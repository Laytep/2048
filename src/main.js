import { GameManager } from "./GameManager.js";
import { LocalStorageSaver } from "./LocalStorageSaver.js";
import { gameDOMRenderer } from "./gameDOMRenderer.js";
import { GameKeyboardListener } from "./gameKeyboardListener.js";

function startGame() {
  const gridSize = 4;
  new GameManager(
    gridSize,
    GameKeyboardListener,
    gameDOMRenderer,
    LocalStorageSaver
  );
}

window.requestAnimationFrame(startGame);
