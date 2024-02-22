import { GameManager } from "./GameManager.js";
import { localStorageSaver } from "./LocalStorageSaver.js";
import { gameDOMRenderer } from "./gameDOMRenderer.js";
import { gameKeyboardListener } from "./gameKeyboardListener.js";

function startGame() {
  const gridSize = 4;
  new GameManager(
    gridSize,
    gameKeyboardListener,
    gameDOMRenderer,
    localStorageSaver
  );
}

window.requestAnimationFrame(startGame);
