export function createShip(length, hits = 0) {
  let id = length;

  let getLength = () => {
    return length;
  };

  let setLength = (newLength) => {
    length = newLength;
  };

  let getHits = () => {
    return hits;
  };

  let hit = () => hits++;

  let isSunk = () => {
    return hits >= length;
  };

  let getId = () => id;

  return { getLength, setLength, getHits, hit, isSunk, getId };
}

export function createGameboard() {
  let missedShots = [];
  let ships = [];
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  let getMissedShots = () => missedShots;

  let placeShip = (ship, row, col, orientation) => {
    try {
      if (ships.find((s) => s === ship) !== undefined) {
        throw new Error("Ship with this length already exists");
      }

      orientation = orientation.trim().toLowerCase();
      if (orientation === "vertical") {
        for (let k = row; k < row + ship.getLength(); k++) {
          if (!isPositionValid(k, col)) {
            throw new Error("Position is not valid");
          }
        }
        for (let i = row; i < row + ship.getLength(); i++) {
          board[i][col] = ship.getId();
        }
      } else if (orientation === "horizontal") {
        for (let k = col; k < col + ship.getLength(); k++) {
          if (!isPositionValid(row, k)) {
            throw new Error("Position is not valid");
          }
        }

        for (let i = col; i < col + ship.getLength(); i++) {
          board[row][i] = ship.getId();
        }
      } else {
        throw new Error("Orientation is not valid");
      }
      ships.push(ship);
      console.log(`Console Logic: Ship ${ship.getId()} got placed at ${row}, ${col} with orientation ${orientation}`);
      return board;
    } catch (err) {
        console.log(err.message)
        return null;
    }
  };

  let receiveAttack = (x, y) => {

    try {
      if (x < 0 || x > 9 || y < 0 || y > 9) {
        throw new Error("Position is not valid");
      }
      if (board[x][y] === -1) {
        return null;
      }
      if (board[x][y] === 0) {
        missedShots.push([x, y]);
        board[x][y] = -1;
        return false;
      } else {
        let ship = ships.find((ship) => ship.getId() === board[x][y]);
        ship.hit();
        board[x][y] = -1;
        return true;
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  let allShipsSunk = () => {
    console.log(ships);
    if (ships.find((s) => s.isSunk() === false)) return false;
    return true;
  }

  function removeShip(ship) {
    ships.splice(ships.indexOf(ship), 1);
    let id = ship.getId();
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (board[r][c] === id) {
          board[r][c] = 0;
        }
      }
    }
  }

  let changeOrientation = (ship) => {
    let id = ship.getId();
    let startRow = -1;
    let startCol = -1;
    let currentOrientation = "";

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (board[r][c] === id) {
          startRow = r;
          startCol = c;

          if (c + 1 < 10 && board[r][c + 1] === id) {
            currentOrientation = "horizontal";
          } else {
            currentOrientation = "vertical";
          }
          break;
        }
      }
      if (startRow !== -1) break;
    }
    removeShip(ship);
    let newOrientation =
      currentOrientation === "horizontal" ? "vertical" : "horizontal";

    let success = placeShip(ship, startRow, startCol, newOrientation);

    if (success === null) {
      placeShip(ship, startRow, startCol, currentOrientation);
      return false;
    }
    console.log(`Console Logic: Ship ${ship.getId()}'s orientation switched to ${newOrientation}`);
    return board;
  }

  function isPositionValid(row, col) {
    if (row < 0 || row > 9 || col < 0 || col > 9 || board[row][col] !== 0) {
      return false;
    }
    return true;
  }

  let allShipsPlaced = () => {
    if (ships.length === 5) return true;
    return false;
  }

  return { board, getMissedShots, placeShip, receiveAttack, allShipsSunk, changeOrientation, allShipsPlaced };
}

export function createPlayer(name, type) {
  let board = createGameboard();
  let getName = () => name.trim();
  let getType = () => {
    try {
      type = type.trim().toLowerCase();
      if (
        type === "human" ||
        type === "computer"
      ) {
        return type;
      } else {
        throw new Error("Invalid player type");
      }
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }

  return { getName, getType, board }
}

export function randomPlacement(board) {
  let ship1 = createShip(1);
  let ship2 = createShip(2);
  let ship3 = createShip(3);
  let ship4 = createShip(4);
  let ship5 = createShip(5);
  let result;
  do {
    let randomRow = randomIndex();
    let randomCol = randomIndex();
    let randomOrientation = (Math.floor(Math.random() * 2) === 1) ? "horizontal" : "vertical";
    result = board.placeShip(ship1, randomRow, randomCol, randomOrientation);
  } while (result === null);

  do {
    let randomRow = randomIndex();
    let randomCol = randomIndex();
    let randomOrientation =
      Math.floor(Math.random() * 2) === 1 ? "horizontal" : "vertical";
    result = board.placeShip(
      ship2,
      randomRow,
      randomCol,
      randomOrientation,
    );
  } while (result === null);

  do {
    let randomRow = randomIndex();
    let randomCol = randomIndex();
    let randomOrientation =
      Math.floor(Math.random() * 2) === 1 ? "horizontal" : "vertical";
    result = board.placeShip(
      ship3,
      randomRow,
      randomCol,
      randomOrientation,
    );
  } while (result === null);

  do {
    let randomRow = randomIndex();
    let randomCol = randomIndex();
    let randomOrientation =
      Math.floor(Math.random() * 2) === 1 ? "horizontal" : "vertical";
    result = board.placeShip(
      ship4,
      randomRow,
      randomCol,
      randomOrientation,
    );
  } while (result === null);

  do {
    let randomRow = randomIndex();
    let randomCol = randomIndex();
    let randomOrientation =
      Math.floor(Math.random() * 2) === 1 ? "horizontal" : "vertical";
    result = board.placeShip(
      ship5,
      randomRow,
      randomCol,
      randomOrientation,
    );
  } while (result === null);

}

export function randomReceiveAttack(board) {
  let result;
  let randomRow;
  let randomCol;
  do {
     randomRow = randomIndex();
     randomCol = randomIndex();
    result = board.receiveAttack(randomRow, randomCol);
  } while (result === null);
  return [randomRow, randomCol, result];
}

export const randomIndex = () => Math.floor(Math.random() * 10);