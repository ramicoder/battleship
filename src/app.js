import "./styles.css";
import winSound from "./winner.mp3";
import lostSound from "./lostAudio.mp3";
import splashSound from "./splash.mp3";
import hitSound from "./hit.mp3";
import sinkSound from "./shipsink.mp3";
import placeSound from "./placing.mp3";
import {
  createShip,
  createGameboard,
  createPlayer,
  randomPlacement,
  randomReceiveAttack,
  receiveAttackMedium
} from "./factories.js";


const modal = document.getElementById("game-over-modal");
const modalText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");

const easyRadio = document.getElementById("easy");
const mediumRadio = document.getElementById("medium");
const hardRadio = document.getElementById("hard");

let radios = [easyRadio, mediumRadio, hardRadio];

playAgain.addEventListener("click", () => location.reload()
);

const ship1 = createShip(1);
const ship2 = createShip(2);
const ship3 = createShip(3);
const ship4 = createShip(4);
const ship5 = createShip(5);
const shipsArr = [ship1, ship2, ship3, ship4, ship5];

const winAudio = new Audio(winSound);
const lostAudio = new Audio(lostSound);
const splash = new Audio(splashSound);
const hit = new Audio(hitSound);
const sink = new Audio(sinkSound);
const placeAudio = new Audio(placeSound);

let player;
let system;
let difficulty;

const button = document.getElementById("player-button");
button.disabled = "true";
button.style.opacity = "0.5";

const playerBoardLogic = createGameboard();
const computerBoardLogic = createGameboard();

const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = "player-cell";
    cell.dataset.row = i;
    cell.dataset.col = j;
    playerBoard.appendChild(cell);
  }
}
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = "computer-cell";
    cell.dataset.row = i;
    cell.dataset.col = j;
    computerBoard.appendChild(cell);
  }
}

let draggedBoxIndex = 0;
const ships = document.querySelectorAll(".ship");

ships.forEach((ship) => {
  ship.addEventListener("mousedown", (e) => {
    draggedBoxIndex = Array.from(ship.children).indexOf(e.target);
  });

  ship.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("length", e.currentTarget.dataset.length);
    e.dataTransfer.setData("offsetX", draggedBoxIndex);
    e.dataTransfer.setData("shipId", e.currentTarget.id);
  });
});

const cells = document.querySelectorAll(".cell");

cells.forEach((cell) => {
  cell.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  cell.addEventListener("drop", (e) => {
    e.preventDefault();

    let length = parseInt(e.dataTransfer.getData("length"));
    let offsetX = parseInt(e.dataTransfer.getData("offsetX"));

    let row = parseInt(e.target.dataset.row);

    let startCol = parseInt(e.target.dataset.col) - offsetX;

    let canPlace = true;
    for (let i = 0; i < length; i++) {
      let targetCell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${startCol + i}"]`,
      );

      if (!targetCell || targetCell.classList.contains("ship-placed")) {
        canPlace = false;
        break;
      }
    }
    if (canPlace) {
      for (let i = 0; i < length; i++) {
        let targetCell = document.querySelector(
          `.cell[data-row="${row}"][data-col="${startCol + i}"]`,
        );
        targetCell.classList.add("ship-placed");
        targetCell.dataset.startRow = row;
        targetCell.dataset.startCol = startCol;
        targetCell.dataset.length = length;
        targetCell.dataset.orientation = "horizontal";
      }

      let shipId = e.dataTransfer.getData("shipId");
      let dockedShip = document.getElementById(shipId);
      if (dockedShip) {
        placeAudio.play();
        dockedShip.setAttribute("draggable", "false");
        dockedShip.style.opacity = "0.3";
        console.log(`Ship of length ${length} placed at ${row}, ${startCol}`);

        switch (length) {
          case 1:
            playerBoardLogic.placeShip(ship1, row, startCol, "horizontal");
            break;
          case 2:
            playerBoardLogic.placeShip(ship2, row, startCol, "horizontal");
            break;
          case 3:
            playerBoardLogic.placeShip(ship3, row, startCol, "horizontal");
            break;
          case 4:
            playerBoardLogic.placeShip(ship4, row, startCol, "horizontal");
            break;
          case 5:
            playerBoardLogic.placeShip(ship5, row, startCol, "horizontal");
            break;
        }
        if (playerBoardLogic.allShipsPlaced()) {
          button.disabled = false;
          button.style.opacity = "1";
        }
      }
    }
  });
});

playerBoard.addEventListener("click", (e) => {
  let cell = e.target;
  if (!cell.classList.contains("ship-placed")) return;

  let length = parseInt(cell.dataset.length);
  let startCol = parseInt(cell.dataset.startCol);
  let startRow = parseInt(cell.dataset.startRow);
  let orientation = cell.dataset.orientation;

  switch (length) {
    case 2:
      playerBoardLogic.changeOrientation(ship2);
      break;
    case 3:
      playerBoardLogic.changeOrientation(ship3);
      break;
    case 4:
      playerBoardLogic.changeOrientation(ship4);
      break;
    case 5:
      playerBoardLogic.changeOrientation(ship5);
      break;
  }
  if (length === 1) return;

  if (orientation === "horizontal") {
    if (startRow + (length - 1) > 9) return;

    for (let i = 1; i < length; i++) {
      let targetCell = document.querySelector(
        `.cell[data-row = "${startRow + i}"][data-col = "${startCol}"]`,
      );
      if (targetCell && targetCell.classList.contains("ship-placed")) return;
    }

    for (let i = 1; i < length; i++) {
      let targetCell = document.querySelector(
        `[data-row = "${startRow}"][data-col= "${startCol + i}"]`,
      );
      targetCell.classList.remove("ship-placed");
    }
    for (let i = 0; i < length; i++) {
      let targetCell = document.querySelector(
        `[data-row = "${startRow + i}"][data-col = "${startCol}"]`,
      );
      targetCell.classList.add("ship-placed");
      targetCell.dataset.orientation = "vertical";
      targetCell.dataset.startRow = startRow;
      targetCell.dataset.startCol = startCol;
      targetCell.dataset.length = length;
    }
  }

  if (orientation === "vertical") {
    if (startCol + (length - 1) > 9) return;

    for (let i = 1; i < length; i++) {
      let targetCell = document.querySelector(
        `.cell[data-row = "${startRow}"][data-col = "${startCol + i}"]`,
      );
      if (targetCell && targetCell.classList.contains("ship-placed")) return;
    }

    for (let i = 1; i < length; i++) {
      let targetCell = document.querySelector(
        `[data-row = "${startRow + i}"][data-col= "${startCol}"]`,
      );
      targetCell.classList.remove("ship-placed");
    }
    for (let i = 0; i < length; i++) {
      let targetCell = document.querySelector(
        `[data-row = "${startRow}"][data-col = "${startCol + i}"]`,
      );
      targetCell.classList.add("ship-placed");
      targetCell.dataset.orientation = "horizontal";
      targetCell.dataset.startRow = startRow;
      targetCell.dataset.startCol = startCol;
      targetCell.dataset.length = length;
    }
  }
});
computerBoard.addEventListener("click", (e) => {
  let cell = e.target;
  let row = parseInt(cell.dataset.row);
  let col = parseInt(cell.dataset.col);
  attack(cell, row, col);
});

const input = document.querySelector("input");
const ageError = document.getElementById("ageError");
const shipDock = document.querySelector(".ship-dock");
const computerSide = document.querySelector(".computer-side");

let attacking = document.querySelector(".attack");
let attacked = document.querySelector(".attacked");

button.addEventListener("click", () => {
  if (input.value.trim() === "") {
    ageError.textContent = "This field cannot be left blank.";
    input.style.backgroundColor = "#5e2929";
    return;
  } else {
    difficulty = radios.find((radio) => radio.checked);
    radios.map((radio) => radio.disabled = true);
    player = createPlayer(input.value, "human");
    system = createPlayer("The Matrix ", "computer");

    player.board = playerBoardLogic;
    system.board = computerBoardLogic;

    ageError.textContent = "";
    input.style.backgroundColor = "#1e293b";
    shipDock.classList.add("hidden");
    computerSide.classList.remove("hidden");
    playerBoard.style.pointerEvents = "none";
    attacking.classList.remove("hidden");
    button.disabled = true;
    randomPlacement(computerBoardLogic);
  }
});

let adjacentAttempts = 0;
let rowToAttack = 0;
let colToAttack = 0;
function attack(cell, x, y) {
  let sunkBefore = computerBoardLogic
    .getShips()
    .filter((ship) => ship.isSunk()).length;
  if (isNaN(x) || isNaN(y)) return;

  let attempt = computerBoardLogic.receiveAttack(x, y);

  if (attempt === true) {
    let sunkAfter = computerBoardLogic
      .getShips()
      .filter((ship) => ship.isSunk()).length;
    cell.style.backgroundColor = "#ff0000";
    cell.style.pointerEvents = "none";
    if (sunkAfter > sunkBefore) {
      sink.play();
    } else {
      hit.play();
    }
    if (computerBoardLogic.allShipsSunk()) {
      showGameOver(`${player.getName()} won!`);
      winAudio.play();
      computerBoard.style.pointerEvents = "none";
      playerBoard.style.pointerEvents = "none";
      return;
    }
  } else {
    splash.play();
    cell.style.backgroundColor = "#604a4a";
    cell.style.pointerEvents = "none";

    attacking.classList.add("hidden");
    attacked.classList.remove("hidden");
    computerBoard.style.pointerEvents = "none";
    if (difficulty === easyRadio) {
      setTimeout(getAttacked, 1200);
    }
    else if (difficulty === mediumRadio) {

      setTimeout(
        () => getAttackedMedium(rowToAttack, colToAttack, adjacentAttempts),
        1200,
      );
    }
  }
}

function getAttacked() {
  let sunkBefore = shipsArr.filter((ship) => ship.isSunk()).length;

  let attackData = randomReceiveAttack(playerBoardLogic);
  let row = attackData[0];
  let col = attackData[1];
  let attempt = attackData[2];

  let targetCell = playerBoard.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );

  if (attempt === true) {

    updateCellOnHit(targetCell, sunkBefore);
    if (playerBoardLogic.allShipsSunk()) {
      showGameOver(`${system.getName()} won!`);
      lostAudio.play();
      computerBoard.style.pointerEvents = "none";
      playerBoard.style.pointerEvents = "none";
      return;
    }
    setTimeout(getAttacked, 1200);
  } else {
    targetCell.style.backgroundColor = "#604a4a";
    splash.play();

    attacked.classList.add("hidden");
    attacking.classList.remove("hidden");
    computerBoard.style.pointerEvents = "auto";
  }
}

function showGameOver(message) {
  modalText.textContent = message;
  modal.classList.remove("hidden");
  computerBoard.style.pointerEvents = "none";
  playerBoard.style.pointerEvents = "none";
}

let attackedMediumAttempts = 0;
function getAttackedMedium(rowToAttack, colToAttack, adjacentAttempts) {

  let sunkBefore = shipsArr.filter((ship) => ship.isSunk()).length;
  let row;
  let col;
  let attempt;

  if (attackedMediumAttempts === 0) {
    if (adjacentAttempts === 0) {
      let attackData = randomReceiveAttack(playerBoardLogic);
      row = attackData[0];
      col = attackData[1];
      attempt = attackData[2];
      //row = 1, col = 5, attempt = true
    } else {
        row = rowToAttack;
        col = colToAttack;
        attempt = playerBoardLogic.receiveAttack((row, col));
    }
  }


  let targetCell = playerBoard.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );

  if (attempt === true) {
    let sunkBefore = getSunkBefore();
    updateCellOnHit(targetCell, sunkBefore);
    if (playerBoardLogic.allShipsSunk()) {
      showGameOver(`${system.getName()} won!`);
      lostAudio.play();
      computerBoard.style.pointerEvents = "none";
      playerBoard.style.pointerEvents = "none";
      return;
    }

    //upwards
    if (adjacentAttempts === 0) {
      attempt = playerBoardLogic.receiveAttack(row - 1, col);
      if (attempt === null || attempt === false) {
        //make it hit right next time
        adjacentAttempts++;
        // turn them to right
        rowToAttack = row;
        colToAttack = col + 1
        targetCell = playerBoard.querySelector(
          `.cell[data-row="${row - 1}"][data-col="${col}"]`,
        );
        targetCell.style.backgroundColor = "#604a4a";
        splash.play();
        computerBoard.style.pointerEvents = "auto";
        return;
      } //to the right
      else {

          attackedMediumAttempts++;
          setTimeout(
            () => getAttackedMedium(rowToAttack, colToAttack, adjacentAttempts),
            1200,
          );
      }
    } else if (adjacentAttempts === 1) {
      attempt = playerBoardLogic.receiveAttack(rowToAttack, colToAttack);
      if (attempt === null || attempt === false) {
        //make it hit down next time
        adjacentAttempts++;
        //turn them to down
        rowToAttack = row + 1;
        colToAttack = col;
        targetCell = playerBoard.querySelector(
          `.cell[data-row="${row}"][data-col="${col + 1}"]`,
        );
        targetCell.style.backgroundColor = "#604a4a";
        splash.play();
        computerBoard.style.pointerEvents = "auto";
        return;
      } else {
        attackedMediumAttempts++;
        setTimeout(
          () => getAttackedMedium(rowToAttack, colToAttack, adjacentAttempts),
          1200,
        );
      }
      //go downwards
    } else if (adjacentAttempts === 2) {
      attempt = playerBoardLogic.receiveAttack(rowToAttack, colToAttack);
      if (attempt === null || attempt === false) {
        //make it hit left next time
        adjacentAttempts++;
        //turn them left
        rowToAttack = row;
        colToAttack = col - 1;
        targetCell = playerBoard.querySelector(
          `.cell[data-row="${row + 1}"][data-col="${col}"]`,
        );
        targetCell.style.backgroundColor = "#604a4a";
        splash.play();
        computerBoard.style.pointerEvents = "auto";
        return;
      } else {
        attackedMediumAttempts++;
        setTimeout(
          () => getAttackedMedium(rowToAttack, colToAttack, adjacentAttempts),
          1200,
        );
      }
    } else {
      attempt = playerBoardLogic.receiveAttack(rowToAttack, colToAttack);
      if (attempt === null || attempt === false) {
        //make it hit left next time
        adjacentAttempts = 0;
        targetCell = playerBoard.querySelector(
          `.cell[data-row="${row}"][data-col="${col - 1}"]`,
        );
        targetCell.style.backgroundColor = "#604a4a";
        splash.play();
        computerBoard.style.pointerEvents = "auto";
        return;
      } else {
        attackedMediumAttempts++;
        setTimeout(
          () => getAttackedMedium(rowToAttack, colToAttack, adjacentAttempts),
          1200,
        );
      }
    }
  } else {
    adjacentAttempts = 0;
    attackedMediumAttempts = 0;
    targetCell.style.backgroundColor = "#604a4a";
    splash.play();

    attacked.classList.add("hidden");
    attacking.classList.remove("hidden");
    computerBoard.style.pointerEvents = "auto";
    return;
  }

}

function updateCellOnHit(targetCell, sunkBefore) {
  targetCell.style.backgroundColor = "#ff0000";

  let sunkAfter = shipsArr.filter((ship) => ship.isSunk()).length;

  if (sunkAfter > sunkBefore) {
    sink.play();
  } else {
    hit.play();
  }
}

function getSunkBefore() {
  return  computerBoardLogic
    .getShips()
    .filter((ship) => ship.isSunk()).length;
}