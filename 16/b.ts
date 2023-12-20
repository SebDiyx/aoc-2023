import fs from 'fs';

type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * empty space (.),
 * mirrors (/ and \), and
 * splitters (| and -).
 */

function printGrid(grid: string[][]) {
    grid.forEach((row) => {
        console.log(row.join(''));
    });
}

function getNextPos(
    grid: string[][],
    dir: Direction,
    pos: { x: number; y: number },
): { x: number; y: number } | null {
    const cell = grid[pos.y][pos.x];
    let nextPos = { ...pos };
    if (dir === 'left') {
        nextPos.x -= 1;
    } else if (dir === 'right') {
        nextPos.x += 1;
    } else if (dir === 'up') {
        nextPos.y -= 1;
    } else if (dir === 'down') {
        nextPos.y += 1;
    }
    if (
        nextPos.y < 0 ||
        nextPos.y >= grid.length ||
        nextPos.x < 0 ||
        nextPos.x >= grid[0].length
    ) {
        return null;
    }
    return nextPos;
}

const cache = new Map<string, number>();

function traverseGrid(
    grid: string[][],
    dir: Direction,
    pos: { x: number; y: number },
) {
    if (cache.has(`${pos.x},${pos.y}-${dir}`)) {
        return;
    } else {
        cache.set(`${pos.x},${pos.y}-${dir}`, 1);
    }

    const cell = grid[pos.y][pos.x];

    if (cell === '.') {
        energizedGrid[pos.y][pos.x] = '#';

        // Continue travelling in the same dir
        let nextPos = getNextPos(grid, dir, pos);
        if (nextPos === null) return;
        traverseGrid(grid, dir, nextPos);
    } else if (cell === '/') {
        energizedGrid[pos.y][pos.x] = '#';
        if (dir === 'up') {
            const nextPos = getNextPos(grid, 'right', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'right', nextPos);
        } else if (dir === 'down') {
            let nextPos = getNextPos(grid, 'left', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'left', nextPos);
        } else if (dir === 'left') {
            let nextPos = getNextPos(grid, 'down', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'down', nextPos);
        } else if (dir === 'right') {
            let nextPos = getNextPos(grid, 'up', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'up', nextPos);
        }
    } else if (cell === '\\') {
        energizedGrid[pos.y][pos.x] = '#';
        if (dir === 'up') {
            const nextPos = getNextPos(grid, 'left', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'left', nextPos);
        } else if (dir === 'down') {
            let nextPos = getNextPos(grid, 'right', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'right', nextPos);
        } else if (dir === 'left') {
            let nextPos = getNextPos(grid, 'up', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'up', nextPos);
        } else if (dir === 'right') {
            let nextPos = getNextPos(grid, 'down', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'down', nextPos);
        }
    } else if (cell === '|') {
        energizedGrid[pos.y][pos.x] = '#';
        if (dir === 'up') {
            let nextPos = getNextPos(grid, 'up', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'up', nextPos);
        } else if (dir === 'down') {
            let nextPos = getNextPos(grid, 'down', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'down', nextPos);
        } else if (dir === 'left') {
            let nextPosUp = getNextPos(grid, 'up', pos);
            if (nextPosUp) {
                traverseGrid(grid, 'up', nextPosUp);
            }
            let nextPosDown = getNextPos(grid, 'down', pos);
            if (nextPosDown) {
                traverseGrid(grid, 'down', nextPosDown);
            }
        } else if (dir === 'right') {
            let nextPosUp = getNextPos(grid, 'up', pos);
            if (nextPosUp) {
                traverseGrid(grid, 'up', nextPosUp);
            }
            let nextPosDown = getNextPos(grid, 'down', pos);
            if (nextPosDown) {
                traverseGrid(grid, 'down', nextPosDown);
            }
        }
    } else if (cell === '-') {
        energizedGrid[pos.y][pos.x] = '#';
        if (dir === 'left') {
            let nextPos = getNextPos(grid, 'left', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'left', nextPos);
        } else if (dir === 'right') {
            let nextPos = getNextPos(grid, 'right', pos);
            if (nextPos === null) return;
            traverseGrid(grid, 'right', nextPos);
        } else if (dir === 'up') {
            let nextPosLeft = getNextPos(grid, 'left', pos);
            if (nextPosLeft) {
                traverseGrid(grid, 'left', nextPosLeft);
            }
            let nextPosRight = getNextPos(grid, 'right', pos);
            if (nextPosRight) {
                traverseGrid(grid, 'right', nextPosRight);
            }
        } else if (dir === 'down') {
            let nextPosLeft = getNextPos(grid, 'left', pos);
            if (nextPosLeft) {
                traverseGrid(grid, 'left', nextPosLeft);
            }
            let nextPosRight = getNextPos(grid, 'right', pos);
            if (nextPosRight) {
                traverseGrid(grid, 'right', nextPosRight);
            }
        }
    }
}

function reset() {
    cache.clear();
    energizedGrid.forEach((row, y) => {
        row.forEach((cell, x) => {
            energizedGrid[y][x] = '.';
        });
    });
}

function countEnergizedCells() {
    let count = 0;
    energizedGrid.forEach((row) => {
        row.forEach((cell) => {
            if (cell === '#') {
                count++;
            }
        });
    });
    return count;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((line) => line.split(''));
const energizedGrid = grid.map((row) => row.map((cell) => '.'));

let max = 0;
// Call traverseGrid on every cell on the outside of the grid (top, bottom, left, right)
grid.forEach((row, y) => {
    row.forEach((cell, x) => {
        reset();
        if (y === 0) {
            // Top of grid
            traverseGrid(grid, 'down', { x, y });
        } else if (y === grid.length - 1) {
            // Bottom of grid
            traverseGrid(grid, 'up', { x, y });
        } else if (x === 0) {
            // Left side of grid
            traverseGrid(grid, 'right', { x, y });
        } else if (x === row.length - 1) {
            // Right side of grid
            traverseGrid(grid, 'left', { x, y });
        }

        const count = countEnergizedCells();
        if (count > max) {
            max = count;
        }
    });
});
console.log(max);
