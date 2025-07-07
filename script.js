console.log('Selamunaleykum Dunya')

const Player = function(name, marker) {
    this.name = name;
    this.marker = marker;
    this.score = 0;
}
Player.prototype.increaseScore = function() {
    this.score = this.score + 1;
}
Player.prototype.setName = function(newName) {
    this.name = newName;
}

const player1 = new Player("", "X");
const player2 = new Player('', 'O');

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

        if (parseInt(lastRowPlayed, 10) + parseInt(lastColumnPlayed, 10) == 2) {


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
    let currentRound = 0;
    let currentRoundWinner;
    let totalRounds;
    let startingPlayer = player2;
    let currentPlayer = startingPlayer;
    const setTotalRounds = function(rounds) {
        console.log(`Setting total rounds to ${rounds}`);
        totalRounds = rounds;
    }
    const newRound = function() {
        currentRound++;
        if(startingPlayer == player1) {
            startingPlayer = player2;
        } else {
            startingPlayer = player1;
        }
        currentPlayer = startingPlayer;
        console.log('Attention, attention, refree speaking!');
        console.log(`${startingPlayer.name} is starting the round.`);
        console.log(`We are at round ${currentRound} out of ${totalRounds}`);
        screenController.showRound();   
        screenController.showScore(); 

        gameBoard.initBoard();
        console.log(gameBoard.getBoard());

    }
    // newRound();
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
                    screenController.showScore();
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
                    // currentRound = currentRound + 1;
                    // newRound();
                    screenController.waitForNewRound();


                }

            } else{
                switchToNextPlayer();
                console.log(gameBoard.getBoard());
            }

        }
    }

    const getTotalRounds = function() {
        return totalRounds;
    }

    const getCurrentRound = function(){
        return currentRound;
    }


    return {setTotalRounds, getCurrentPlayer, setActionForCurrentPlayer, getCurrentRound, newRound, getTotalRounds }
}();




const screenController = function() {
    let settingsForm;
    let player1Input;
    let player2Input;
    let totalRoundsInput;
    let totalRoundsText;
    const defaultPlayer1Name = 'Alice';
    const defaultPlayer2Name = 'Bob';
    const defaultTotalRounds = '2';

    // Caching up the view DOM's and indexing them
    const viewDOMList = document.querySelectorAll('.view');
    const viewDOMHash = {
        addDOM(domElement){
            this[domElement.id] = domElement;
        }
    }
    viewDOMList.forEach(view => {
        viewDOMHash.addDOM(view);
    })
    // 
    let boardGrid;
    let gridDOM;
    let scoreDOM;
    let roundDOM;

    let nextRoundButton;
    const initController = function() {
        showView('settings-view')
        // Does the necessary caching for the DOM elements
        settingsForm = document.querySelector('.settings-form');
        player1Input = document.getElementById('player1-name');
        player2Input = document.getElementById('player2-name');


        player1Input.placeholder = defaultPlayer1Name;
        player2Input.placeholder = defaultPlayer2Name;

        totalRoundsInput = document.getElementById('total-rounds-input');
        totalRoundsInput.value = defaultTotalRounds;
        totalRoundsText = document.getElementById('total-rounds-text');
        totalRoundsText.textContent = defaultTotalRounds;
        totalRoundsInput.addEventListener('input', (event) => {
            totalRoundsText.textContent = (event.target.value);
        })



        // Caching the board
        boardGrid = document.querySelector(".game-board");

        scoreDOM = document.querySelector('.score-text');

        roundDOM = document.querySelector('.round-text');
        nextRoundButton = document.getElementById('next-round-button');
        // Select all elements with class 'box'
        const boxes = boardGrid.querySelectorAll('.box');
        // Create a 2D array for gridDOM
        gridDOM = [[], [], []];
        boxes.forEach(box => {
            const row = parseInt(box.dataset.row, 10);
            const col = parseInt(box.dataset.col, 10);
            gridDOM[row][col] = box;
        });
        // console.log(gridDOM);

        // Add Event Listeners
         boardGrid.addEventListener('click', (event) => {
            clickHandlerBoard(event.target.closest('.box'));

        });
        settingsForm.addEventListener('submit', (event) => {
            submitHandleSettings(event);
        })

        nextRoundButton.addEventListener('click', (event)=> {
            gameRefree.newRound();
            nextRoundButton.classList.add('hidden');
            drawGameBoard();
        })
    }

    const showView  = function(viewId) {
        // viewId is the string of the id of the view section desired to be shown
        // The rest of the sections are hidden
        viewDOMList.forEach(view => {
            view.classList.add('hidden');
        })

        viewDOMHash[viewId].classList.remove('hidden');
        console.log(viewDOMHash[viewId])

    }
    const waitForNewRound = function() {
        nextRoundButton.classList.remove('hidden');

    }
    const submitHandleSettings = function(event) {
        // Setting up the game based in the data read in the settings-form
        event.preventDefault();
        const formData = new FormData(event.target);
        player1.setName(formData.get('player1-name') || defaultPlayer1Name);
        player2.setName(formData.get('player2-name') || defaultPlayer2Name);
        console.log(`Player 1 Name is : ${player1.name}`);
        
        console.log(`Player 2 Name is : ${player2.name}`);
        gameRefree.setTotalRounds(formData.get('total-rounds-input'));

        gameRefree.newRound();
        showView('main-game-view');

    }
    const clickHandlerBoard = function(eventTargetBox){
        const row = eventTargetBox.dataset.row;
        const column = eventTargetBox.dataset.col;
        console.log(`Cliked on Row: ${row}, Column: ${column}`);
        gameRefree.setActionForCurrentPlayer(row, column);
        drawGameBoard();


    }
    const drawGameBoard= function() {
        const currentBoard = gameBoard.getBoard();
        for(let col = 0; col <= 2; col++) {
            for(let row = 0; row <= 2; row++){
                gridDOM[row][col].innerHTML = "";
                const icon = document.createElement('img')
                switch (currentBoard[row][col]) {
                    case "X":
                        // console.log(`Drawing X at Row: ${row} Col: ${col}`)
                        icon.src = "./icons/icons8-cross.svg"
                        break;
                    case "O":
                        // console.log(`Drawing O at Row: ${row} Col: ${col}`)
                        icon.src = "./icons/icons8-round.svg"
                    default:
                        break;
                }
                gridDOM[row][col].appendChild(icon);
            }
        }


    }

    const showScore = function() {
        scoreDOM.textContent = `${player1.name}: ${player1.score} vs ${player2.name}: ${player2.score}`;

    }
    const showRound = function() {
        roundDOM.textContent = `Round: ${gameRefree.getCurrentRound()} of ${gameRefree.getTotalRounds()}`;
    }
    return {initController, drawGameBoard, showScore, showRound, showView, waitForNewRound};
}();

const main = function() {
    screenController.initController();


}();






