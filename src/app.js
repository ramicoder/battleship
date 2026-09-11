import "./styles.css";
import {  createShip, createGameboard, createPlayer } from "./factories.js";

const ship1 = createShip(1);
const ship2 = createShip(2);
const ship3 = createShip(3);
const ship4 = createShip(4);
const ship5 = createShip(5);

const playerBoardLogic = createGameboard();
const computerBoardLogic = createGameboard();


const button = document.getElementById("player-button");
const input = document.querySelector("input");

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
    playerBoard.appendChild(cell);
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

//let computer place its ships
//make sure console logic code works in parallel
//button.addEventListener("click", () => {

  //if (input.value === "")
        //add an error msg

  //create a player with that name
  //spot picking logic turn by turn while all ships are not sunk
  //once loop is done display winner
//});
