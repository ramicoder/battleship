export function createShip(length, hits, sunk = false) {

    let getLength = () => {
        return length;
    };

    let setLength = newLength => {
        length = newLength;
    };

    let getHits = () => {
        return hits;
    };

    let hit = () => {
        hit = hit + 1;
    };

    let sink = () => {
        sunk = true;
    };

    let isSunk = () => {
        if (hits === length) {
            sink();
            return sunk;
        }
        sunk = false;
        return sunk;
    }
    return { getLength, setLength, getHits, hit, sink, isSunk };
}