# Battleship

[**Play the Live Game Here**](https://ramicoder.github.io/battleship/)

A classic web-based Battleship game built with vanilla JavaScript. This project focuses on object-oriented programming, drag-and-drop UI mechanics, and managing complex game states through asynchronous turn-based loops.

## Features

* **Test-Driven Development:** Core game logic (Ships, Gameboards, Players) was built and verified using Jest unit tests.
* **Drag-and-Drop Placement:** Interactively drag, drop, and click to rotate ships on your grid before the match begins.
* **Dynamic Game Loop:** Uses recursive timeouts to simulate a natural pacing for the computer's attacks.
* **Seamless Resets:** The UI and game boards fully regenerate upon restarting without requiring a page reload.
* **Factory Pattern Architecture:** Game logic is strictly separated from DOM manipulation for clean, maintainable code.

## Technologies & Tools

* **JavaScript (ES6+)**
* **HTML5 & CSS3**
* **Webpack & Babel:** Module bundling and backwards compatibility.
* **Jest:** Unit testing framework for game logic.
* **ESLint & Prettier:** Code formatting and quality enforcement.

## Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ramicoder/battleship.git
   ```
2. Navigate to the directory:
   ```bash
   cd battleship
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Webpack development server (adjust based on your package.json script):
   ```bash
   npm run dev
   ```
5. Run the Jest test suite:
   ```bash
   npm test
   ```

## How to Play

1. Drag your five ships onto the left board. Click any placed ship to toggle its orientation between horizontal and vertical.
2. Enter your name in the input field to start.
3. Once the fleet is positioned, the computer will randomize its board, and the game begins.
4. Click coordinates on the enemy grid to attack. Red indicates a hit; gray indicates a miss.
5. Sink all five enemy ships before the computer destroys your fleet.
