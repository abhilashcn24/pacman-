// utils.js - helper functions used across the game

window.Utils = (function () {

  return {
    // random float between a and b
    rand: function (a, b) {
      return a + Math.random() * (b - a);
    },

    // pick a random element from an array
    choose: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    // clamp a value between min and max
    clamp: function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
  };

})();
