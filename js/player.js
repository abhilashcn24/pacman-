// player.js - submarine player with custom rendering

window.Player = (function () {

  const player = {
    r: Math.floor(15 / 2),
    c: Math.floor(19 / 2),
    mouthOpen: 0,
    direction: 0 // 0=right, 1=down, 2=left, 3=up
  };

  function setPos(r, c) {
    player.r = r;
    player.c = c;
  }

  function at() {
    return { r: player.r, c: player.c };
  }

  function setDirection(dir) {
    player.direction = dir;
  }

  function draw(ctx, cellSize) {
    const px = player.c * cellSize + cellSize / 2;
    const py = player.r * cellSize + cellSize / 2;
    const size = cellSize * 0.85;

    // Animate mouth opening/closing like Pac-Man
    player.mouthOpen = (performance.now() / 150) % (Math.PI * 2);
    const mouthAngle = Math.abs(Math.sin(player.mouthOpen)) * 0.3;

    ctx.save();
    ctx.translate(px, py);

    // Rotate based on direction
    const rotations = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
    ctx.rotate(rotations[player.direction]);

    // Draw submarine body (Pac-Man style circle with mouth)
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, mouthAngle, Math.PI * 2 - mouthAngle);
    ctx.lineTo(0, 0);
    ctx.closePath();
    
    // Gradient fill for depth
    const gradient = ctx.createRadialGradient(-size * 0.1, -size * 0.1, size * 0.1, 0, 0, size / 2);
    gradient.addColorStop(0, '#4de2d8');
    gradient.addColorStop(1, '#2ec4b6');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add outline
    ctx.strokeStyle = '#1a9d8e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw eye
    ctx.beginPath();
    ctx.fillStyle = '#042';
    ctx.arc(size * 0.15, -size * 0.15, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(size * 0.18, -size * 0.18, size * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Submarine periscope/antenna
    ctx.beginPath();
    ctx.strokeStyle = '#1a9d8e';
    ctx.lineWidth = 3;
    ctx.moveTo(0, -size * 0.35);
    ctx.lineTo(0, -size * 0.5);
    ctx.stroke();

    ctx.restore();
  }

  return {
    setPos,
    at,
    draw,
    setDirection,
    player
  };

})();