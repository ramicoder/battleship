import { createShip, createGameboard } from "./factories.js";


let myShip = createShip(5);
let board = createGameboard();

test("test positioning", function() {
    expect(board.placeShip(myShip, 1, 1, "vertical")).toEqual(
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    );
})

test("Invalid positioning", function() {
    expect( () => (board.placeShip(myShip, -1, 1, "vertical"))).toThrow("Position is not valid");
})

test("Invalid orientation", function() {
    expect( () => (board.placeShip(myShip, 1, 1, "verticaal"))).toThrow("Orientation is not valid");
})