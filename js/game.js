(function (window) {
    'use strict';

    gameConfig = window.gameConfig || {};

    window.game = {
        statusElm: document.getElementById('status'),
        difficultyElm: document.getElementById('difficulty-select'),
        inGame: false,
        players: gameConfig.players ? gameConfig.players : null,        
        levelsRandomizerPcts: gameConfig.levelsRandomizerPcts ? gameConfig.levelsRandomizerPcts : null,
        $controls: {
            start: document.getElementById('start-button')
        },
        $cells: [
            document.getElementById('cell-0'),
            document.getElementById('cell-1'),
            document.getElementById('cell-2'),
            document.getElementById('cell-3'),
            document.getElementById('cell-4'),
            document.getElementById('cell-5'),
            document.getElementById('cell-6'),
            document.getElementById('cell-7'),
            document.getElementById('cell-8')
        ],
        
        /**
         * Initializes the game by setting up the board and clearing old game data (if any).
         */
        setupGame: () => {
            if (!game.players || !game.levelsRandomizerPcts) {
                console.error(
                    'Game configuration is missing players or levelsRandomizerPcts. ' + 
                    'Please ensure game-config.js is filled with the correct data.'
                );
                game.statusElm.textContent = 'Game requires configuration... please check game-config.js.';
                return;
            }
            game.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            game.statusElm.textContent = 'Select a cell to start playing!';
            game.boardLocked = false;
            for (let i = 0; i < game.$cells.length; i += 1) {
                game.$cells[i].innerText = '';
                game.$cells[i].style.backgroundColor = '';
            }
            game.level = game.difficultyElm.value;
            game.inGame = true;
        },

        /**
         * Checks the game board for a winner and ends the game if a winner is found.
         */
        checkForWinner: () => {
            let isOverAfterMove = game.analysis.checkForWinner();
            let addS = '';
            if (isOverAfterMove.winner) {
                game.inGame = false;
                if (isOverAfterMove === 'CAT') {
                    addS = 's';
                }
                game.statusElm.textContent = game.players[isOverAfterMove.winner] + ' win' + addS + '!';
                for (let i = 0; i < isOverAfterMove.strike.length; i += 1) {
                    game.$cells[isOverAfterMove.strike[i]].style.backgroundColor = 'lavender';
                }
                return;
            }
        },

        /**
         * Makes the AI move based on the current game state and checks for a winner.
         */
        makeAIMove: () => {
            let aiMove = null;
            if (game.inGame) {    
                aiMove = game.analysis.analyzeBoard();
                game.boardLocked = true; // Lock the board to prevent further moves until AI plays
                game.board[aiMove] =  -1;
                game.$cells[aiMove].textContent = 'O';
                game.boardLocked = false; // Unlock the board after AI plays
                game.checkForWinner();
            }
        },

        /**
         * Handles the player's move by updating the board and checking for a winner.
         * 
         * @param {number} i The index of the cell where the player wants to make a move.
         */
        makePlayerMove: (i) => {
            let haveWinner = false;
            if (game.board[i] === 0) {
                game.board[i] =  1;
                game.$cells[i].textContent = 'X';
            } else {
                alert('Cell already taken! Try a different cell.');
                return;
            }
            game.checkForWinner();
            if (!haveWinner) {
                game.makeAIMove();
            }
        },

        /**
         * Handles the user's move by updating the board if the game is active.
         * 
         * @param {Event} e The click event triggered by the user.
         * @param {number} i The index of the cell where the user clicked.
         */
        handleUserMove: (e, i) => {
            const cell = e.target;
            
            // If not in an active game, do nothing.
            if (!game.inGame || game.boardLocked) {
                return;
            }
            // If in an active game, make the move in the cell.
            game.makePlayerMove(i);
        },

        addMoveListener: (i) => {
            game.$cells[i].addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                game.handleUserMove(e, i);
            });
        },

        /**
         * Listens for events on the game controls and cells.
         */
        listenForEvents: () => {
            game.$controls.start.addEventListener('click', (e) => {
                game.setupGame();
            });
            for (let i = 0; i < game.$cells.length; i += 1) {
                game.addMoveListener(i);
            }
        },

        /**
         * Initializes the game by listening for game events.
         */
        init: () => {
            game.listenForEvents();        
        }
    
    };

})(window);

