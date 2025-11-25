// player.js - player position, movement, and custom image rendering

window.Player = (function () {

  // IMPORTANT: Your uploaded image path
  // You can replace this with: "assets/images/player.png"
  const PLAYER_IMAGE_PATH = "/mnt/data/868ffaa3-d239-493a-b1d6-e00f8d8c998c.png";

  const img = new Image();
  img.src = PLAYER_IMAGE_PATH;

  const player = {
    r: Math.floor(15 / 2),
    c: Math.floor(19 / 2),
    nextDir: null,
    size: 1
  };

  function setPos(r, c) {
    player.r = r;
    player.c = c;
  }

  function at() {
    return { r: player.r, c: player.c };
  }

  function draw(ctx, cellSize, ox, oy) {
    const px = player.c * cellSize + cellSize / 2 + ox;
    const py = player.r * cellSize + cellSize / 2 + oy;
    const size = cellSize * 0.85;

    if (img.complete && img.naturalWidth) {
      // draw your custom player image
      ctx.drawImage(img, px - size / 2, py - size / 2, size, size);
    } else {
      // fallback: simple colored submarine
      ctx.beginPath();
      ctx.fillStyle = "#2ec4b6";
      ctx.arc(px, py, size / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "#cfeeea";
      ctx.arc(px + size * 0.12, py - size * 0.12, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return {
    setPos,
    at,
    draw,
    img,
    player
  };

})();
