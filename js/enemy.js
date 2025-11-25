// enemy.js - fish enemy system with variety of fish types

window.EnemySys = (function () {
  let enemies = [];

  const FISH_TYPES = [
    { color: '#ff9f43', speed: 1.0, name: 'orange' },
    { color: '#ee5a6f', speed: 1.2, name: 'red' },
    { color: '#48dbfb', speed: 0.9, name: 'blue' },
    { color: '#feca57', speed: 1.1, name: 'yellow' }
  ];

  function spawn(count) {
    for (let i = 0; i < count; i++) {
      let r, c;
      // Spawn near edges
      do {
        if (Math.random() < 0.5) {
          r = Math.random() < 0.5 ? 1 : Maze.rows() - 2;
          c = 1 + Math.floor(Math.random() * (Maze.cols() - 2));
        } else {
          c = Math.random() < 0.5 ? 1 : Maze.cols() - 2;
          r = 1 + Math.floor(Math.random() * (Maze.rows() - 2));
        }
      } while (Maze.cell(r, c) === 1);

      const fishType = Utils.choose(FISH_TYPES);

      enemies.push({
        r,
        c,
        x: c,
        y: r,
        speed: 0.8 + Math.random() * 0.9,
        t: Math.random() * 1000,
        type: fishType,
        swimPhase: Math.random() * Math.PI * 2,
        facing: Math.random() < 0.5 ? 1 : -1 // Direction fish faces
      });
    }
  }

  function reset() {
    enemies = [];
  }

  function update(delta, playerPos, speedMult) {
    for (const e of enemies) {
      e.t += delta * 1000;
      e.swimPhase += delta * 3;

      // AI: Move toward player with some randomness
      if (Math.random() < 0.03) {
        const dr = Math.sign(playerPos.r - e.r + (Math.random() * 2 - 1) * 0.5);
        const dc = Math.sign(playerPos.c - e.c + (Math.random() * 2 - 1) * 0.5);

        if (canWalk(e.r + dr, e.c)) e.r += dr;
        if (canWalk(e.r, e.c + dc)) {
          e.c += dc;
          // Update facing direction
          e.facing = dc > 0 ? 1 : dc < 0 ? -1 : e.facing;
        }
      }

      // Smooth interpolation for rendering
      e.x += ((e.c) - e.x) * 0.06 * (e.speed * speedMult * e.type.speed);
      e.y += ((e.r) - e.y) * 0.06 * (e.speed * speedMult * e.type.speed);
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