// enemy.js - fish enemy system (simple AI and rendering)

window.EnemySys = (function () {
  let enemies = [];

  function spawn(count) {
    enemies = enemies || [];
    for (let i = 0; i < count; i++) {
      let r, c;
      // pick a random empty cell near the edges to spawn
      do {
        if (Math.random() < 0.5) {
          r = Math.random() < 0.5 ? 1 : Maze.rows() - 2;
          c = 1 + Math.floor(Math.random() * (Maze.cols() - 2));
        } else {
          c = Math.random() < 0.5 ? 1 : Maze.cols() - 2;
          r = 1 + Math.floor(Math.random() * (Maze.rows() - 2));
        }
      } while (Maze.cell(r, c) === 1);

      enemies.push({
        r,
        c,
        x: c,
        y: r,
        speed: 0.8 + Math.random() * 0.9,
        t: Math.random() * 1000
      });
    }
  }

  function reset() {
    enemies = [];
  }

  function update(delta, playerPos, speedMult) {
    for (const e of enemies) {
      e.t += delta * 1000;

      // probabilistic move toward player with randomness
      if (Math.random() < 0.03) {
        const dr = Math.sign(playerPos.r - e.r + (Math.random() * 2 - 1) * 0.5);
        const dc = Math.sign(playerPos.c - e.c + (Math.random() * 2 - 1) * 0.5);

        if (canWalk(e.r + dr, e.c)) e.r += dr;
        if (canWalk(e.r, e.c + dc)) e.c += dc;
      }

      // smooth continuous movement for rendering
      e.x += ((e.c) - e.x) * 0.06 * (e.speed * speedMult);
      e.y += ((e.r) - e.y) * 0.06 * (e.speed * speedMult);
    }
  }

  function canWalk(r, c) {
    return Maze.cell(r, c) !== 1;
  }

  function all() {
    return enemies;
  }

  return {
    spawn,
    reset,
    update,
    all
  };
})();
