// maze.js - constructs a Pac-Man-like grid: 0=empty, 1=wall, 2=trash (bottle), 3=trash (plastic), 4=trash (oil)

window.Maze = (function () {
  const ROWS = 15, COLS = 19;
  let grid = [];

  function create() {
    grid = new Array(ROWS).fill().map(() => new Array(COLS).fill(0));

    // Create border walls (Pac-Man style)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
          grid[r][c] = 1;
        }
      }
    }

    // Create inner wall structures (Pac-Man maze pattern)
    for (let r = 2; r < ROWS - 2; r += 2) {
      for (let c = 2; c < COLS - 2; c += 2) {
        if (Math.random() < 0.66) {
          grid[r][c] = 1;
        }
      }
    }

    // Carve corridors to ensure playability
    for (let k = 0; k < 50; k++) {
      const r = 1 + Math.floor(Math.random() * (ROWS - 2));
      const c = 1 + Math.floor(Math.random() * (COLS - 2));
      grid[r][c] = 0;
    }

    // Place trash pellets with variety (bottles, plastics, oil)
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        if (grid[r][c] === 0 && Math.random() < 0.60) {
          // Random trash type: 2=bottle, 3=plastic, 4=oil
          const trashType = Math.floor(Math.random() * 3) + 2;
          grid[r][c] = trashType;
        }
      }
    }

    // Ensure center start area is clear
    const centerR = Math.floor(ROWS / 2);
    const centerC = Math.floor(COLS / 2);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        grid[centerR + dr][centerC + dc] = 0;
      }
    }
  }

  function rows() { return ROWS; }
  function cols() { return COLS; }
  
  function cell(r, c) {
    return (grid[r] && grid[r][c] !== undefined) ? grid[r][c] : 1;
  }
  
  function setCell(r, c, val) {
    if (grid[r] && grid[r][c] !== undefined) grid[r][c] = val;
  }
  
  function getGrid() { return grid; }

  return { create, rows, cols, cell, setCell, getGrid };
})();