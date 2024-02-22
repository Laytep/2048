import { GameManager } from "./GameManager.js";
import { LocalStorageSaver } from "./LocalStorageSaver.js";
import { GameDOMRenderer } from "./GameDOMRenderer.js";
import { GameKeyboardListener } from "./gameKeyboardListener.js";

function startGame() {
  const gridSize = 4;

  new GameManager(
    gridSize,
    GameKeyboardListener,
    GameDOMRenderer,
    LocalStorageSaver
  );
}

window.requestAnimationFrame(startGame);
