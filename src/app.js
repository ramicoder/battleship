import "./styles.css";
import {  createShip, createGameboard, createPlayer } from "./factories.js";

const button = document.getElementById("player-button");
const input = document.querySelector("input");

const playerBoard = document.getElementById("player-board");
const computerBoard = document.getElementById("computer-board");

for (let i = 0; i < 100; i++) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  playerBoard.appendChild(cell);
}
for (let i = 0; i < 100; i++) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  computerBoard.appendChild(cell);
}

//enable players to put the ships
//let computer place its ships

button.addEventListener("click", () => {

  //if (input.value === "")
        //add an error msg

  //create a player with that name
  //spot picking logic turn by turn while all ships are not sunk
  //once loop is done display winner
}

);
