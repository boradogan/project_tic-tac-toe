console.log('Selamunaleykum Dunya')

const Player = function(name, marker) {
    this.name = name;
    this.marker = marker;
    this.score = 0;
}
Player.prototype.increaseScore = function() {
    this.score = this.score + 1;
}

player1 = new Player("Alice", "X");
player2 = new Player('Bob', 'O');

const gameBoard = function() {
    let round = 1;
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const initBoard = function(){
        console.log()
        board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
        ];
        round = 1;

    }
    const isMoveValid = function(row, column) {
        return (board[row][column] == "")? true: false;
    }

    const getBoard = function() {
        // Returns the current state of the board.
        return board;
    }
    let lastRowPlayed;
    let lastColumnPlayed;


    const playTurn = function(player, row, column) {
        // Let's the player play in a given spot, return if the move is valid.
        if( isMoveValid(row, column)){
            board[row][column] = player.marker;
            // Store the last played row and column for easy win condition check
            lastRowPlayed = row;
            lastColumnPlayed = column;
            round = round + 1;
            return true;
        } else {
            console.log('Invalid Move');
            return false;
        }
    }
    const isGameFinished = function() {
        // returns the winning player if the game is finished, otherwise returns false;
        lastPlayedSymbol = board[lastRowPlayed][lastColumnPlayed];
        let list_check;
        // start by checking horizontal first
        if (board[lastRowPlayed].every(symbol => symbol === lastPlayedSymbol)) {
        return true;
    }

        // check vertical
        const columnToCheck = [board[0][lastColumnPlayed], board[1][lastColumnPlayed], board[2][lastColumnPlayed]];
        if (columnToCheck.every(symbol => symbol === lastPlayedSymbol)) {
            return true;
        }


        // check diagonal 1
        if (lastColumnPlayed === lastRowPlayed){
            list_check = [0, 1, 2].map(n => board[n][n]);
            if(list_check.every(symbol => symbol == lastPlayedSymbol)){
                return true;
            }

        }

        // check diagonal 2

        if (lastRowPlayed + lastColumnPlayed === 2) {

            list_check = [0, 1, 2].map(n => board[2 - n][n]);
            if(list_check.every(symbol => symbol == lastPlayedSymbol)){
                return true;
            }
        }
        // Check for a tie
        if (round > 9) {
            console.log("It's a tie!");
            return 'tie';
        }

        return false;
    }

    return {initBoard, getBoard, playTurn, isGameFinished };

}();

const gameRefree = function() {
    // The game will be 4 rounds by default
    let currentRound = 1;
    let currentRoundWinner;
    let totalRounds = 4;
    let startingPlayer = player2;
    let currentPlayer = startingPlayer;
    const setTotalRounds = function(rounds) {
        totalRounds = rounds;
    }
    const newRound = function() {
        if(startingPlayer == player1) {
            startingPlayer = player2;
        } else {
            startingPlayer = player1;
        }
        currentPlayer = startingPlayer;
        console.log('Attention, attention, refree speaking!');
        console.log(`${startingPlayer.name} is starting the round.`);
        console.log(`We are at round ${currentRound} out of ${totalRounds}`);
        gameBoard.initBoard();
        console.log(gameBoard.getBoard());

    }
    newRound();
    // const setStartingPlayer = function(player) {
    //     if(currentRound != 1) {
    //         throw new Error("You cannot set the starting player at this point.");
    //     }
    //     startingPlayer = player;
    //     currentPlayer = startingPlayer;
    // }
    const getCurrentPlayer = function() {
        return currentPlayer;
    }

    const switchToNextPlayer = function () {
        if(currentPlayer == player1) {
            currentPlayer = player2;
            console.log(`It is ${player2.name}'s turn.`);
        } else {
            currentPlayer = player1;
            console.log(`It is ${player1.name}'s turn.`);
        }
    }

    const setActionForCurrentPlayer = function (row, column) {
        // This is the function to be called wh
        
        if(gameBoard.playTurn(currentPlayer, row, column)){
            // The round is played successfully.
            gameFinishStatus = gameBoard.isGameFinished(); // Either true false or tie
            // The winner will be a player only if the current round is finished.
            if(gameFinishStatus) {
                // Handling round finish.
                if(gameFinishStatus != 'tie'){
                    console.log(`${currentPlayer.name} has won the round.`);
                    currentPlayer.increaseScore();

                }else{
                    console.log(`It's a tie.`)
                }
                console.log(gameBoard.getBoard());
                console.log(`Scoreboard: ${player1.name}: ${player1.score} vs ${player2.name}: ${player2.score} `);

                if(currentRound == totalRounds) {
                    console.log(`The game finished today.`);
                    if(player1.score > player2.score) {
                        console.log(`The winner is ${player1.name}`);
                    } else if (player1.score < player2.score) {
                        console.log(`The winner is ${player2.name}`);
                    } else {
                        console.log('We call it a tie for today.');
                    }
                } else {
                    currentRound = currentRound + 1;
                    newRound();


                }

            } else{
                switchToNextPlayer();
                console.log(gameBoard.getBoard());
            }

        }
    }

    const getCurrentRound = function(){
        return currentRound;
    }


    return {setTotalRounds, getCurrentPlayer, setActionForCurrentPlayer, getCurrentRound }
}();