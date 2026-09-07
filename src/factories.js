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
        return false;
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
    } catch (error) {return false;}
  };

  function isPositionValid(row, col) {
    if (row < 0 || row > 9 || col < 0 || col > 9 || board[row][col] !== 0) {
      return false;
    }
    return true;
  }

  return { board, missedShots, placeShip, receiveAttack };
}

function resetBoard(board) {
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
}
