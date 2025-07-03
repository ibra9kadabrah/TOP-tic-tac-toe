const Player = function (name, mark) {
    let turn = false;

    const getTurn = () => turn;
    const setTurn = () => {
        if (turn === false) turn = true;
        else turn = false;
    };

    const getName = () => name;
    const getMark = () => mark;

    const notifyCreation = () => console.log(`PLayer ${name} Created with mark: ${mark}`);
    notifyCreation();

    return {getName, getMark, getTurn, setTurn};
}


const Gameboard = (function () {
    let gameboard = [
        [],
        [],
        []
    ];

    gameboard.forEach((element) => {
        element[0] = '';
        element[1] = '';
        element[2] = '';
    })

    let numberOfMoves = 0;
    const getNumberOfMoves = () => numberOfMoves;
    const setNumberOfMoves = () => {
        numberOfMoves++;
    }

    const setBoard = (row, column, mark) => {
        gameboard[row][column] = mark;
        setNumberOfMoves();
    }
    const getBoard = () => gameboard;

    return {getNumberOfMoves, setNumberOfMoves, setBoard, getBoard};

})();

const Game = (function () {
    console.log("Welcome to tic tac toe game");
    
    const playerOne = Player("Ibrahim", 'X');
    const playerTwo = Player("Computer", 'O');
    
    playerOne.setTurn(); // set human player to play first

    const handleTurns = () => {
        console.log("Here")
        let move, row, column;
        // because first turn is for human player. a better solution is to have a global variable or passing the correct function here from somewhere else 
        let playerMark = playerOne.getMark(); 
        let playerName = playerOne.getName();

        while (Gameboard.getNumberOfMoves() < 18 && !determineWinner(playerMark, playerName)) {
            let gameboard = Gameboard.getBoard();
            if (playerOne.getTurn()) {
                playerMark = playerOne.getMark();
                playerName = playerOne.getName();

                move = prompt("Enter position of move, for example: 0,1 (first row, second column) ").split(','); // TODO: needs error checking;
                [row, column] = move;
                
                Gameboard.setBoard(row, column, playerMark)
                
                playerOne.setTurn();
                playerTwo.setTurn();
            } else {
                playerMark = playerTwo.getMark();
                playerName = playerTwo.getName();

                do {
                    move = [(Math.trunc(Math.random() * 10)) % 3, (Math.trunc(Math.random() * 10)) % 3];
                    [row, column] = move;
                } while (gameboard[row][column] === 'X' || gameboard[row][column] === 'O');

                Gameboard.setBoard(row, column, playerMark)
                
                playerTwo.setTurn();
                playerOne.setTurn();
            }
            Gameboard.setBoard(row, column, playerMark);
        }
    };

    const determineWinner = (playerMark, playerName) => {
        let gameboard = Gameboard.getBoard();
        console.log(gameboard);
        // check vertical win conditions
        const verticalWinConditions = 3;
        let verticalWinBool = true;
        let index = 0;
        while (index < verticalWinConditions && verticalWinBool) {
            gameboard.forEach((element, arrIndex) => {
                console.log(element ," + ", arrIndex);
                console.log(element[index]); 
                if (element[index] !== playerMark) verticalWinBool = false; // logic problem
            });
            index++;
        };
        // check horizontal win conditons
        let horizontalWinBool = true;
        gameboard.forEach((outElement) => {
            outElement.forEach((element) => {
                if (element !== playerMark) horizontalWinBool = false;
            });
        });
        // check diagonal win conditions
        const diagonalWinConditions = 2;
        let diagonalWinBool = true;
        index = 0;
        while (index < diagonalWinConditions && diagonalWinBool) {
            gameboard.forEach((element) => {
                if (element[index] !== playerMark) diagonalWinBool = false;
                index++;
            });
            index = -1;
            gameboard.forEach((element) => {
                if (element[index] !== playerMark) diagonalWinBool = false;
                index--;
            })
            index = Math.abs(index);
        }
        console.log(`Winning conditions are. vertical; ${verticalWinBool}, horizontal: ${horizontalWinBool}, diagonal: ${diagonalWinBool}`);
        if (verticalWinBool || horizontalWinBool || diagonalWinBool) {
            console.log(`We have a winner. Winner is ${playerName}`);
            return true;
        }
        return false;
    };
    handleTurns();
})();
