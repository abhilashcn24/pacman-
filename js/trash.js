// trash.js - logic for counting and collecting trash pellets

window.Trash = (function () {

  function countAll() {
    const g = Maze.getGrid();
    let count = 0;

    for (let r = 0; r < g.length; r++) {
      for (let c = 0; c < g[0].length; c++) {
        if (g[r][c] === 2) count++;
      }
    }

    return count;
  }

  function collectAt(r, c) {
    if (Maze.cell(r, c) === 2) {
      Maze.setCell(r, c, 0);
      return true;
    }
    return false;
  }

  return {
    countAll,
    collectAt
  };

})();
