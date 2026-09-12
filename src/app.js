import "./styles.css";
import {  createShip, createGameboard, createPlayer, randomPlacement, randomReceiveAttack} from "./factories.js";

const ship1 = createShip(1);
const ship2 = createShip(2);
const ship3 = createShip(3);
const ship4 = createShip(4);
const ship5 = createShip(5);

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

button.addEventListener('click', () => {
  if (input.value.trim() === "") {
    ageError.textContent = "This field cannot be left blank.";
    input.style.backgroundColor = "#5e2929";
    return;
  } else {
    ageError.textContent = "";
    input.style.backgroundColor = "#1e293b";
    shipDock.classList.add("hidden");
    computerSide.classList.remove("hidden");
    playerBoard.style.pointerEvents = "none";
    button.disabled = true;
    randomPlacement(computerBoardLogic);
  }
})

let attacking = document.querySelector(".attack")
let attacked = document.querySelector(".attacked");

function attack(cell, x, y) {
  let row = x;
  let col = y;
  if (isNaN(row) || isNaN(col)) {
    console.error("Player click failed. Cell data:", cell);
    return;
  }
  attacked.classList.add("hidden");
  attacking.classList.remove("hidden");
  let attempt = computerBoardLogic.receiveAttack(row, col);

  if (attempt === true) {
    cell.style.backgroundColor = "#ff0000";
    cell.style.pointerEvents = "none";
  } else {
    computerBoard.style.pointerEvents = "none";
    cell.style.backgroundColor = "#604a4a";
    cell.style.pointerEvents = "none";
    setTimeout(getAttacked, 1100);

  }

}

function getAttacked() {
  attacking.classList.add("hidden");
  attacked.classList.remove("hidden");

  let attempt;

  do {
    let coordinates = randomReceiveAttack(playerBoardLogic);
    let row = coordinates[0];
    let col = coordinates[1];

    let targetCell = playerBoard.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`,
    );
    attempt = coordinates[2];

    if (attempt === true) {
      targetCell.style.backgroundColor = "#ff0000";
    } else {
      targetCell.style.backgroundColor = "#604a4a";
    }
  } while (attempt === true);
  computerBoard.style.pointerEvents = "auto";
}

//correct turn by turn sequence (especially when they attack)
//appropriately positioning "attack" and "getting attacked"
//gameover logic