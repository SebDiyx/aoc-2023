import fs from 'fs';

const STEPS = 64;

type Queue = {
    x: number;
    y: number;
    steps: number;
}[];

function printGrid(grid: string[][]) {
    console.log(grid.map((row) => row.join('')).join('\n'));
}

function getStartPoint(grid: string[][]) {
    let x = 0;
    let y = 0;
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 'S') {
                x = colIndex;
                y = rowIndex;
            }
        });
    });
    return { x, y };
}

/**
 * starting position (S),
 * garden plots (.), and
 * rocks (#)
 *
 * The Elf starts at the starting position (S) which also counts as a garden plot
 */
function traverseGrid(grid: string[][]) {
    const startPoint = getStartPoint(grid);

    const queue: Queue = [{ x: startPoint.x, y: startPoint.y, steps: 0 }];
    const endPoints: Queue = [];
    while (queue.length) {
        const { x, y, steps } = queue.shift()!;
        const cell = grid[y][x];
        if (cell === '#') continue;

        if (steps === STEPS) {
            if (!endPoints.find((p) => p.x === x && p.y === y)) {
                endPoints.push({ x, y, steps });
            }
            continue;
        }

        if (!queue.find((p) => p.x === x + 1 && p.y === y)) {
            queue.push({ x: x + 1, y, steps: steps + 1 });
        }
        if (!queue.find((p) => p.x === x - 1 && p.y === y)) {
            queue.push({ x: x - 1, y, steps: steps + 1 });
        }
        if (!queue.find((p) => p.x === x && p.y === y + 1)) {
            queue.push({ x, y: y + 1, steps: steps + 1 });
        }
        if (!queue.find((p) => p.x === x && p.y === y - 1)) {
            queue.push({ x, y: y - 1, steps: steps + 1 });
        }
    }

    return endPoints;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const grid = input.split('\n').map((row) => row.split(''));
const endPoints = traverseGrid(grid);
console.log([...endPoints].length); //TODO: Seb remove <--------------
