export function animateTileMovement(
  tile,
  oldRow,
  oldColumn,
  newRow,
  newColumn
) {
  return new Promise((resolve) => {
    const tileElement = document.getElementById(`${oldRow}-${oldColumn}`);
    const oldPosition = tileElement.getBoundingClientRect();
    const newPosition = document
      .getElementById(`${newRow}-${newColumn}`)
      .getBoundingClientRect();

    const translateX = newPosition.left - oldPosition.left;
    const translateY = newPosition.top - oldPosition.top;

    if (!tileElement.classList.contains("new-tile")) {
      requestAnimationFrame(() => {
        tileElement.style.transition = "transform 0.2s ease-in-out";
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

export function animateMovements(movements) {
  let animations = movements.map((movement) => {
    return animateTileMovement(
      movement.tile,
      movement.from[0],
      movement.from[1],
      movement.to[0],
      movement.to[1]
    );
  });
  return Promise.all(animations);
}
