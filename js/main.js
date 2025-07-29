(function (window) {
    'use strict';

    window.addEventListener('DOMContentLoaded', () => {
        // Check if window.game exists
        if (!window.game) {
            console.error('Game object not found. Make sure game.js is loaded before this script.');
            return;
        }

        // Check if window.game.analyzeBoard exists
        if (!window.game.analysis) {
            console.error('Game analysis object not found. Make sure board-analysis.js is loaded before this script.');
            return;
        }

        game.init();
    });

})(window);
