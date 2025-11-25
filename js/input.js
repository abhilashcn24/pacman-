// input.js — keyboard + touch/drag controls for player movement

window.Input = (function () {

  const state = {
    left: false,
    right: false,
    up: false,
    down: false
  };

  // -----------------------------
  // Keyboard Controls
  // -----------------------------
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") state.left = true;
    if (e.key === "ArrowRight") state.right = true;
    if (e.key === "ArrowUp") state.up = true;
    if (e.key === "ArrowDown") state.down = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") state.left = false;
    if (e.key === "ArrowRight") state.right = false;
    if (e.key === "ArrowUp") state.up = false;
    if (e.key === "ArrowDown") state.down = false;
  });

  // -----------------------------
  // Touch / Mobile Controls
  // Drag left-right to move
  // -----------------------------
  const canvas = document.getElementById("gameCanvas");

  let dragging = false;
  let lastX = null;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const dx = e.clientX - lastX;

    if (Math.abs(dx) > 10) {
      state.right = dx > 0;
      state.left = dx < 0;
      lastX = e.clientX;
    }
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
    state.left = false;
    state.right = false;
  });

  return {
    state
  };

})();
