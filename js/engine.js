// engine.js — main game loop, updating and rendering

window.Engine = (function () {

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Fit canvas to container
  function fit() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  window.addEventListener("resize", fit);
  fit();

  let last = performance.now();
  let running = false;
  let elapsed = 0;
  let speedMult = 1;

  function start() {
    last = performance.now();
    running = true;
    requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (running) {
      update(dt);
      render();
    }
    requestAnimationFrame(loop);
  }

  // -------------------------------------------------------
  // UPDATE STEP
  // -------------------------------------------------------
  function update(dt) {

    elapsed += dt;

    // Increase difficulty over time
    if (elapsed > 12) {
      elapsed = 0;
      speedMult += 0.12;
      EnemySys.spawn(1);
    }

    // Player movement (grid-based)
    const s = Input.state;
    const p = Player.player;

    let targetR = p.r;
    let targetC = p.c;

    if (s.left) targetC = p.c - 1;
    if (s.right) targetC = p.c + 1;
    if (s.up) targetR = p.r - 1;
    if (s.down) targetR = p.r + 1;

    // Check walls
    if (Maze.cell(targetR, targetC) !== 1) {
      p.r = Utils.clamp(targetR, 1, Maze.rows() - 2);
      p.c = Utils.clamp(targetC, 1, Maze.cols() - 2);
    }

    // Collect trash
    if (Maze.cell(p.r, p.c) === 2) {
      Trash.collectAt(p.r, p.c);
      GameState.trashCollected++;
      GameState.score += 10;
      AudioSys.playEat();
    }

    // Update fish enemies
    EnemySys.update(dt, { r: p.r, c: p.c }, speedMult);

    // Check collision with enemies
    for (const e of EnemySys.all()) {
      const dx = (e.x - p.c);
      const dy = (e.y - p.r);
      if (Math.hypot(dx, dy) < 0.8) {
        GameState.lives--;
        GameState.score = Math.max(0, GameState.score - 6);

        // move enemy slightly away
        e.c = Utils.clamp(e.c + (Math.random() < 0.5 ? 1 : -1), 1, Maze.cols() - 2);

        if (GameState.lives <= 0) Game.over();
      }
    }

    // Update HUD
    document.getElementById("score").textContent = GameState.score;
    document.getElementById("trashCount").textContent = GameState.trashCollected;
    document.getElementById("lives").textContent = GameState.lives;
  }

  // -------------------------------------------------------
  // RENDER STEP
  // -------------------------------------------------------
  function render() {
    fit();

    const wrap = document.getElementById("wrap");

    const cell = Math.floor(
      Math.min(wrap.clientWidth / Maze.cols(), wrap.clientHeight / Maze.rows())
    );

    const totalW = cell * Maze.cols();
    const totalH = cell * Maze.rows();

    const ox = Math.floor((wrap.clientWidth - totalW) / 2);
    const oy = Math.floor((wrap.clientHeight - totalH) / 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(ox, oy);

    // Draw maze
    const grid = Maze.getGrid();

    for (let r = 0; r < Maze.rows(); r++) {
      for (let c = 0; c < Maze.cols(); c++) {
        const x = c * cell;
        const y = r * cell;

        if (grid[r][c] === 1) {
          // wall tile
          ctx.fillStyle = "#083642";
          ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
        } else {
          // empty tile
          ctx.fillStyle = "#012026";
          ctx.fillRect(x, y, cell, cell);

          // trash pellet
          if (grid[r][c] === 2) {
            ctx.fillStyle = "#bfc0c0";
            ctx.fillRect(x + cell * 0.42, y + cell * 0.42, cell * 0.16, cell * 0.16);
          }
        }
      }
    }

    // Draw enemies (fish)
    for (const e of EnemySys.all()) {
      drawFish(ctx, e.x * cell + cell / 2, e.y * cell + cell / 2, cell * 0.6);
    }

    // Draw player
    Player.draw(ctx, cell, ox, oy);

    ctx.restore();
  }

  // Fish shape rendering
  function drawFish(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(performance.now() / 300 + x) * 0.06);

    // body
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.4, s * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ff9f43";
    ctx.fill();

    // tail
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, 0);
    ctx.lineTo(-s * 0.6, -s * 0.25);
    ctx.lineTo(-s * 0.6, s * 0.25);
    ctx.closePath();
    ctx.fill();

    // eye
    ctx.beginPath();
    ctx.fillStyle = "#222";
    ctx.arc(s * 0.15, -s * 0.05, s * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  return {
    start,
    stop
  };

})();
