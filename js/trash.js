// trash.js - logic for counting and collecting trash pellets

window.Trash = (function () {

  function countAll() {
    const g = Maze.getGrid();
    let count = 0;

    for (let r = 0; r < g.length; r++) {
      for (let c = 0; c < g[0].length; c++) {
        // Count all trash types (2=bottle, 3=plastic, 4=oil)
        if (g[r][c] >= 2 && g[r][c] <= 4) count++;
      }
    }

    return count;
  }

  function collectAt(r, c) {
    const cellValue = Maze.cell(r, c);
    if (cellValue >= 2 && cellValue <= 4) {
      Maze.setCell(r, c, 0);
      return cellValue; // Return trash type for scoring
    }
    return 0;
  }

  return {
    countAll,
    collectAt
  };

})();