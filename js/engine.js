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
    elapsed = 0;
    speedMult = 1;
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

  // UPDATE STEP
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

    // Update player direction for animation
    if (s.left) {
      targetC = p.c - 1;
      Player.setDirection(2);
    }
    if (s.right) {
      targetC = p.c + 1;
      Player.setDirection(0);
    }
    if (s.up) {
      targetR = p.r - 1;
      Player.setDirection(3);
    }
    if (s.down) {
      targetR = p.r + 1;
      Player.setDirection(1);
    }

    // Check walls
    if (Maze.cell(targetR, targetC) !== 1) {
      p.r = Utils.clamp(targetR, 1, Maze.rows() - 2);
      p.c = Utils.clamp(targetC, 1, Maze.cols() - 2);
    }

    // Collect trash
    const cellValue = Maze.cell(p.r, p.c);
    if (cellValue >= 2 && cellValue <= 4) {
      Trash.collectAt(p.r, p.c);
      GameState.trashCollected++;
      
      // Different trash types give different points
      const points = cellValue === 4 ? 20 : 10; // Oil spills worth more
      GameState.score += points;
      
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
        e.c = Utils.clamp(e.c + (Math.random() < 0.5 ? 2 : -2), 1, Maze.cols() - 2);

        if (GameState.lives <= 0) Game.over();
      }
    }

    // Update HUD
    document.getElementById("score").textContent = GameState.score;
    document.getElementById("trashCount").textContent = GameState.trashCollected;
    document.getElementById("lives").textContent = GameState.lives;
  }

  // RENDER STEP
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
          // wall tile - Pac-Man blue style
          ctx.fillStyle = "#1a4d5c";
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
          
          // Add border effect
          ctx.strokeStyle = "#2d7a8f";
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, y + 1, cell - 2, cell - 2);
        } else {
          // empty tile - dark ocean floor
          ctx.fillStyle = "#001520";
          ctx.fillRect(x, y, cell, cell);

          // Draw trash pellets with different types
          if (grid[r][c] === 2) {
            // Bottle
            drawBottle(ctx, x + cell / 2, y + cell / 2, cell * 0.3);
          } else if (grid[r][c] === 3) {
            // Plastic bag
            drawPlastic(ctx, x + cell / 2, y + cell / 2, cell * 0.35);
          } else if (grid[r][c] === 4) {
            // Oil spill
            drawOil(ctx, x + cell / 2, y + cell / 2, cell * 0.4);
          }
        }
      }
    }

    // Draw enemies (fish)
    for (const e of EnemySys.all()) {
      drawFish(ctx, e.x * cell + cell / 2, e.y * cell + cell / 2, cell * 0.6, e);
    }

    // Draw player
    Player.draw(ctx, cell);

    ctx.restore();
  }

  // Trash rendering functions
  function drawBottle(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    
    // Bottle body
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(-s * 0.3, -s * 0.5, s * 0.6, s);
    
    // Bottle cap
    ctx.fillStyle = "#CD853F";
    ctx.fillRect(-s * 0.2, -s * 0.7, s * 0.4, s * 0.3);
    
    // Highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(-s * 0.15, -s * 0.3, s * 0.1, s * 0.4);
    
    ctx.restore();
  }

  function drawPlastic(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    
    // Plastic bag shape
    ctx.fillStyle = "rgba(200, 200, 200, 0.7)";
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.5, s * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Handles
    ctx.strokeStyle = "rgba(180, 180, 180, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-s * 0.3, -s * 0.5, s * 0.2, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.3, -s * 0.5, s * 0.2, 0, Math.PI);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawOil(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    
    // Oil spill - irregular blob
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(0.5, "#2d2d2d");
    gradient.addColorStop(1, "rgba(45, 45, 45, 0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, Math.PI * 2);
    ctx.fill();
    
    // Iridescent effect
    ctx.fillStyle = "rgba(138, 43, 226, 0.2)";
    ctx.beginPath();
    ctx.arc(s * 0.2, -s * 0.2, s * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // Fish shape rendering with variety
  function drawFish(ctx, x, y, s, enemy) {
    ctx.save();
    ctx.translate(x, y);
    
    // Swimming animation
    const swimOffset = Math.sin(enemy.swimPhase) * 0.08;
    ctx.rotate(swimOffset);
    
    // Flip fish based on facing direction
    ctx.scale(enemy.facing, 1);

    // body
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.4, s * 0.3, 0, 0, Math.PI * 2);
    
    const gradient = ctx.createRadialGradient(-s * 0.1, -s * 0.1, 0, 0, 0, s * 0.4);
    gradient.addColorStop(0, enemy.type.color);
    gradient.addColorStop(1, adjustBrightness(enemy.type.color, -30));
    ctx.fillStyle = gradient;
    ctx.fill();

    // tail
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, 0);
    ctx.lineTo(-s * 0.6, -s * 0.25);
    ctx.lineTo(-s * 0.6, s * 0.25);
    ctx.closePath();
    ctx.fillStyle = enemy.type.color;
    ctx.fill();

    // eye
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(s * 0.15, -s * 0.05, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = "#222";
    ctx.arc(s * 0.17, -s * 0.05, s * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // fins
    ctx.beginPath();
    ctx.fillStyle = adjustBrightness(enemy.type.color, -20);
    ctx.ellipse(0, s * 0.2, s * 0.15, s * 0.25, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Helper to adjust color brightness
  function adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
      (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
      .toString(16).slice(1);
  }

  return {
    start,
    stop
  };

})();