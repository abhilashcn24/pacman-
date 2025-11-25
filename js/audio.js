// audio.js — WebAudio-based sound system
// Handles background loop, eat sound, and game-over jingle

window.AudioSys = (function () {

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();

  let bgInterval = null;

  return {

    ctx,

    // simple repeating melody loop
    startBackgroundLoop: function () {
      if (bgInterval) return;

      bgInterval = setInterval(() => {
        this._tone(220, 0.12, 0.02);
        this._tone(330, 0.12, 0.02, 0.12);
        this._tone(440, 0.12, 0.02, 0.24);
      }, 620);
    },

    stopBackgroundLoop: function () {
      if (bgInterval) {
        clearInterval(bgInterval);
        bgInterval = null;
      }
    },

    // internal helper for playing tones
    _tone: function (freq, dur, vol, when = 0, type = "sine") {
      const t = ctx.currentTime + when;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur);
    },

    // sound when trash is eaten
    playEat: function () {
      this._tone(700, 0.06, 0.06, 0, "square");
      this._tone(880, 0.08, 0.04, 0.06);
    },

    // game over jingle
    playGameOver: function () {
      this.stopBackgroundLoop();

      this._tone(220, 0.25, 0.12, 0, "sawtooth");
      this._tone(176, 0.25, 0.12, 0.25, "sawtooth");
      this._tone(164, 0.50, 0.12, 0.50, "sawtooth");
    }

  };

})();
