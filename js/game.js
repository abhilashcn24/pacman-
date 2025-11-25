// game.js - high level init, GameState and UI wiring

const GameState = {
  score: 0,
  trashCollected: 0,
  lives: 3
};

const Game = (function () {

  function init() {
    // build maze and initial objects
    Maze.create();
    Player.setPos(Math.floor(Maze.rows() / 2), Math.floor(Maze.cols() / 2));
    EnemySys.reset();
    EnemySys.spawn(3);

    // UI buttons
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");

    startBtn.addEventListener("click", start);
    restartBtn.addEventListener("click", restart);

    // ensure initial HUD reflects state
    updateHUD();
  }

  function start() {
    // resume audio context on user gesture (some browsers require this)
    if (AudioSys && AudioSys.ctx && AudioSys.ctx.state === "suspended") {
      AudioSys.ctx.resume();
    }

    // hide overlays
    document.getElementById("menu").classList.add("hide");
    document.getElementById("endOverlay").classList.add("hide");

    // reset state
    GameState.score = 0;
    GameState.trashCollected = 0;
    GameState.lives = 3;

    // regenerate maze & reset actors
    Maze.create();
    Player.setPos(Math.floor(Maze.rows() / 2), Math.floor(Maze.cols() / 2));
    EnemySys.reset();
    EnemySys.spawn(3);

    // start audio and engine
    AudioSys.startBackgroundLoop();
    Engine.start();

    updateHUD();
  }

  function restart() {
    // show menu so user can re-start (keeps same flow)
    document.getElementById("endOverlay").classList.add("hide");
    document.getElementById("menu").classList.remove("hide");
  }

  function over() {
    // called when lives <= 0
    Engine.stop();
    AudioSys.playGameOver();

    // show end overlay with stats
    const endOverlay = document.getElementById("endOverlay");
    endOverlay.classList.remove("hide");
    document.getElementById("endTitle").textContent = "Game Over";
    document.getElementById("endDetails").textContent =
      `Score: ${GameState.score} • Trash: ${GameState.trashCollected}`;
  }

  function updateHUD() {
    document.getElementById("score").textContent = GameState.score;
    document.getElementById("trashCount").textContent = GameState.trashCollected;
    document.getElementById("lives").textContent = GameState.lives;
  }

  // Expose a few helpers so engine or other modules can update state
  return {
    init,
    start,
    restart,
    over,
    updateHUD,
    GameState
  };
})();

// Make Game globally available (Engine uses Game.over / GameState)
window.Game = Game;
window.GameState = Game.GameState || {
  score: 0,
  trashCollected: 0,
  lives: 3
};

// initialize on load
window.addEventListener("load", () => {
  Game.init();
});
