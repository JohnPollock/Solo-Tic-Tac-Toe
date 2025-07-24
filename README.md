# Solo-Tic-Tac-Toe
Play Tic Tac Toe against the AI 

Uses a simple rules-based AI with three difficulty levels. At this time, it does not do more complex 
calculations of forks or patterns, but does try to grab the center, go for winning moves, block winning
moves, and check for empty corner squares if the center is taken and no near-wins are imminent.

## Configuration

There is a *game-config.js* file in the *js* folder which contains default configurations. At this time,
the player identities and difficulty settings for the three levels can be adjusted if desired by editing
this file (more options may be available in the future).

### Player Identities

```
players: {
    "X": "You",
    "O": "I",
    "CAT": "CAT"
},
```
Currently, "X" is always the player. "O" is always the AI, and just provides the way the game will describe the player. Feel free to change the default values from "You", "I", and "CAT" if desired. 
when a win occurs. 
        
### Difficulty Level 
```
levelsRandomizerPcts: {
    easy: 0.50,
    medium: 0.80,
    hard: 0.95
}
```
You can change the value of each of these to increase/decrease the AI's chances of selecting the "best" 
move on any given turn. Lowest: 0.00, Highest 1.00. Note that given the limitiations of what is currently
being checked by the AI, even the "best" move may not be the actual "best" move in reality, so even with a 
setting of 1.00 the AI can choose something that allows the player to gain the advantage. If the AI gets 
updated in the future, that might mean some changes to these values would be desired to fit to the levels 
as desired.
