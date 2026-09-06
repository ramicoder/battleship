import { createShip, createGameboard } from "./factories.js";


let ship1 = createShip(1);
let ship5 = createShip(5);

test("Test positioning", function() {
    let board = createGameboard();
    expect(board.placeShip(ship5, 1, 1, "vertical")).toEqual(
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    );
})

test("Invalid positioning", function() {
    let board = createGameboard();
    expect( () => (board.placeShip(ship1, -1, 1, "vertical"))).toThrow("Position is not valid");
})

test("Invalid orientation", function() {
    let board = createGameboard();
    expect( () => (board.placeShip(ship1, 1, 1, "verticaal"))).toThrow("Orientation is not valid");
})

test("Hitting a ship until sunken", function() {
    let board = createGameboard();
    //placing the ship
    board.placeShip(ship5, 1, 1, "vertical")
    //attacking the ship
    board.receiveAttack(1, 1);
    board.receiveAttack(2, 1);
    board.receiveAttack(3, 1);
    board.receiveAttack(4, 1);
    board.receiveAttack(5, 1);
    expect( ship5.isSunk()).toBe(true);
})

test("Hitting a ship and checking the hit count", function() {
    let ship = createShip(2);
    ship.hit();
    ship.hit();
    expect(ship.getHits()).toBe(2);
})