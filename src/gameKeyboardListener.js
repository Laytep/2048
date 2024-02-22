export class GameKeyboardListener {
  constructor() {
    this.events = {};

    this.eventTouchstart = "touchstart";
    this.eventTouchmove = "touchmove";
    this.eventTouchend = "touchend";

    this.listen();
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  listen() {
    const map = {
      ArrowUp: 0, // Up
      ArrowRight: 1, // Right
      ArrowDown: 2, // Down
      ArrowLeft: 3, // Left
      KeyK: 0, // Vim up
      KeyL: 1, // Vim right
      KeyJ: 2, // Vim down
      KeyH: 3, // Vim left
      KeyW: 0, // W
      KeyD: 1, // D
      KeyS: 2, // S
      KeyA: 3, // A
    };

    document.addEventListener("keydown", (event) => {
      let mapped = map[event.code];

      if (mapped !== undefined) {
        event.preventDefault();
        this.emit("move", mapped);
      }

      if (event.code === "KeyR") {
        this.restart(event);
      }
    });
  }

  restart(event) {
    event.preventDefault();
    this.emit("restart");
  }

  emit(event, data) {
    let callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(data);
      });
    }
  }
}
