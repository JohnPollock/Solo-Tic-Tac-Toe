
(function (window) {
    'use strict';

    if (!window.game) {
        console.error('Game object not found. Make sure game.js is loaded before this script.');
        return;
    }   

    window.game.analysis = {

        /**
         * Gets a random empty cell index from the game board.
         * 
         * @returns {number|null} Returns a random empty cell index or null if no empty 
         *                        cells are available.
         */
        getRandomEmptyCell: () => {
            let emptyCells = [];
            for (let i = 0; i < game.board.length; i += 1) {
                if (game.board[i] === 0) {
                    emptyCells.push(i);
                }
            }
            if (emptyCells.length > 0) {
                let randomIndex = Math.floor(Math.random() * emptyCells.length);
                return emptyCells[randomIndex];
            } else { 
                return null; // No empty cells available
            }
        },

        /**
         * Gets a random empty corner square index from the game board.
         * 
         * @returns {number|null} Returns a random empty corner square index or null if no 
         *                        empty corners are available.
         */
        getRandomEmptyCornerSquare: () => {
            let corners = [0, 2, 6, 8]; 
            let randomIndex = null;

            corners = corners.filter((corner) => { 
                return game.board[corner] === 0; 
            });

            if (corners.length > 0) {
                randomIndex = Math.floor(Math.random() * (corners.length - 1));
                return corners[randomIndex];
            }

            return null; 
        },

        /**
         * Checks the game board for a winner.
         * 
         * @returns {boolean|object} Returns false if no winner is found, or an object with the
         *                           winner and the strike combination if a winner is found.
         */
        checkForWinner: () => {
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];
            let openEmptyCell = true;
            for (let w = 0; w < winningCombinations.length; w += 1) {   
                let sum = 0;
                for (let i = 0; i < winningCombinations[w].length; i += 1) {
                    sum += game.board[winningCombinations[w][i]];
                }
                if (sum === 3) {
                    return { winner: 'X', strike: winningCombinations[w] };                 
                } else if (sum === -3) {
                    return {winner: 'O', strike: winningCombinations[w] };
                }
            }
            openEmptyCell = game.analysis.getRandomEmptyCell();
            if (openEmptyCell === null) {
                return { winner: 'CAT', strike: [0, 1, 2, 3, 4, 5, 6, 7, 8] }; // Cat's game (draw) 
            }
            return false; // No winner yet
        },

        /**
         * Checks for a near win for either the AI or Player 1.
         * 
         * @returns {number|null} Returns the index of the cell that would lead to a win 
         *                        for the AI or Player 1,
         */
        checkForNearWin: () => {
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];
            let nearWins = {
                ai: {
                    status: false,
                    move: null
                },
                player1: {
                    status: false,
                    move: null
                }
            };
            // Check each winning combination for near wins
            for (let w = 0; w < winningCombinations.length; w += 1) {   
                let sum = 0;
                for (let i = 0; i < winningCombinations[w].length; i += 1) {
                    sum += game.board[winningCombinations[w][i]];
                }
                if (sum === -2) {
                    for (let i = 0; i < winningCombinations[w].length; i += 1) {
                        if (game.board[winningCombinations[w][i]] === 0) {
                            nearWins.ai.status = true;
                            nearWins.ai.move = winningCombinations[w][i]; 
                        }
                    }
                } else if (sum === 2) {
                    for (let i = 0; i < winningCombinations[w].length; i += 1) {
                        if (game.board[winningCombinations[w][i]] === 0) {
                            nearWins.player1.status = true;
                            nearWins.player1.move = winningCombinations[w][i];
                        }
                    }
                }
            }

            if (nearWins.ai.status) {
                return nearWins.ai.move; // Return the move for AI
            } else if (nearWins.player1.status) {   
                return nearWins.player1.move; // Return the move for Player 1
            }

            // If nothing found, return null
            return null;

        },

        /**
         * Analyzes the current board position to determine the best move.
         * 
         * Simple rules-based AI. Currently only checks for center square priority, near wins, 
         * empty corners, and defaults to a random empty cell if one of the above situations 
         * is not found or if the difficulty randomizer determines the AI will not make 
         * the "best" move on the current turn. 
         * 
         * Could be expanded to include more complex strategies, such as blocking the opponent's
         * forks, creating forks, or prioritizing certain patterns. Could also be improved when 
         * the center square does not get picked for an extended period of time (due to AI difficulty
         * randomizer not permitting the center pick + player not making the center pick), such that 
         * a near win might be available for the AI or Player 1 that would take priority over 
         * the center square.
         * 
         * @returns {number} Returns the index of the best move based on the current board state.
         */
        analyizePosition: () => {
            let move = null;
            let nearWin = game.analysis.checkForNearWin();
            let haveCorner = game.analysis.getRandomEmptyCornerSquare();
            if (nearWin !== null) {
                move = nearWin; // If there's a near win, take that move
                return move;
            } else if (haveCorner !== null) {
                move = haveCorner; // If there's an empty corner, return it
                return move;
            }
            move = game.analysis.getRandomEmptyCell();
            return move;
        },

        /**
         * Gets the best move for the AI based on the current board state.  
         * 
         * @returns {number} Returns the index of the best move.
         */
        getBestMove: () => {
            let move = 4; // Default to the center square
            if (game.board[4] === 0) {
                return move; 
            } else { 
                move = game.analysis.analyizePosition();
                return move;
            }
        },

        /**
         * Gets the best move or a random empty cell based on the level of difficulty.
         * 
         * @param {number} bestMove The index of the best move determined by the AI.
         *  
         * @returns {number|null} Returns the index of the best move or a random empty cell. 
         */
        getBestMoveOrRandomBlankSquare: (bestMove) => {
            let randomChance = Math.random();
            if (randomChance <= game.levelsRandomizerPcts[game.level]) {
                return bestMove;
            } else { 
                let randomCell = game.analysis.getRandomEmptyCell();
                if (!isNaN(parseInt(randomCell, 10))) {
                    return randomCell;
                } else {
                    return null; // No empty cells available
                }
            }
        },

        /**
         * Finds the best move for the AI based on the current board state.
         * 
         * @returns {number|null} Returns the index of the best move or null if no move is found.
         */
        findMove: () => {
            // Get the best move first
            let move = game.analysis.getBestMove();
            // Potentially reset the move based on the level of difficulty
            move = game.analysis.getBestMoveOrRandomBlankSquare(move);
            return move;
        },

        /**
         * Analyzes the board to determine the best move for the AI.
         * 
         * @returns {number|null} Returns the index of the best move based on the current board state.
         *                        If no move is found, returns null.
         */
        analyzeBoard: () => {
            let move = game.analysis.findMove();
            return move;
        }

    };

})(window);
