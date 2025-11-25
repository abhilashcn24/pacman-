// input.js — keyboard + touch/drag controls for player movement

window.Input = (function () {

  const state = {
    left: false,
    right: false,
    up: false,
    down: false
  };

  let lastDirection = null;

  // Keyboard Controls
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      state.left = true;
      lastDirection = 'left';
    }
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      state.right = true;
      lastDirection = 'right';
    }
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
      state.up = true;
      lastDirection = 'up';
    }
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
      state.down = true;
      lastDirection = 'down';
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") state.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") state.right = false;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") state.up = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") state.down = false;
  });

  // Touch / Mobile Controls
  const canvas = document.getElementById("gameCanvas");

  let dragging = false;
  let lastX = null;
  let lastY = null;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    // Determine direction based on larger delta
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      state.right = dx > 0;
      state.left = dx < 0;
      state.up = false;
      state.down = false;
      lastX = e.clientX;
      lastDirection = dx > 0 ? 'right' : 'left';
    } else if (Math.abs(dy) > 10) {
      state.down = dy > 0;
      state.up = dy < 0;
      state.left = false;
      state.right = false;
      lastY = e.clientY;
      lastDirection = dy > 0 ? 'down' : 'up';
    }
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
    state.left = false;
    state.right = false;
    state.up = false;
    state.down = false;
  });

  function getLastDirection() {
    return lastDirection;
  }

  return {
    state,
    getLastDirection
  };

})();