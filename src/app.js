import "./styles.css";
import {  createShip, createGameboard, createPlayer } from "./factories.js";

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
for (let i = 0; i < 100; i++) {
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

  console.log(cell.dataset.orientation);
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




//enable players to put the ships
//let computer place its ships

//button.addEventListener("click", () => {

  //if (input.value === "")
        //add an error msg

  //create a player with that name
  //spot picking logic turn by turn while all ships are not sunk
  //once loop is done display winner
//});
