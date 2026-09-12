import "./styles.css";
import {  createShip, createGameboard, createPlayer, randomPlacement, randomReceiveAttack} from "./factories.js";

const ship1 = createShip(1);
const ship2 = createShip(2);
const ship3 = createShip(3);
const ship4 = createShip(4);
const ship5 = createShip(5);

let player;
let system;

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
        dockedShip.setAttribute("draggable", "false");
        dockedShip.style.opacity = "0.3";
        console.log(`Ship of length ${length} placed at ${row}, ${startCol}`)

        switch (length){
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
      let targetCell = document.querySelector(`.cell[data-row = "${startRow + i}"][data-col = "${startCol}"]`);
      if (targetCell && targetCell.classList.contains("ship-placed")) return;
    }

    for (let i = 1; i < length; i++) {
      let targetCell = document.querySelector(`[data-row = "${startRow}"][data-col= "${startCol + i}"]`);
      targetCell.classList.remove('ship-placed');
    }
    for (let i = 0; i < length; i++) {
      let targetCell = document.querySelector(`[data-row = "${startRow + i}"][data-col = "${startCol}"]`);
      targetCell.classList.add('ship-placed');
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

})

const input = document.querySelector("input");
const ageError = document.getElementById('ageError')
const shipDock = document.querySelector('.ship-dock')
const computerSide = document.querySelector('.computer-side')

let attacking = document.querySelector(".attack")
let attacked = document.querySelector(".attacked");


button.addEventListener('click', () => {
  if (input.value.trim() === "") {
    ageError.textContent = "This field cannot be left blank.";
    input.style.backgroundColor = "#5e2929";
    return;
  } else {
    player = createPlayer(input.value, "human");
    system = createPlayer("The Matrix ", "computer")

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
})

function attack(cell, x, y) {
  if (isNaN(x) || isNaN(y)) return;

  let attempt = computerBoardLogic.receiveAttack(x, y);

  if (attempt === true) {
    cell.style.backgroundColor = "#ff0000";
    cell.style.pointerEvents = "none";

    if (computerBoardLogic.allShipsSunk()) {
      showGameOver(`${player.getName()} won!`);
      computerBoard.style.pointerEvents = "none";
      playerBoard.style.pointerEvents = "none";
      return;
    }
  } else {
    cell.style.backgroundColor = "#604a4a";
    cell.style.pointerEvents = "none";

    attacking.classList.add("hidden");
    attacked.classList.remove("hidden");
    computerBoard.style.pointerEvents = "none";

    setTimeout(getAttacked, 1000);
  }
}

function getAttacked() {
  let attackData = randomReceiveAttack(playerBoardLogic);
  let row = attackData[0];
  let col = attackData[1];
  let attempt = attackData[2];

  let targetCell = playerBoard.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );

  if (attempt === true) {
    targetCell.style.backgroundColor = "#ff0000";
    if (playerBoardLogic.allShipsSunk()) {
      showGameOver(`${system.getName()} won!`);
      computerBoard.style.pointerEvents = "none";
      playerBoard.style.pointerEvents = "none";
      return;
    }
    setTimeout(getAttacked, 1000);
  } else {
    targetCell.style.backgroundColor = "#604a4a";

    attacked.classList.add("hidden");
    attacking.classList.remove("hidden");
    computerBoard.style.pointerEvents = "auto";
  }
}

const modal = document.getElementById("game-over-modal");
const modalText = document.getElementById("game-over-text");

function showGameOver(message) {
  modalText.textContent = message;
  modal.classList.remove("hidden");
  computerBoard.style.pointerEvents = "none";
  playerBoard.style.pointerEvents = "none";
}
//soundeffects