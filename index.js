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
    let gameboard = [['', '', ''], ['', '', ''], ['', '', '']];

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
    const resetBoard = () => gameboard = [['', '', ''], ['', '', ''], ['', '', '']];
    return {getNumberOfMoves, setNumberOfMoves, setBoard, getBoard, resetBoard};

})();


const Game = (function () {
    console.log("Welcome to tic tac toe game");
    
    const playerOne = Player("Ibrahim", 'X');
    const playerTwo = Player("Computer", 'O');
    
    playerOne.setTurn(); // set human player to play first

    const handleTurns = (element) => {
        let row, column;
        let playerMark, playerName;
        let gameboard = Gameboard.getBoard();
        if (playerOne.getTurn()) {
            playerMark = playerOne.getMark();
            playerName = playerOne.getName();

            row = element.target.parentElement.classList[1].split('-')[1];
            column = element.target.classList[1].split('-')[1];
            if (gameboard[row][column] === 'X' || gameboard[row][column] === 'O') {
                console.log('grid already is filled');
            } else {
                Gameboard.setBoard(row, column, playerMark);
                DisplayController.draw(row, column, playerMark);

                playerOne.setTurn();
                playerTwo.setTurn();
            }
        }
        if (Gameboard.getNumberOfMoves() >= 5 && determineWinner(playerMark, playerName)) {
            playerOne.setTurn();
            playerTwo.setTurn();

            Gameboard.resetBoard();
            DisplayController.resetGrid();
        }  
        if (playerTwo.getTurn()) {
            
            playerMark = playerTwo.getMark();
            playerName = playerTwo.getName();
            
            do {
                [row, column] = [(Math.trunc(Math.random() * 10)) % 3, (Math.trunc(Math.random() * 10)) % 3];
            } while (gameboard[row][column] === 'X' || gameboard[row][column] === 'O');
            
            Gameboard.setBoard(row, column, playerMark);
            DisplayController.draw(row, column, playerMark);

            playerTwo.setTurn();
            playerOne.setTurn();
        }
        console.log(gameboard);

    };

    const determineWinner = (playerMark, playerName) => {
        let gameboard = Gameboard.getBoard();

        const verticalWinConditions = 3;
        let verticalWinBool = false;
        let verticalArr = [];
        let index = 0;
        // check vertical win condition
        while (index < verticalWinConditions && !verticalWinBool) {
            gameboard.forEach((element) => {
                verticalArr.push(element[index]);
            });
            console.log("Vertical arr: ", verticalArr);
            if (verticalArr.every((element) => element === playerMark)) verticalWinBool = true;
            console.log("Player mark: ", playerMark);
            verticalArr = [];
            index++;
        }
        // check horizontal win condition
        let horizontalWinBool = false;
        let horizontalArr = [];
        gameboard.forEach((outerElement) => {
            outerElement.forEach((element) =>{
                horizontalArr.push(element);
            });
            if (horizontalArr.every((element) => element === playerMark)) horizontalWinBool = true;
            horizontalArr = [];
        });
        // check diagonal win condition, first in left to right order then in reverse
        let diagonalWinBool = false;
        let daigonalArr = [];
        index = 0;
        gameboard.forEach((outerElement) => {
            daigonalArr.push(outerElement[index]);
            index++;
        });
        if (daigonalArr.every((element) => element === playerMark)) diagonalWinBool = true;
        daigonalArr = [];
        index = -1;
        gameboard.forEach((outerElement) => {
            daigonalArr.push(outerElement.at(index));
            index--;
        });
        if (daigonalArr.every((element) => element === playerMark)) diagonalWinBool = true;

        // check if any win condition is true, declare winner and return true.
        console.log(`Vertical Win state: ${verticalWinBool} || Horizontal Win state: ${horizontalWinBool} || Diagonal Win state: ${diagonalWinBool}`);
        if (verticalWinBool || horizontalWinBool || diagonalWinBool) {
            console.log(`We have a winner ${playerName}, ${playerMark}`);
            return true;
        }
        return false;
    }

    return {handleTurns};
})();

const DisplayController = (function () {
    const gridContainer = document.querySelector('.grid-container');

    const CELLCOUNT = 3;
    const ROWCOUNT = 3;
    const createGrid = () => {
        for (let rowCounter = 0; rowCounter < ROWCOUNT; rowCounter++) {
            let row = document.createElement('div');
            row.classList.add(`row` ,`row-${rowCounter}`);

            for (let cellCounter = 0; cellCounter < CELLCOUNT; cellCounter++) {
                let cell = document.createElement('div');
                cell.classList.add(`cell`, `cell-${cellCounter}`);
                cell.innerText = '';
                cell.addEventListener('click', Game.handleTurns);
                row.append(cell);
                gridContainer.append(row);
            };
        }
    }
    const draw = (row, column, playerMark) => {
        gridContainer.children[row].children[column].innerText = playerMark;
    }
    const resetGrid = () => {
        gridContainer.childNodes.forEach((element) => {
            element.childNodes.forEach((innerElement) => {
                innerElement.innerText = '';
            })
        });
    }
    createGrid();
    return {draw, resetGrid};
})();
