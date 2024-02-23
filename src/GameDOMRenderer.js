export class GameDOMRenderer {
  constructor() {
    this.tileContainer = document.querySelector(".tile-container");
    this.scoreContainer = document.querySelector(".score-container");
    this.bestContainer = document.querySelector(".best-container");
    this.messageContainer = document.querySelector(".game-message");

    this.score = 0;
  }

  actuate(grid, metadata) {
    window.requestAnimationFrame(() => {
      this.clearContainer(this.tileContainer);

      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.addTile(cell);
          }
        });
      });
    });

    this.updateScore(metadata.score);
    this.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        this.message(false); // You lose
      } else if (metadata.won) {
        this.message(true); // You win!
      }
    }
  }

  clearContainer(container) {
    if (!container) {
      return;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  addTile(tile) {
    let wrapper = document.createElement("div");
    let inner = document.createElement("div");
    let position = tile.previousPosition || { x: tile.x, y: tile.y };
    let positionClass = this.positionClass(position);

    let classes = ["tile", "tile-" + tile.value, positionClass];

    if (tile.value > 2048) classes.push("tile-super");

    this.applyClasses(wrapper, classes);

    inner.classList.add("tile-inner");
    inner.textContent = tile.value;

    if (tile.previousPosition) {
      //Check that the tile gets rendered in the previous position first
      window.requestAnimationFrame(() => {
        classes[2] = this.positionClass({ x: tile.x, y: tile.y });
        this.applyClasses(wrapper, classes); //Update the position
      });
    } else if (tile.mergedFrom) {
      classes.push("tile-merged");
      this.applyClasses(wrapper, classes);

      //Render the tiles that merged
      tile.mergedFrom.forEach((merged) => {
        this.addTile(merged);
      });
    } else {
      classes.push("tile-new");
      this.applyClasses(wrapper, classes);
    }

    wrapper.appendChild(inner);

    this.tileContainer.appendChild(wrapper);
  }

  applyClasses(element, classes) {
    element.setAttribute("class", classes.join(" "));
  }

  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 };
  }

  positionClass(position) {
    position = this.normalizePosition(position);
    return "tile-position-" + position.x + "-" + position.y;
  }

  message(won) {
    let type = won ? "game-won" : "game-over";
    let message = won ? "Gratulation you win!" : "He-he, try again!";

    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName("p")[0].textContent = message;
  }

  continueGame() {
    this.clearMessage();
  }

  clearMessage() {
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
  }

  updateScore(score) {
    this.clearContainer(this.scoreContainer);

    let difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = this.score;

    if (difference > 0) {
      let addition = document.createElement("div");
      addition.classList.add("score-addition");
      addition.textContent = "+" + difference;

      this.scoreContainer.appendChild(addition);
    }
  }

  updateBestScore(bestScore) {
    this.bestContainer.textContent = bestScore;
  }
}