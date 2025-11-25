// maze.js - constructs a simple pac-man-like grid: 0=empty,1=wall,2=trash
window.Maze = (function(){
  const ROWS = 15, COLS = 19;
  let grid = [];

  function create(){
    grid = new Array(ROWS).fill().map(()=>new Array(COLS).fill(0));

    // border walls
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(r===0 || r===ROWS-1 || c===0 || c===COLS-1) grid[r][c] = 1;
      }
    }

    // some inner wall blocks (pattern)
    for(let r=2; r<ROWS-2; r+=2){
      for(let c=2; c<COLS-2; c+=2){
        if(Math.random() < 0.66) grid[r][c] = 1;
      }
    }

    // carve random corridors so maze is playable
    for(let k=0; k<50; k++){
      const r = 1 + Math.floor(Math.random()*(ROWS-2));
      const c = 1 + Math.floor(Math.random()*(COLS-2));
      grid[r][c] = 0;
    }

    // place trash pellets in empty cells
    for(let r=1; r<ROWS-1; r++){
      for(let c=1; c<COLS-1; c++){
        if(grid[r][c] === 0 && Math.random() < 0.60){
          grid[r][c] = 2;
        }
      }
    }

    // ensure center start is empty
    grid[Math.floor(ROWS/2)][Math.floor(COLS/2)] = 0;
  }

  function rows(){ return ROWS; }
  function cols(){ return COLS; }
  function cell(r,c){ return (grid[r] && grid[r][c] !== undefined) ? grid[r][c] : 1; }
  function setCell(r,c,val){ if(grid[r] && grid[r][c] !== undefined) grid[r][c] = val; }
  function getGrid(){ return grid; }

  return { create, rows, cols, cell, setCell, getGrid };
})();
