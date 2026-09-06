import { createShip, createGameboard } from "./factories.js";


let ship4 = createShip(4);
let ship5 = createShip(5);

test("Test vertical positioning", function() {
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
    expect( () => (board.placeShip(ship4, -1, 1, "vertical"))).toThrow("Position is not valid");
})

test("Invalid orientation", function() {
    let board = createGameboard();
    expect( () => (board.placeShip(ship4, 1, 1, "verticaal"))).toThrow("Orientation is not valid");
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

test("Test horizontal positioning", function() {
    let board = createGameboard();
    expect(board.placeShip(ship5, 4, 3, "horizontal")).toEqual(
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 5, 5, 5, 5, 5, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    );
})

test("Test position overlapping", function() {
    let board = createGameboard();
    board.placeShip(ship5, 4, 3, "horizontal")
    expect( () => (
        board.placeShip(ship4, 1, 4, "vertical"))).toThrow("Position is not valid");
})

test("Duplicated ship placement", function() {
    let board = createGameboard();
    board.placeShip(ship5, 1, 1, "horizontal")
    expect( () => 
        (board.placeShip(ship5, 4, 3, "horizontal"))).toThrow(
            "Ship with this length already exists")
})

test("Attacking empty water", function() {
    let board = createGameboard();
    expect( board.receiveAttack(0, 0)).toBe(false);
})

test("Attacking a ship", function() {
    let board = createGameboard();
    board.placeShip(ship5, 4, 3, "horizontal")
    expect( board.receiveAttack(4, 6)).toBe(true);
})

test("Updating ship's hit count after it receives at attack", function() {
    let board = createGameboard();
    let ship3 = createShip(3);
    board.placeShip(ship3, 4, 3, "horizontal");
    board.receiveAttack(4, 4);
    board.receiveAttack(4, 5);
    expect( ship3.getHits()).toBe(2);
})

test("Updating ship's hit count after it receives at attack", function() {
    let board = createGameboard();
    let ship3 = createShip(3);
    board.placeShip(ship3, 4, 3, "horizontal");
    board.receiveAttack(4, 4);
    board.receiveAttack(4, 5);
    expect( board.receiveAttack(4, 4)).toBe(false);
})