export function animateTileMovement(
  tile,
  oldRow,
  oldColumn,
  newRow,
  newColumn
) {
  return new Promise((resolve) => {
    const tileElement = document.getElementById(`${oldRow}-${oldColumn}`);

    if (!tileElement) {
      resolve();
      return;
    }

    const oldPosition = tileElement.getBoundingClientRect();
    const newTileElement = document.getElementById(`${newRow}-${newColumn}`);

    if (!newTileElement) {
      resolve();
      return;
    }
    const newPosition = newTileElement.getBoundingClientRect();

    const translateX = newPosition.left - oldPosition.left;
    const translateY = newPosition.top - oldPosition.top;

    if (translateX === 0 && translateY === 0) {
      resolve();
      return;
    }

    if (!tileElement.classList.contains("new-tile")) {
      requestAnimationFrame(() => {
        tileElement.style.transition = "transform 0.15s ease-out";
        tileElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
        tileElement.addEventListener(
          "transitionend",
          () => {
            tileElement.style.transition = "";
            tileElement.style.transform = "";
            tileElement.classList.remove("new-tile");
            resolve();
          },
          { once: true }
        );
      });
    } else {
      resolve();
    }
  });
}

export function animateMovements(movements, callback) {
  let animations = movements.map((movement) => {
    return animateTileMovement(
      movement.tile,
      movement.from[0],
      movement.from[1],
      movement.to[0],
      movement.to[1]
    );
  });
  return Promise.all(animations).then(() => {
    callback(); // Вызывается после завершения всех анимаций
  });
}
