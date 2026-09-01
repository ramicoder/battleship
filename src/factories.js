export function createShip(length, hits = 0) {

    let getLength = () => {
        return length;
    };

    let setLength = newLength => {
        length = newLength;
    };

    let getHits = () => {
        return hits;
    };

    let hit = () => hits++;

    let isSunk = () =>  {
        return hits >= length;
    }

    return { getLength, setLength, getHits, hit, isSunk };
}

export function createGameboard () {
    let board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    let placeShip = (ship, row, col, orientation) => {
            orientation = orientation.trim().toLowerCase();
            if (orientation === "vertical") {
                for (let i = row; i <= ship.getLength(); i++) {
                    if (isPositionValid(i, col)) {
                        board[i][col] = 1;
                    } else {
                        resetBoard(board);
                        throw new Error("Position is not valid");
                    }
                }
            } else if (orientation === "horizontal") {
                for (let i = col; i <= ship.getLength(); i++) {
                    if (isPositionValid(row, i)) {
                        board[row][i] = 1;
                    } else {
                        resetBoard(board);
                        throw new Error("Position is not valid");
                    }
                }
            } else {
                throw new Error("Orientation is not valid");
            }
        return board;
    }

    //let receiveAttack

    return {board, placeShip}
    
}

function isPositionValid (row, col) {
    if (row < 0 || row > 9 || col < 0 || col > 9) {
        return false;
    }
    return true;
}

function resetBoard (board) {
    board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
}